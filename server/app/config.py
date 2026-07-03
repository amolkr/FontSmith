from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FontSmith API"
    environment: str = "development"
    frontend_url: str = "http://localhost:5173"
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db: str = "fontsmith"
    upload_dir: Path = Path("../uploads")
    generated_font_dir: Path = Path("../generated_fonts")
    max_upload_mb: int = 12

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def resolved_upload_dir(self) -> Path:
        return (Path(__file__).resolve().parents[1] / self.upload_dir).resolve()

    @property
    def resolved_font_dir(self) -> Path:
        return (Path(__file__).resolve().parents[1] / self.generated_font_dir).resolve()


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.resolved_upload_dir.mkdir(parents=True, exist_ok=True)
    settings.resolved_font_dir.mkdir(parents=True, exist_ok=True)
    return settings
