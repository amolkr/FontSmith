from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.database import close_mongo_connection, connect_to_mongo
from app.routes import fonts, history, uploads, users

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(uploads.router, prefix="/api")
app.include_router(fonts.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.mount("/generated", StaticFiles(directory=settings.resolved_font_dir), name="generated")


@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok", "service": "FontSmith"}
