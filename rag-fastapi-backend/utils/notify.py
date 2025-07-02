import requests
import os


def notify_nestjs_ingestion_complete(doc_id: str):
    try:
        res = requests.patch(
            f"{os.getenv("NEST_API")}/documents/{doc_id}/status",
            json={"status": "done"}
        )
        res.raise_for_status()
    except Exception as e:
        print(f"[WARN] Failed to notify NestJS: {e}")
