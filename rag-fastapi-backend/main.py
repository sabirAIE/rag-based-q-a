from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import ingest, qa
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

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
