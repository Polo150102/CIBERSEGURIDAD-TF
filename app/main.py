from fastapi import FastAPI
from app.db import create_db_and_tables
from app.routers import auth, cases, audit

app = FastAPI(title="SIDPOL 2.0", version="0.1")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(audit.router)

@app.get("/health")
def health():
    return {"status": "ok"}