import os
from datetime import datetime, timedelta
from typing import Dict, Any

from dotenv import load_dotenv
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from passlib.context import CryptContext
from passlib.exc import UnknownHashError

from sqlmodel import Session, select

from app.db import get_session
from app.models import User


load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "CHANGE_ME_SUPER_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

#pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(password, hashed)
    except (UnknownHashError, TypeError):
        return False


def create_access_token(data: Dict[str, Any], expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_role(*allowed_roles: str):
    def _checker(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
        payload = decode_token(token)
        role = payload.get("role")
        if role not in allowed_roles:
            raise HTTPException(status_code=403, detail="No autorizado por rol")
        return payload
    return _checker

def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    """
    Lee el JWT (Authorization: Bearer <token>),
    extrae el 'sub' (tu CIP) y devuelve el User desde BD.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        cip = payload.get("sub")
        if not cip:
            raise HTTPException(status_code=401, detail="Token inválido (sin sub)")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user = session.exec(select(User).where(User.cip == cip)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    return user