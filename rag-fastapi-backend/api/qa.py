from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
import numpy as np
from db.session import SessionLocal
from db.models import Embedding
from services.embedding import embedding_model
from services.geminiLLM import query_gemini_flash

router = APIRouter()


class QARequest(BaseModel):
    question: str
    documentIds: list[str]


@router.post("/query")
def query_qa(req: QARequest):
    question_vec = embedding_model.encode(req.question)
    session = SessionLocal()
    try:
        embeddings = session.query(Embedding).filter(
            Embedding.document_id.in_([uuid.UUID(doc_id) for doc_id in req.documentIds])
        ).all()

        similarities = [
            (
                emb.content,
                np.dot(question_vec, emb.embedding) /
                (np.linalg.norm(question_vec) * np.linalg.norm(emb.embedding) + 1e-8)
            )
            for emb in embeddings
        ]
        top_k = sorted(similarities, key=lambda x: x[1], reverse=True)[:5]
        context = "\n".join([chunk for chunk, _ in top_k])
        answer = query_gemini_flash(req.question, context[:300])
        

        return {
            "question": req.question,
            "answer": answer,
            "matched_chunks": [chunk for chunk, _ in top_k]
        }

    finally:
        session.close()
