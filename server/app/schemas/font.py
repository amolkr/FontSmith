from datetime import datetime

from pydantic import BaseModel


class FontResponse(BaseModel):
    id: str
    name: str
    status: str
    preview_text: str
    download_count: int
    favorite: bool
    created_at: datetime
    ttf_url: str | None = None
    otf_url: str | None = None


class RenameFontRequest(BaseModel):
    name: str


class FavoriteFontRequest(BaseModel):
    favorite: bool

