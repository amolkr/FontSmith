from datetime import datetime

from pydantic import BaseModel, Field


class FontDocument(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    name: str
    status: str
    preview_text: str = "The quick brown fox jumps over the lazy dog"
    ttf_path: str | None = None
    otf_path: str | None = None
    source_upload_id: str | None = None
    download_count: int = 0
    favorite: bool = False
    created_at: datetime
    updated_at: datetime | None = None

