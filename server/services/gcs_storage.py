import os
from google.cloud import storage

GCS_BUCKET = os.getenv("GCS_BUCKET")
PENDING_PREFIX = "pending_review/"

_client = None


def _get_client() -> storage.Client:
    global _client
    if _client is None:
        _client = storage.Client()
    return _client


def upload_to_pending(filename: str, data: bytes, content_type: str) -> str:
    if not GCS_BUCKET:
        raise RuntimeError("GCS_BUCKET env var is not set")

    bucket = _get_client().bucket(GCS_BUCKET)
    blob = bucket.blob(f"{PENDING_PREFIX}{filename}")

    blob.upload_from_string(
        data,
        content_type=content_type,
    )

    return f"gs://{GCS_BUCKET}/{blob.name}"
