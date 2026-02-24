from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # login por CIP
    cip: str = Field(index=True, unique=True)
    username: str = Field(index=True, unique=True)

    # ✅ lo que usa auth.py y seed.py
    password_hash: str

    role: str = Field(index=True, default="operador")

    full_name: str
    comisaria: str = Field(default="Chorrillos - San Genaro")

    # 2FA
    twofa_enabled: bool = Field(default=False)
    twofa_secret: Optional[str] = None
    last_2fa_at: Optional[str] = None


class Case(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Paso 2 (Detalle Suceso)
    incident_type: str = Field(default="ROBO AGRAVADO")
    location: str = Field(default="")
    description: str = Field(default="")  # relato

    # Para amarrar el caso al ciudadano verificado
    citizen_dni: str = Field(index=True)

    # control de flujo
    status: str = Field(index=True, default="DRAFT")  # DRAFT / SUBMITTED / CLOSED

    created_by: str  # CIP (sub del token)
    created_at: str

    # ✅ Paso 4 (Confirmación)
    submitted_at: Optional[str] = None
    declaration_accepted: bool = Field(default=False)

    # ✅ Integridad del expediente (cadena de custodia simple)
    case_integrity_hash: Optional[str] = None


class Evidence(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(index=True)

    filename: str
    filepath: str

    content_type: str = "application/octet-stream"
    size_bytes: int = 0
    sha256: str = Field(index=True)

    uploaded_by: str = Field(index=True)
    created_at: str


class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    actor: str = Field(index=True)     # CIP o "public"
    action: str = Field(index=True)    # RENIEC_VALIDATE_OK / FAIL / RATE_LIMIT, etc.
    detail: str
    created_at: str


# ✅ Tabla RENIEC Mock pero en BD
class Citizen(SQLModel, table=True):
    dni: str = Field(primary_key=True, index=True)
    nombres: str
    apellidos: str
    nacimiento: str  # "YYYY-MM-DD" (simple)

class Actuation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(index=True)

    occurred_at: str  # "YYYY-MM-DD HH:MM"
    title: str
    responsible: str
    type: str         # ACTA / CONSULTA / OFICIO / EVIDENCIA
    status: str       # DIGITALIZADO / COMPLETADO / PENDIENTE

    detail: str = "" 
    created_at: str

class ExternalQuery(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(index=True)

    system: str       # "ESINPOL" / "RQ"
    query_for: str    # DNI consultado (o lo que uses)
    status: str       # COMPLETADO / ERROR
    result_summary: str
    created_at: str