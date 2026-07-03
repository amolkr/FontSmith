from pathlib import Path

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from app.database import delete_one, find_many, find_one, insert_one, update_one
from app.schemas.font import FavoriteFontRequest, FontResponse, RenameFontRequest
from app.services.font_generation import generate_font_files
from app.utils.files import safe_unlink
from app.utils.public_workspace import PUBLIC_USER_ID

router = APIRouter(prefix="/fonts", tags=["Fonts"])


def _font_response(font: dict) -> FontResponse:
    font_id = font["_id"]
    return FontResponse(
        id=font_id,
        name=font["name"],
        status=font["status"],
        preview_text=font.get("preview_text", "The quick brown fox jumps over the lazy dog"),
        download_count=font.get("download_count", 0),
        favorite=font.get("favorite", False),
        created_at=font["created_at"],
        ttf_url=f"/api/fonts/{font_id}/download/ttf" if font.get("ttf_path") else None,
        otf_url=f"/api/fonts/{font_id}/download/otf" if font.get("otf_path") else None,
    )


@router.get("", response_model=list[FontResponse])
async def list_fonts() -> list[FontResponse]:
    fonts = await find_many("fonts", {"user_id": PUBLIC_USER_ID})
    return [_font_response(font) for font in fonts]


@router.post("/generate", response_model=FontResponse)
async def generate_font(upload_id: str | None = None, name: str = "My FontSmith") -> FontResponse:
    characters: list[str] = []
    if upload_id:
        upload = await find_one("uploads", {"_id": upload_id, "user_id": PUBLIC_USER_ID})
        if upload:
            characters = upload.get("characters", [])

    font = await insert_one(
        "fonts",
        {
            "user_id": PUBLIC_USER_ID,
            "name": name,
            "status": "generating",
            "source_upload_id": upload_id,
            "download_count": 0,
            "favorite": False,
            "preview_text": "The quick brown fox jumps over the lazy dog",
        },
    )
    generated = generate_font_files(name, PUBLIC_USER_ID, characters)
    updated = await update_one(
        "fonts",
        {"_id": font["_id"]},
        {"status": "ready", "ttf_path": generated["ttf_path"], "otf_path": generated["otf_path"], "svg_preview_path": generated["svg_preview_path"]},
    )
    await insert_one("history", {"user_id": PUBLIC_USER_ID, "font_id": font["_id"], "action": "generated"})
    return _font_response(updated or font)


@router.patch("/{font_id}/rename", response_model=FontResponse)
async def rename_font(font_id: str, payload: RenameFontRequest) -> FontResponse:
    font = await update_one("fonts", {"_id": font_id, "user_id": PUBLIC_USER_ID}, {"name": payload.name})
    if not font:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Font not found")
    return _font_response(font)


@router.patch("/{font_id}/favorite", response_model=FontResponse)
async def favorite_font(font_id: str, payload: FavoriteFontRequest) -> FontResponse:
    font = await update_one("fonts", {"_id": font_id, "user_id": PUBLIC_USER_ID}, {"favorite": payload.favorite})
    if not font:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Font not found")
    return _font_response(font)


@router.get("/{font_id}/download/{format_name}")
async def download_font(font_id: str, format_name: str) -> FileResponse:
    if format_name not in {"ttf", "otf"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Format must be ttf or otf.")
    font = await find_one("fonts", {"_id": font_id, "user_id": PUBLIC_USER_ID})
    if not font:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Font not found")

    path = Path(font.get(f"{format_name}_path") or "")
    if not path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Generated font file is missing.")

    await update_one("fonts", {"_id": font_id}, {"download_count": font.get("download_count", 0) + 1})
    await insert_one("history", {"user_id": PUBLIC_USER_ID, "font_id": font_id, "action": f"downloaded_{format_name}"})
    media_type = "font/otf" if format_name == "otf" else "font/ttf"
    return FileResponse(path, media_type=media_type, filename=f"{font['name'].replace(' ', '-')}.{format_name}")


@router.delete("/{font_id}")
async def delete_font(font_id: str) -> dict:
    font = await find_one("fonts", {"_id": font_id, "user_id": PUBLIC_USER_ID})
    if not font:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Font not found")
    safe_unlink(font.get("ttf_path"))
    safe_unlink(font.get("otf_path"))
    deleted = await delete_one("fonts", {"_id": font_id, "user_id": PUBLIC_USER_ID})
    return {"deleted": deleted}
