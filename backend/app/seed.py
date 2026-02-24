from sqlmodel import Session, select
from passlib.context import CryptContext
from app.security import hash_password
from datetime import date
from app.models import User, Citizen
from app.twofa import generate_base32_secret
from app.models import InboxMessage
from datetime import datetime

def seed_users(session: Session):
    # Operadores (login por CIP)
    operadores = [
        {
            "cip": "31224567",
            "username": "31224567",     # ✅ login = CIP
            "full_name": "GARCIA, S1 PNP",
            "comisaria": "Breña",
            "role": "operador",
            "password": "admin123",
            "twofa_enabled": False,      # ✅ este pide OTP
        },
        {
            "cip": "40112233",
            "username": "40112233",
            "full_name": "RAMIREZ, S2 PNP",
            "comisaria": "Chorrillos - San Genaro",
            "role": "operador",
            "password": "admin123",
            "twofa_enabled": False,
        },
        {
            "cip": "90000001",
            "username": "90000001",
            "full_name": "ADMIN, PNP",
            "comisaria": "DIRTI",
            "role": "admin",
            "password": "admin123",
            "twofa_enabled": True,
        },
    ]

    for op in operadores:
        exists = session.exec(select(User).where(User.username == op["username"])).first()
        if exists:
            continue

        secret = generate_base32_secret() if op["twofa_enabled"] else None

        u = User(
            username=op["username"],
            cip=op["cip"],
            full_name=op["full_name"],
            comisaria=op["comisaria"],
            role=op["role"],
            password_hash=hash_password(op["password"]),
            twofa_enabled=op["twofa_enabled"],
            twofa_secret=secret,
        )
        session.add(u)

    session.commit()

def seed_citizens(session: Session):
    citizens = [
        {
            "dni": "71408016",
            "nombres": "JUAN CARLOS",
            "apellidos": "PEREZ GUTIERREZ",
            "nacimiento": "1998-03-21",
        },
        {
            "dni": "70214589",
            "nombres": "MARIA FERNANDA",
            "apellidos": "RAMOS QUISPE",
            "nacimiento": "2001-11-05",
        },
        {
            "dni": "61230987",
            "nombres": "LUIS ALBERTO",
            "apellidos": "GARCIA CHAVEZ",
            "nacimiento": "1995-07-14",
        },
    ]

    for c in citizens:
        exists = session.exec(select(Citizen).where(Citizen.dni == c["dni"])).first()
        if exists:
            continue

        citizen = Citizen(
            dni=c["dni"],
            nombres=c["nombres"],
            apellidos=c["apellidos"],
            nacimiento=date.fromisoformat(c["nacimiento"]),  # ✅ importante
        )
        session.add(citizen)

    session.commit()

def seed_inbox(session: Session):
    # Si ya existe al menos 1 mensaje global, no reinsertar
    exists = session.exec(select(InboxMessage).where(InboxMessage.recipient == "ALL")).first()
    if exists:
        return

    now = datetime.utcnow().isoformat()

    session.add(InboxMessage(
        recipient="ALL",
        type="SISTEMA",
        priority="critical",
        sender="Infraestructura DIRTIC",
        title="Mantenimiento Preventivo de Servidores Centrales",
        preview="Hoy se realizará un reinicio preventivo de la base ESINPOL entre las 23:00 y 23:30.",
        created_at=now,
    ))

    session.add(InboxMessage(
        recipient="ALL",
        type="MEMO",
        priority="medium",
        sender="Oficina de Tecnología",
        title="Buenas prácticas de seguridad operativa",
        preview="Recuerde no compartir credenciales, activar 2FA y reportar actividad sospechosa.",
        created_at=now,
    ))

    session.commit()