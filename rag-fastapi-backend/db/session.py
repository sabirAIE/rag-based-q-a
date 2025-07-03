from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://rag_user:rag_pass@db:5432/rag_db")
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)
