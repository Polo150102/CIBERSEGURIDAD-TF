from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select

from app.db import get_session
from app.models import AuditLog
from app.security import require_role

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("")
def list_audit(
    session: Session = Depends(get_session),
    _payload=Depends(require_role("admin", "auditor"))
):
    logs = session.exec(select(AuditLog).order_by(AuditLog.at.desc()).limit(200)).all()
    return logs