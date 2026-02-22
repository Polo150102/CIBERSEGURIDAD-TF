import time
import json
from datetime import datetime
from typing import Dict, Tuple

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session

from app.db import get_session
from app.models import Citizen, AuditLog

router = APIRouter(prefix="/reniec", tags=["RENIEC"])

# ✅ Rate limit simple (memoria) -> 429
# key: (ip, dni) -> (count, reset_epoch)
RATE: Dict[Tuple[str, str], Tuple[int, float]] = {}
WINDOW_SECONDS = 60
MAX_ATTEMPTS = 5


def _now_iso():
    return datetime.utcnow().isoformat()


def _client_ip(request: Request) -> str:
    # si luego pones proxy, podrías usar X-Forwarded-For
    return request.client.host if request.client else "unknown"


def _rate_limit(ip: str, dni: str):
    key = (ip, dni)
    now = time.time()
    count, reset = RATE.get(key, (0, now + WINDOW_SECONDS))

    if now > reset:
        count, reset = 0, now + WINDOW_SECONDS

    count += 1
    RATE[key] = (count, reset)

    if count > MAX_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Demasiados intentos. Bloqueo temporal activado por seguridad (HTTP 429).",
        )


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


@router.get("/validate/{dni}")
def validate_dni(dni: str, request: Request, session: Session = Depends(get_session)):
    # ✅ Validar formato
    if not dni.isdigit() or len(dni) != 8:
        _audit(session, "public", "RENIEC_VALIDATE_FAIL", {"dni": dni, "reason": "invalid_format"})
        raise HTTPException(status_code=400, detail="DNI inválido: debe tener 8 dígitos.")

    ip = _client_ip(request)

    # ✅ 429
    try:
        _rate_limit(ip, dni)
    except HTTPException:
        _audit(session, "public", "RENIEC_RATE_LIMIT", {"dni": dni, "ip": ip})
        raise

    # ✅ BD lookup (anti SQLi porque NO concatenas SQL)
    citizen = session.get(Citizen, dni)
    if not citizen:
        _audit(session, "public", "RENIEC_VALIDATE_FAIL", {"dni": dni, "ip": ip, "reason": "not_found"})
        raise HTTPException(status_code=404, detail="DNI no encontrado en RENIEC (mock).")

    data = {
        "dni": citizen.dni,
        "nombres": citizen.nombres,
        "apellidos": citizen.apellidos,
        "nacimiento": citizen.nacimiento,
    }

    _audit(session, "public", "RENIEC_VALIDATE_OK", {"dni": dni, "ip": ip})
    return data