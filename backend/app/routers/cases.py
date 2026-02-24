import hashlib
import io
import json
import os
import re
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Tuple
from fastapi.responses import FileResponse

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db import get_session
from app.models import AuditLog, Case, Citizen, Evidence, User, Actuation, ExternalQuery
from app.security import get_current_user, require_role

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing


router = APIRouter(prefix="/cases", tags=["cases"])


# =========================
# Utils
# =========================
def _now_iso() -> str:
    return datetime.utcnow().isoformat()


def _fill_line(text: str, total: int = 60) -> str:
    """
    Devuelve 'TEXTO ____' hasta completar el ancho, simulando un campo de formulario.
    """
    t = (text or "").strip()
    if len(t) >= total:
        return t[:total]
    return t + " " + ("_" * (total - len(t) - 1))


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


def _validar_dni(dni: str) -> bool:
    return bool(re.fullmatch(r"\d{8}", dni))


def _case_integrity_hash(session: Session, case_id: int) -> str:
    """
    Hash SHA-256 del expediente:
    - datos clave del caso
    - lista de evidencias (id, filename, sha256, size_bytes, content_type, created_at)
    """
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    evidences = session.exec(
        select(Evidence).where(Evidence.case_id == case_id).order_by(Evidence.id.asc())
    ).all()

    payload = {
        "case": {
            "id": c.id,
            "citizen_dni": c.citizen_dni,
            "incident_type": c.incident_type,
            "location": c.location,
            "description": c.description,
            "created_by": c.created_by,
            "created_at": c.created_at,
        },
        "evidences": [
            {
                "id": e.id,
                "filename": e.filename,
                "sha256": e.sha256,
                "size_bytes": e.size_bytes,
                "content_type": e.content_type,
                "created_at": e.created_at,
                "filepath": e.filepath,
            }
            for e in evidences
        ],
    }

    canonical = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

def _expediente_code(case_id: int) -> str:
    # Formato como tu UI: 2026-00042
    return f"2026-{str(case_id).zfill(5)}"


def _ui_status(case_status: str) -> str:
    s = (case_status or "").upper().strip()
    if s == "DRAFT":
        return "Pendiente de Firma"
    if s == "SUBMITTED":
        return "Investigación"
    if s == "CLOSED":
        return "Elevado"
    return "Abierto"


def _ui_priority(incident_type: str) -> str:
    # Heurística demo (para que tu UI tenga ALTA/NORMAL/BAJA sin cambiar BD)
    t = (incident_type or "").upper()
    if "ROBO" in t or "ARMAS" in t or "SECUESTRO" in t:
        return "ALTA"
    if "VIOLENCIA" in t:
        return "NORMAL"
    return "BAJA"


# =========================
# Rate limit 429 (simple)
# key: (ip, dni) -> (count, reset_epoch)
# =========================
RATE: Dict[Tuple[str, str], Tuple[int, float]] = {}
WINDOW_SECONDS = 60
MAX_ATTEMPTS = 5


def _rate_limit_or_429(ip: str, dni: str):
    key = (ip, dni)
    now = time.time()

    count, reset = RATE.get(key, (0, now + WINDOW_SECONDS))
    if now > reset:
        count, reset = 0, now + WINDOW_SECONDS

    count += 1
    RATE[key] = (count, reset)

    if count > MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Demasiados intentos. Bloqueo temporal (HTTP 429).")


# =========================
# Schemas
# =========================
class CreateCaseSchema(BaseModel):
    dni: str
    incident_type: str
    location: str
    description: str


class SubmitCaseSchema(BaseModel):
    declaration_accepted: bool = True

class ActuationCreateSchema(BaseModel):
    title: str
    type: str = "ACTA"
    status: str = "PENDIENTE"
    occurred_at: str | None = None
    detail: str | None = None 

# =========================
# RENIEC validate (mock)
# GET /cases/validate-dni/{dni}
# =========================
@router.get("/validate-dni/{dni}")
def validate_dni(dni: str, request: Request, session: Session = Depends(get_session)):
    if not _validar_dni(dni):
        _audit(session, "public", "RENIEC_VALIDATE_FAIL", {"dni": dni, "reason": "invalid_format"})
        raise HTTPException(status_code=400, detail="DNI inválido: debe tener 8 dígitos.")

    ip = _client_ip(request)

    try:
        _rate_limit_or_429(ip, dni)
    except HTTPException:
        _audit(session, "public", "RENIEC_RATE_LIMIT", {"dni": dni, "ip": ip})
        raise

    citizen = session.get(Citizen, dni)
    if not citizen:
        _audit(session, "public", "RENIEC_VALIDATE_FAIL", {"dni": dni, "ip": ip, "reason": "not_found"})
        raise HTTPException(status_code=404, detail="DNI no encontrado en RENIEC (mock).")

    _audit(session, "public", "RENIEC_VALIDATE_OK", {"dni": dni, "ip": ip})
    return {
        "dni": citizen.dni,
        "nombres": citizen.nombres,
        "apellidos": citizen.apellidos,
        "nacimiento": citizen.nacimiento,
    }


# =========================
# Case CRUD
# =========================
@router.post("")
def create_case(
    body: CreateCaseSchema,
    request: Request,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    cip = current_user.cip

    dni = (body.dni or "").strip()
    incident_type = (body.incident_type or "").strip()
    location = (body.location or "").strip()
    description = (body.description or "").strip()

    if not _validar_dni(dni):
        raise HTTPException(status_code=400, detail="DNI inválido (8 dígitos).")

    if not location:
        raise HTTPException(status_code=400, detail="El lugar del suceso (location) es obligatorio.")

    if not description:
        raise HTTPException(status_code=400, detail="El relato (description) es obligatorio.")

    citizen = session.exec(select(Citizen).where(Citizen.dni == dni)).first()
    if not citizen:
        raise HTTPException(status_code=400, detail="DNI no encontrado en RENIEC mock (Citizen).")

    c = Case(
        citizen_dni=dni,
        incident_type=incident_type,
        location=location,
        description=description,
        status="DRAFT",
        created_by=cip,
        created_at=_now_iso(),
    )
    session.add(c)
    session.commit()
    session.refresh(c)
    

    if not c.id:
        raise HTTPException(status_code=500, detail="No se pudo generar ID del caso (revisar autoincrement en BD).")

    session.add(
        Actuation(
            case_id=c.id,
            occurred_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            title="Registro de Denuncia Inicial",
            responsible=f"{current_user.cip} {current_user.full_name}",
            type="ACTA",
            status="DIGITALIZADO",
            created_at=_now_iso(),
        )
    )
    session.commit()

    _audit(
        session,
        cip,
        "CREATE_CASE",
        {
            "case_id": c.id,
            "dni": c.citizen_dni,
            "incident_type": c.incident_type,
            "ip": _client_ip(request),
        },
    )
    return {
        "case_id": c.id,
        "id": c.id,
        "dni": c.citizen_dni,
        "incident_type": c.incident_type,
        "location": c.location,
        "description": c.description,
        "status": c.status,
        "created_by": c.created_by,
        "created_at": c.created_at,
    }


@router.get("")
def list_cases(
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    role = payload["role"]
    actor = payload["sub"]

    q = select(Case).order_by(Case.created_at.desc())
    if role == "operador":
        q = q.where(Case.created_by == actor)

    return session.exec(q).all()

@router.get("/management/dashboard")
def management_dashboard(
    page: int = 1,
    page_size: int = 10,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    role = payload["role"]
    actor = payload["sub"]

    page = max(page, 1)
    page_size = min(max(page_size, 1), 50)  # límite para no abusar

    q = select(Case).order_by(Case.created_at.desc())
    if role == "operador":
        q = q.where(Case.created_by == actor)

    cases = session.exec(q).all()
    total = len(cases)
    total_pages = (total + page_size - 1) // page_size

    start = (page - 1) * page_size
    end = start + page_size
    page_items = cases[start:end]

    # cards
    abiertos = sum(1 for c in cases if (c.status or "").upper() != "CLOSED")
    investigacion = sum(1 for c in cases if (c.status or "").upper() == "SUBMITTED")
    elevados = sum(1 for c in cases if (c.status or "").upper() == "CLOSED")
    pendientes = sum(1 for c in cases if (c.status or "").upper() == "DRAFT")

    recent = []
    for c in page_items:
        citizen = session.get(Citizen, c.citizen_dni) if c.citizen_dni else None
        victim_name = (
            f"{citizen.apellidos}, {citizen.nombres}" if citizen else (c.citizen_dni or "SIN DNI")
        )

        recent.append(
            {
                "id": c.id,                 # <-- ID REAL NUMÉRICO
                "code": f"2026-{str(c.id).zfill(5)}",  # <-- código bonito UI
                "date": (c.created_at or "")[:10],
                "type": c.incident_type,
                "victim": victim_name,
                "status": _ui_status(c.status),
                "priority": _ui_priority(c.incident_type),
            }
        )

    return {
        "stats": {
            "abiertos": abiertos,
            "investigacion": investigacion,
            "elevados": elevados,
            "pendientes_firma": pendientes,
        },
        "recent_cases": recent,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
    }

@router.get("/{case_id}")
def get_case(
    case_id: int,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    if payload["role"] == "operador" and c.created_by != payload["sub"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    _audit(session, payload["sub"], "VIEW_CASE", {"role": payload["role"], "case_id": case_id, "ip": _client_ip(request)})
    return c


@router.patch("/{case_id}/status")
def update_status(
    case_id: int,
    status: str,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador")),
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    c.status = status
    session.add(c)
    session.commit()

    _audit(
        session,
        payload["sub"],
        "UPDATE_STATUS",
        {"role": payload["role"], "case_id": case_id, "status": status, "ip": _client_ip(request)},
    )
    return {"ok": True, "case_id": case_id, "status": status}


@router.post("/{case_id}/submit")
def submit_case(
    case_id: int,
    body: SubmitCaseSchema,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador")),
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    if payload["role"] == "operador" and c.created_by != payload["sub"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    if c.status != "DRAFT":
        raise HTTPException(status_code=400, detail=f"El caso no está en DRAFT (estado actual: {c.status})")

    if not body.declaration_accepted:
        raise HTTPException(status_code=400, detail="Debe aceptar la declaración jurada para confirmar el registro")

    c.status = "SUBMITTED"
    c.submitted_at = _now_iso()
    c.declaration_accepted = True
    c.case_integrity_hash = _case_integrity_hash(session, case_id)

    session.add(c)
    session.commit()
    session.refresh(c)

    _audit(
        session,
        payload["sub"],
        "SUBMIT_CASE",
        {
            "role": payload["role"],
            "case_id": case_id,
            "integrity_hash": c.case_integrity_hash,
            "ip": _client_ip(request),
        },
    )

    return {
        "ok": True,
        "case_id": c.id,
        "status": c.status,
        "submitted_at": c.submitted_at,
        "case_integrity_hash": c.case_integrity_hash,
    }


# =========================
# Evidence upload
# =========================
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "video/mp4",
}
MAX_FILE_BYTES = 10 * 1024 * 1024  # 10MB

def _sniff_magic(content: bytes) -> str | None:
    # PDF: %PDF-
    if content.startswith(b"%PDF-"):
        return "application/pdf"

    # JPG: FF D8 FF
    if content[:3] == b"\xFF\xD8\xFF":
        return "image/jpeg"

    # PNG: 89 50 4E 47 0D 0A 1A 0A
    if content.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"

    # MP4: contiene 'ftyp' en los primeros bytes
    if b"ftyp" in content[:32]:
        return "video/mp4"

    return None


def _is_allowed_by_magic(content: bytes, declared: str) -> bool:
    magic = _sniff_magic(content)
    if not magic:
        return False
    # Acepta si coincide con lo detectado
    return magic == declared

@router.post("/{case_id}/evidences")
async def upload_evidence(
    case_id: int,
    request: Request,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador")),
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    if payload["role"] == "operador" and c.created_by != payload["sub"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    content = await file.read()

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Archivo vacío.")

    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(status_code=413, detail="Archivo demasiado grande. Máx 10MB.")

    content_type = (file.content_type or "").lower().strip()
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail=f"Tipo de archivo no permitido: {content_type}")

    # ✅ Validación anti-renombre (exe->pdf): firma real del archivo
    if not _is_allowed_by_magic(content, content_type):
        raise HTTPException(
            status_code=415,
            detail="Formato inválido: el contenido del archivo no coincide con el tipo permitido (PDF/JPG/PNG/MP4)."
        )

    sha256 = hashlib.sha256(content).hexdigest()

    base_dir = Path("storage") / "evidences" / str(case_id)
    base_dir.mkdir(parents=True, exist_ok=True)

    safe_name = (file.filename or "archivo").replace("/", "_").replace("\\", "_")
    file_path = base_dir / safe_name
    file_path.write_bytes(content)

    ev = Evidence(
        case_id=case_id,
        filename=safe_name,
        filepath=str(file_path),
        sha256=sha256,
        size_bytes=len(content),
        content_type=content_type,
        uploaded_by=payload["sub"],
        created_at=_now_iso(),
    )
    session.add(ev)
    session.commit()
    session.refresh(ev)

    _audit(
        session,
        payload["sub"],
        "UPLOAD_EVIDENCE",
        {
            "role": payload["role"],
            "case_id": case_id,
            "evidence_id": ev.id,
            "sha256": sha256,
            "size_bytes": len(content),
            "content_type": content_type,
            "ip": _client_ip(request),
        },
    )
    return ev

@router.get("/{case_id}/evidences/{evidence_id}/download")
def download_evidence(
    case_id: int,
    evidence_id: int,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    if payload["role"] == "operador" and c.created_by != payload["sub"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    ev = session.get(Evidence, evidence_id)
    if not ev or ev.case_id != case_id:
        raise HTTPException(status_code=404, detail="Evidencia no encontrada")

    if not ev.filepath or not os.path.exists(ev.filepath):
        raise HTTPException(status_code=404, detail="Archivo no existe en storage")

    _audit(session, payload["sub"], "DOWNLOAD_EVIDENCE", {"case_id": case_id, "evidence_id": evidence_id, "ip": _client_ip(request)})

    # Fuerza descarga (attachment). Si quieres vista en navegador, cambia a inline.
    return FileResponse(
        path=ev.filepath,
        media_type=ev.content_type or "application/octet-stream",
        filename=ev.filename,
    )

# =========================
# Cargo / Acta PDF
# =========================
@router.get("/{case_id}/cargo")
def print_cargo(
    case_id: int,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador")),
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    if payload["role"] == "operador" and c.created_by != payload["sub"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    if c.status != "SUBMITTED":
        raise HTTPException(status_code=400, detail="El caso aún no está formalizado (SUBMITTED).")

    integrity_hash = _case_integrity_hash(session, case_id)
    expediente_num = f"2026-{str(case_id).zfill(5)}"
    fecha_local = datetime.now().strftime("%d/%m/%Y %H:%M")
    fecha_reg = str(getattr(c, "submitted_at", "") or "-")

    # Datos simulados / reales
    dependencia = "COMISARÍA PNP CHORRILLOS - LIMA"

    cit = session.get(Citizen, c.citizen_dni)
    denunciante_nombre = f"{cit.nombres} {cit.apellidos}" if cit else "__________________________"
    instructor_nombre = f"S1 PNP GARCÍA (CIP {c.created_by})"

    dni_txt = str(getattr(c, "citizen_dni", "") or "-")
    incidente = str(getattr(c, "incident_type", "") or "-")
    lugar = str(getattr(c, "location", "") or "-")
    operador = str(getattr(c, "created_by", "") or "-")
    relato = str(getattr(c, "description", "") or "").strip()

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=(210 * mm, 297 * mm),  # A4 sin importar A4
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title=f"ACTA_{expediente_num}",
        author="SIDPOL 2.0",
    )

    styles = getSampleStyleSheet()
    TITLE = ParagraphStyle(
        "TITLE",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        alignment=TA_CENTER,
        spaceAfter=6,
    )
    SUB = ParagraphStyle(
        "SUB",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        alignment=TA_CENTER,
        spaceAfter=8,
    )
    P = ParagraphStyle(
        "P",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        alignment=TA_JUSTIFY,
    )
    SMALL = ParagraphStyle(
        "SMALL",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=11,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#334155"),
    )
    MONO = ParagraphStyle(
        "MONO",
        parent=styles["BodyText"],
        fontName="Courier",
        fontSize=7.8,
        leading=10,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#0f172a"),
    )

    elems = []

    # Logo (coloca el archivo en backend/app/assets/pnp_logo.png)
    logo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "pnp_logo.png"))
    if os.path.exists(logo_path):
        img = Image(logo_path)
        img.drawHeight = 26 * mm
        img.drawWidth = 26 * mm
        img.hAlign = "CENTER"
        elems.append(img)
        elems.append(Spacer(1, 3 * mm))
    else:
        elems.append(Spacer(1, 29 * mm))

    elems.append(Paragraph("POLICÍA NACIONAL DEL PERÚ – XII-DTP-PNP-P.", TITLE))
    elems.append(Paragraph("ACTA DE RECEPCIÓN DE DENUNCIA", SUB))

    # Formulario (labels bold, valores normal)
    form = Table(
        [
            ["DEPENDENCIA POLICIAL:", dependencia],
            ["NÚMERO DE DENUNCIA VERBAL:", expediente_num],
        ],
        colWidths=[55 * mm, 110 * mm],
    )
    form.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    elems.append(form)
    elems.append(Spacer(1, 4 * mm))

    cuerpo = f"""
    En la fecha <b>{fecha_local}</b>, se deja constancia que se ha recepcionado la presente denuncia,
    registrada en el sistema institucional <b>SIDPOL 2.0</b>, asignándose el número de expediente
    <b>{expediente_num}</b> para su seguimiento.
    <br/>
    Fecha de registro (sistema): <b>{fecha_reg}</b>.

    <br/><br/>
    El(la) denunciante <b>{denunciante_nombre}</b> identificado(a) con DNI <b>{dni_txt}</b> declara un hecho
    asociado al tipo de incidente <b>{incidente}</b>, ocurrido en <b>{lugar}</b>. La denuncia fue formalizada
    por el operador responsable (CIP) <b>{operador}</b>, quedando la actuación registrada en auditoría
    institucional para fines de trazabilidad.

    <br/><br/>
    <b>Relato de los hechos:</b><br/>
    {relato if relato else "______________________________________________________________"}
    """
    elems.append(Paragraph(cuerpo, P))
    elems.append(Spacer(1, 6 * mm))

    # Integridad (bloque verde)
    hash_block = Table(
        [
            [Paragraph("<b>INTEGRIDAD DEL EXPEDIENTE (SHA-256)</b>", SMALL)],
            [Paragraph(integrity_hash, MONO)],
            [Paragraph("Válido si el hash coincide con el expediente registrado.", SMALL)],
        ],
        colWidths=[165 * mm],
    )
    hash_block.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#86efac")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    elems.append(hash_block)
    elems.append(Spacer(1, 4 * mm))

    # QR
    verify_payload = f"SIDPOL2://verify?exp={expediente_num}&hash={integrity_hash}"
    qr = QrCodeWidget(verify_payload)
    b = qr.getBounds()
    size = 22 * mm
    w = b[2] - b[0]
    h = b[3] - b[1]
    d = Drawing(size, size, transform=[size / w, 0, 0, size / h, 0, 0])
    d.add(qr)

    integ = Table([[Paragraph("Código QR de verificación", SMALL), d]], colWidths=[120 * mm, 30 * mm])
    integ.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    elems.append(integ)
    elems.append(Spacer(1, 10 * mm))

    # Firmas (simuladas con nombres)
    firmas = Table(
        [
            ["______________________________", "______________________________"],
            [instructor_nombre, denunciante_nombre],
            ["EL INSTRUCTOR", "DENUNCIANTE"],
        ],
        colWidths=[80 * mm, 80 * mm],
    )
    firmas.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, 0), "CENTER"),
                ("ALIGN", (0, 1), (-1, 1), "CENTER"),
                ("ALIGN", (0, 2), (-1, 2), "CENTER"),
                ("FONTNAME", (0, 2), (-1, 2), "Helvetica-Bold"),
                ("FONTSIZE", (0, 1), (-1, 1), 8),
                ("FONTSIZE", (0, 2), (-1, 2), 9),
                ("TOPPADDING", (0, 0), (-1, 0), 16),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
                ("TOPPADDING", (0, 1), (-1, 1), 6),
                ("BOTTOMPADDING", (0, 2), (-1, 2), 0),
            ]
        )
    )
    elems.append(firmas)

    doc.build(elems)
    buffer.seek(0)

    _audit(
        session,
        payload["sub"],
        "PRINT_CARGO",
        {
            "role": payload["role"],
            "case_id": case_id,
            "integrity_hash": integrity_hash,
            "ip": _client_ip(request),
        },
    )

    headers = {"Content-Disposition": f'attachment; filename="ACTA_{expediente_num}.pdf"'}
    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)

@router.get("/{case_id}/detail")
def case_detail(
    case_id: int,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    if payload["role"] == "operador" and c.created_by != payload["sub"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    citizen = session.get(Citizen, c.citizen_dni) if c.citizen_dni else None
    user = session.exec(select(User).where(User.cip == c.created_by)).first()

    acts = session.exec(
        select(Actuation).where(Actuation.case_id == case_id).order_by(Actuation.id.asc())
    ).all()

    evid = session.exec(
        select(Evidence).where(Evidence.case_id == case_id).order_by(Evidence.id.asc())
    ).all()

    ext = session.exec(
        select(ExternalQuery).where(ExternalQuery.case_id == case_id).order_by(ExternalQuery.id.desc())
    ).all()

    _audit(session, payload["sub"], "VIEW_CASE_DETAIL", {"case_id": case_id, "ip": _client_ip(request)})

    return {
        "id": c.id,
        "code": _expediente_code(c.id or 0),
        "incident_type": c.incident_type,
        "status": c.status,
        "victim": (f"{citizen.apellidos}, {citizen.nombres}" if citizen else c.citizen_dni),
        "instructor": (user.full_name if user else c.created_by),
        "created_at": c.created_at,

        "actuations": [
            {
                "id": a.id,
                "fecha": a.occurred_at,
                "titulo": a.title,
                "responsable": a.responsible,
                "tipo": a.type,
                "estado": a.status,
                "detalle": a.detail, 
            } for a in acts
        ],

        "evidences": [
            {
                "id": e.id,
                "filename": e.filename,
                "size_bytes": e.size_bytes,
                "sha256": e.sha256,
                "created_at": e.created_at,
            } for e in evid
        ],

        "external_queries": [
            {
                "id": q.id,
                "system": q.system,
                "status": q.status,
                "summary": q.result_summary,
                "created_at": q.created_at,
            } for q in ext
        ],
    }

@router.post("/{case_id}/actuations")
def add_actuation(
    case_id: int,
    body: ActuationCreateSchema,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    if payload["role"] == "operador" and c.created_by != payload["sub"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    title = (body.title or "").strip()
    if len(title) < 4:
        raise HTTPException(status_code=400, detail="Título muy corto")

    a_type = (body.type or "ACTA").upper().strip()
    a_status = (body.status or "PENDIENTE").upper().strip()

    allowed_types = {"ACTA", "OFICIO", "CONSULTA", "EVIDENCIA"}
    allowed_status = {"PENDIENTE", "COMPLETADO", "DIGITALIZADO"}
    if a_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Tipo inválido")
    if a_status not in allowed_status:
        raise HTTPException(status_code=400, detail="Estado inválido")

    occurred = body.occurred_at or datetime.utcnow().strftime("%Y-%m-%d %H:%M")

    # Responsable = usuario autenticado (CIP + nombre si existe)
    u = session.exec(select(User).where(User.cip == payload["sub"])).first()
    responsible = f"{payload['sub']} {u.full_name}" if u else payload["sub"]

    detail = (body.detail or "").strip()

    act = Actuation(
        case_id=case_id,
        occurred_at=occurred,
        title=title,
        responsible=responsible,
        type=a_type,
        status=a_status,
        detail=detail,        
        created_at=_now_iso(),
    )
    session.add(act)
    session.commit()
    session.refresh(act)

    _audit(session, payload["sub"], "ADD_ACTUATION", {"case_id": case_id, "ip": _client_ip(request)})

    return {
        "ok": True,
        "actuation": {
            "id": act.id,
            "fecha": act.occurred_at,
            "titulo": act.title,
            "responsable": act.responsible,
            "tipo": act.type,
            "estado": act.status,
            "detalle": act.detail,   # ✅ NUEVO
        },
    }

def _run_external_mock(system: str, dni: str) -> str:
    # mock simple para demo universitaria
    if system == "ESINPOL":
        return f"Sin antecedentes vigentes para DNI {dni} (mock)."
    if system == "RQ":
        return f"Sin requisitorias activas para DNI {dni} (mock)."
    return "OK"


@router.post("/{case_id}/external/{system}")
def external_query(
    case_id: int,
    system: str,
    request: Request,
    session: Session = Depends(get_session),
    payload=Depends(require_role("admin", "operador", "auditor")),
):
    system = system.upper().strip()
    if system not in {"ESINPOL", "RQ"}:
        raise HTTPException(status_code=400, detail="Sistema externo inválido")

    c = session.get(Case, case_id)
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")

    if payload["role"] == "operador" and c.created_by != payload["sub"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    # “consulta” sobre DNI del ciudadano del caso
    dni = c.citizen_dni
    summary = _run_external_mock(system, dni)

    q = ExternalQuery(
        case_id=case_id,
        system=system,
        query_for=dni,
        status="COMPLETADO",
        result_summary=summary,
        created_at=_now_iso(),
    )
    session.add(q)
    session.commit()
    session.refresh(q)

    # Registrar actuación en la línea de tiempo (como tu informe)
    session.add(
        Actuation(
            case_id=case_id,
            occurred_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            title=f"Consulta {system}",
            responsible="SISTEMA",
            type="CONSULTA",
            status="COMPLETADO",
            created_at=_now_iso(),
        )
    )
    session.commit()

    _audit(session, payload["sub"], "EXTERNAL_QUERY", {"case_id": case_id, "system": system, "ip": _client_ip(request)})

    return {"ok": True, "query_id": q.id, "summary": summary}