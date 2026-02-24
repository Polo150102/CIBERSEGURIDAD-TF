from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db import get_session
from app.security import require_role
from app.models import InboxMessage

from fastapi import HTTPException

router = APIRouter(prefix="/inbox", tags=["inbox"])

@router.get("")
def get_inbox(
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    cip = payload["sub"]

    # trae mensajes globales + del usuario
    q = (
        select(InboxMessage)
        .where((InboxMessage.recipient == "ALL") | (InboxMessage.recipient == cip))
        .order_by(InboxMessage.created_at.desc())
    )
    return session.exec(q).all()

@router.patch("/{message_id}/read")
def mark_as_read(
    message_id: int,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    cip = payload["sub"]

    msg = session.get(InboxMessage, message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")

    # seguridad: solo dueño o ALL
    if msg.recipient not in ("ALL", cip):
        raise HTTPException(status_code=403, detail="No autorizado")

    msg.read = True
    session.add(msg)
    session.commit()
    session.refresh(msg)
    return msg