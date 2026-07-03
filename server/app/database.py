from collections import defaultdict
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ServerSelectionTimeoutError

from app.config import get_settings

settings = get_settings()
client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None
memory_store: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
mongo_available = False


async def connect_to_mongo() -> None:
    global client, db, mongo_available
    client = AsyncIOMotorClient(settings.mongodb_url, serverSelectionTimeoutMS=1600)
    try:
        await client.admin.command("ping")
        db = client[settings.mongodb_db]
        mongo_available = True
        await create_indexes()
    except ServerSelectionTimeoutError:
        mongo_available = False


async def close_mongo_connection() -> None:
    if client:
        client.close()


async def create_indexes() -> None:
    if db is None:
        return
    await db.users.create_index("email", unique=True)
    await db.fonts.create_index([("user_id", 1), ("created_at", -1)])
    await db.uploads.create_index([("user_id", 1), ("created_at", -1)])
    await db.history.create_index([("user_id", 1), ("created_at", -1)])


def document_id() -> str:
    return str(uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


async def insert_one(collection: str, document: dict[str, Any]) -> dict[str, Any]:
    document.setdefault("_id", document_id())
    document.setdefault("created_at", utc_now())
    if mongo_available and db is not None:
        await db[collection].insert_one(document)
    else:
        memory_store[collection][document["_id"]] = document
    return document


async def find_one(collection: str, query: dict[str, Any]) -> dict[str, Any] | None:
    if mongo_available and db is not None:
        return await db[collection].find_one(query)

    for document in memory_store[collection].values():
        if all(document.get(key) == value for key, value in query.items()):
            return document
    return None


async def find_many(
    collection: str,
    query: dict[str, Any] | None = None,
    limit: int = 100,
) -> list[dict[str, Any]]:
    query = query or {}
    if mongo_available and db is not None:
        cursor = db[collection].find(query).sort("created_at", -1).limit(limit)
        return await cursor.to_list(length=limit)

    documents = [
        document
        for document in memory_store[collection].values()
        if all(document.get(key) == value for key, value in query.items())
    ]
    return sorted(documents, key=lambda item: item.get("created_at", utc_now()), reverse=True)[:limit]


async def update_one(collection: str, query: dict[str, Any], update: dict[str, Any]) -> dict[str, Any] | None:
    document = await find_one(collection, query)
    if not document:
        return None
    document.update(update)
    document["updated_at"] = utc_now()
    if mongo_available and db is not None:
        await db[collection].update_one(query, {"$set": update | {"updated_at": document["updated_at"]}})
    else:
        memory_store[collection][document["_id"]] = document
    return document


async def delete_one(collection: str, query: dict[str, Any]) -> bool:
    document = await find_one(collection, query)
    if not document:
        return False
    if mongo_available and db is not None:
        result = await db[collection].delete_one(query)
        return result.deleted_count == 1
    memory_store[collection].pop(document["_id"], None)
    return True

