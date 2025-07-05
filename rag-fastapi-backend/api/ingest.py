from fastapi import APIRouter, HTTPException
import os
from services.embedding import process_document
from utils.notify import notify_nestjs_ingestion_complete

router = APIRouter()


@router.post("/{doc_id}")
def ingest_document(doc_id: str):
    file_path = f"{os.getenv('UPLOAD_DIR')}/{doc_id}.pdf"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Document not found")

    chunks_created = process_document(doc_id, file_path)

    # Notify NestJS to update status
    notify_nestjs_ingestion_complete(doc_id)

    return {"status": "success", "chunks": chunks_created}
