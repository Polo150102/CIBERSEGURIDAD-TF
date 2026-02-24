from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.db import create_db_and_tables, engine
from app.routers import auth, cases, audit, reniec, inbox
from app.seed import seed_users, seed_citizens, seed_inbox

app = FastAPI(title="SIDPOL 2.0", version="0.1")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        seed_users(session)
        seed_citizens(session)
        seed_inbox(session)

app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(audit.router)
app.include_router(reniec.router)
app.include_router(inbox.router)

@app.get("/health")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)