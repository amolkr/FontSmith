from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.config import get_settings

settings = get_settings()
ALLOWED_IMAGE_TYPES = {"image/png": ".png", "image/jpeg": ".jpg", "image/jpg": ".jpg"}


async def save_validated_upload(file: UploadFile, user_id: str) -> Path:
    extension = ALLOWED_IMAGE_TYPES.get(file.content_type or "")
    if not extension:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PNG, JPG, and JPEG handwriting samples are supported.",
        )

    contents = await file.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Upload must be smaller than {settings.max_upload_mb}MB.",
        )

    user_dir = settings.resolved_upload_dir / user_id
    user_dir.mkdir(parents=True, exist_ok=True)
    target = user_dir / f"{uuid4()}{extension}"
    target.write_bytes(contents)
    return target


def safe_unlink(path: str | None) -> None:
    if not path:
        return
    try:
        Path(path).unlink(missing_ok=True)
    except OSError:
        pass

