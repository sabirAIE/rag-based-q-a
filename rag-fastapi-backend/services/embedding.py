from sentence_transformers import SentenceTransformer
import fitz
from db.models import Embedding
from db.session import SessionLocal
import uuid

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def extract_text_chunks(file_path, chunk_size=500, overlap=50):
    doc = fitz.open(file_path)
    words = " ".join([page.get_text() for page in doc]).split()
    return [
        " ".join(words[i:i+chunk_size])
        for i in range(0, len(words), chunk_size - overlap)
    ]


def process_document(doc_id: str, file_path: str) -> int:
    chunks = extract_text_chunks(file_path)
    vectors = embedding_model.encode(chunks, convert_to_tensor=False)

    session = SessionLocal()
    for i, (chunk, vec) in enumerate(zip(chunks, vectors)):
        record = Embedding(
            document_id=uuid.UUID(doc_id),
            chunk_index=i,
            content=chunk,
            embedding=vec
        )
        session.add(record)
    session.commit()
    session.close()
    return len(chunks)
