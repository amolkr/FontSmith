from fastapi import APIRouter

from app.database import find_many
from app.utils.public_workspace import PUBLIC_USER_ID

router = APIRouter(prefix="/history", tags=["History"])


@router.get("")
async def get_history() -> list[dict]:
    events = await find_many("history", {"user_id": PUBLIC_USER_ID}, limit=50)
    return [
        {
            "id": event["_id"],
            "fontId": event.get("font_id"),
            "action": event.get("action"),
            "createdAt": event.get("created_at"),
        }
        for event in events
    ]
