import hashlib
from fastapi import APIRouter, Depends, UploadFile, File, Request, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.models import Case, Evidence, AuditLog
from app.security import require_role

router = APIRouter(prefix="/cases", tags=["cases"])

def log_event(session: Session, actor: str, role: str, action: str, resource: str, ip: str, result: str = "OK"):
    session.add(AuditLog(actor=actor, role=role, action=action, resource=resource, ip=ip, result=result))
    session.commit()

@router.post("")
def create_case(
    title: str,
    description: str,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador"))
):
    actor = payload["sub"]
    role = payload["role"]
    c = Case(title=title, description=description, created_by=actor)
    session.add(c)
    session.commit()
    session.refresh(c)

    log_event(session, actor, role, "CREATE_CASE", f"case:{c.id}", request.client.host if request.client else "-")
    return c

@router.get("")
def list_cases(
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor"))
):
    return session.exec(select(Case).order_by(Case.created_at.desc()).all()).all()

@router.get("/{case_id}")
def get_case(
    case_id: int,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor"))
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    log_event(session, payload["sub"], payload["role"], "VIEW_CASE", f"case:{case_id}",
              request.client.host if request.client else "-")
    return c

@router.patch("/{case_id}/status")
def update_status(
    case_id: int,
    status: str,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador"))
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    c.status = status
    session.add(c)
    session.commit()

    log_event(session, payload["sub"], payload["role"], "UPDATE_STATUS", f"case:{case_id}",
              request.client.host if request.client else "-")
    return {"ok": True, "case_id": case_id, "status": status}

@router.post("/{case_id}/evidences")
async def upload_evidence(
    case_id: int,
    request: Request,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador"))
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    content = await file.read()
    sha256 = hashlib.sha256(content).hexdigest()

    ev = Evidence(case_id=case_id, filename=file.filename, sha256=sha256, uploaded_by=payload["sub"])
    session.add(ev)
    session.commit()
    session.refresh(ev)

    log_event(session, payload["sub"], payload["role"], "UPLOAD_EVIDENCE", f"case:{case_id}/evidence:{ev.id}",
              request.client.host if request.client else "-")
    return ev