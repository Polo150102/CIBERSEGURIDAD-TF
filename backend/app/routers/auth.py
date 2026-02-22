# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db import get_session
from app.models import User, AuditLog
from app.security import verify_password, create_access_token

# IMPORTANTE: estos nombres ahora existen por el fix del twofa.py
from app.twofa import generate_base32_secret, verify_otp, qr_code_base64

import json
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])


def _now_iso():
    return datetime.utcnow().isoformat()


def _client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _audit(session: Session, actor: str, action: str, detail: dict):
    session.add(
        AuditLog(
            actor=actor,
            action=action,
            detail=json.dumps(detail, ensure_ascii=False),
            created_at=_now_iso(),
        )
    )
    session.commit()


class LoginSchema(BaseModel):
    username: str  # en tu UI es CIP
    password: str
    remember_session: bool = False  # tu checkbox 2FA


class Verify2FASchema(BaseModel):
    username: str  # CIP
    otp: str


@router.post("/login")
def login(body: LoginSchema, request: Request, session: Session = Depends(get_session)):
    cip = body.username.strip()
    ip = _client_ip(request)

    user = session.exec(select(User).where(User.cip == cip)).first()
    if not user or not verify_password(body.password, user.password_hash):
        _audit(session, cip or "unknown", "LOGIN_FAIL", {"ip": ip})
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # Si NO marcó "mantener sesión iniciada" => login normal
    if not body.remember_session:
        token = create_access_token({"sub": user.cip, "role": user.role})
        _audit(session, user.cip, "LOGIN_OK", {"ip": ip, "remember_session": False})
        return {"access_token": token, "token_type": "bearer"}

    # Si marcó remember => se exige 2FA
    # 1) Si aún no tiene 2FA configurado => devolver QR para setup
    if not user.twofa_secret:
        secret = generate_base32_secret()
        user.twofa_secret = secret
        user.twofa_enabled = False
        session.add(user)
        session.commit()

        qr_b64 = qr_code_base64(secret, f"{user.cip}")
        _audit(session, user.cip, "2FA_SETUP_ISSUED", {"ip": ip})
        return {
            "requires_2fa_setup": True,
            "username": user.cip,
            "qr_base64": qr_b64
        }

    # 2) Si ya tiene secret, pedir OTP
    _audit(session, user.cip, "2FA_REQUIRED", {"ip": ip})
    return {"requires_2fa": True, "username": user.cip}


@router.post("/verify-2fa")
def verify_2fa(body: Verify2FASchema, request: Request, session: Session = Depends(get_session)):
    cip = body.username.strip()
    ip = _client_ip(request)

    user = session.exec(select(User).where(User.cip == cip)).first()
    if not user or not user.twofa_secret:
        _audit(session, cip or "unknown", "2FA_VERIFY_FAIL", {"ip": ip, "reason": "no_secret"})
        raise HTTPException(status_code=400, detail="2FA no configurado para este usuario")

    if not verify_otp(user.twofa_secret, body.otp):
        _audit(session, user.cip, "2FA_VERIFY_FAIL", {"ip": ip, "reason": "invalid_otp"})
        raise HTTPException(status_code=401, detail="Código 2FA inválido")

    # Marca habilitado
    if not user.twofa_enabled:
        user.twofa_enabled = True
        session.add(user)
        session.commit()

    token = create_access_token({"sub": user.cip, "role": user.role})
    _audit(session, user.cip, "2FA_VERIFY_OK", {"ip": ip})

    return {"access_token": token, "token_type": "bearer"}