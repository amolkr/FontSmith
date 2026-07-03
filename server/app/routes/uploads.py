from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.database import insert_one, update_one
from app.services.image_processing import process_handwriting_image
from app.utils.files import save_validated_upload
from app.utils.public_workspace import PUBLIC_USER_ID

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("")
async def upload_handwriting(file: UploadFile = File(...)) -> dict:
    saved_path = await save_validated_upload(file, PUBLIC_USER_ID)
    upload = await insert_one(
        "uploads",
        {
            "user_id": PUBLIC_USER_ID,
            "original_filename": file.filename,
            "content_type": file.content_type,
            "path": str(saved_path),
            "status": "uploaded",
        },
    )
    return {"uploadId": upload["_id"], "filename": file.filename, "status": upload["status"], "path": str(saved_path)}


@router.post("/{upload_id}/process")
async def process_upload(upload_id: str) -> dict:
    upload = await update_one("uploads", {"_id": upload_id, "user_id": PUBLIC_USER_ID}, {"status": "processing"})
    if not upload:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload not found")

    result = process_handwriting_image(Path(upload["path"]), upload_id=upload_id)
    await update_one("uploads", {"_id": upload_id}, {"status": "processed", "characters": result["characters"]})
    return {"uploadId": upload_id, "status": "processed", **result}
