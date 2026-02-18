from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    role: str = Field(default="operador")  # admin | operador | auditor
    is_active: bool = Field(default=True)

class Case(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    status: str = Field(default="ABIERTO")  # ABIERTO | EN_INVESTIGACION | CERRADO
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Evidence(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(index=True)
    filename: str
    sha256: str
    uploaded_by: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    actor: str
    role: str
    action: str
    resource: str
    ip: str = Field(default="-")
    at: datetime = Field(default_factory=datetime.utcnow)
    result: str = Field(default="OK")  # OK | FAIL