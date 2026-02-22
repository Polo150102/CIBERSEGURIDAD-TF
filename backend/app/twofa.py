# backend/app/twofa.py
import base64
import io
import pyotp
import qrcode


# === Funciones que YA tenías (las dejo) ===
def generate_2fa_secret() -> str:
    return pyotp.random_base32()


def verify_otp(secret: str, otp: str) -> bool:
    if not secret or not otp:
        return False
    totp = pyotp.TOTP(secret)
    # valid_window=1 permite 30s antes/después (evita falsos negativos por reloj)
    return totp.verify(otp, valid_window=1)


def generate_qr_code(secret: str, label: str) -> str:
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(name=label, issuer_name="SIDPOL 2.0")

    img = qrcode.make(uri)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


# === ALIAS para que NO reviente tu import actual en auth.py ===
def generate_base32_secret() -> str:
    # mismo comportamiento, nombre distinto
    return generate_2fa_secret()


def qr_code_base64(secret: str, label: str) -> str:
    # mismo comportamiento, nombre distinto
    return generate_qr_code(secret, label)