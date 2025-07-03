from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import ingest, qa
from dotenv import load_dotenv
import os

from db.models import Base
from db.session import engine

# Create tables
Base.metadata.create_all(bind=engine)

load_dotenv()

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "RAG FastAPI backend is running."}

# ✅ Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router, prefix="/ingest")
app.include_router(qa.router, prefix="/qa")
