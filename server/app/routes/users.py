from fastapi import APIRouter

from app.database import find_many
from app.utils.public_workspace import PUBLIC_USER, PUBLIC_USER_ID

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def get_profile() -> dict:
    return {
        "id": PUBLIC_USER["_id"],
        "name": PUBLIC_USER["name"],
        "email": PUBLIC_USER["email"],
        "plan": PUBLIC_USER["plan"],
    }


@router.get("/me/stats")
async def get_stats() -> dict:
    fonts = await find_many("fonts", {"user_id": PUBLIC_USER_ID})
    downloads = sum(font.get("download_count", 0) for font in fonts)
    favorites = sum(1 for font in fonts if font.get("favorite"))
    return {
        "fontsCreated": len(fonts),
        "downloads": downloads,
        "favorites": favorites,
        "plan": PUBLIC_USER["plan"],
    }
