from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.db import get_session
from app.models import User
from app.security import verify_password, create_access_token, hash_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(username: str, password: str, role: str = "operador", session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.username == username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    user = User(username=username, password_hash=hash_password(password), role=role)
    session.add(user)
    session.commit()
    return {"ok": True, "username": username, "role": role}

@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form.username)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    if not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role}