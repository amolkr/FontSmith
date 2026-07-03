from pathlib import Path
from uuid import uuid4

import cv2
import numpy as np
from PIL import Image

from app.config import get_settings

settings = get_settings()


def _remove_shadows(gray: np.ndarray) -> np.ndarray:
    dilated = cv2.dilate(gray, np.ones((7, 7), np.uint8))
    background = cv2.medianBlur(dilated, 21)
    diff = 255 - cv2.absdiff(gray, background)
    return cv2.normalize(diff, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)


def _sort_contours(contours: list[np.ndarray]) -> list[np.ndarray]:
    boxes = [cv2.boundingRect(contour) for contour in contours]
    if not boxes:
        return []
    median_height = np.median([height for _, _, _, height in boxes])
    rows: dict[int, list[tuple[int, np.ndarray]]] = {}
    for contour, (x, y, _, height) in zip(contours, boxes):
        row_key = int(y // max(median_height * 1.4, 1))
        rows.setdefault(row_key, []).append((x, contour))
    sorted_rows = [rows[key] for key in sorted(rows)]
    return [contour for row in sorted_rows for _, contour in sorted(row, key=lambda item: item[0])]


def process_handwriting_image(image_path: Path, upload_id: str) -> dict:
    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError("Could not read uploaded handwriting image.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    shadow_free = _remove_shadows(gray)
    denoised = cv2.fastNlMeansDenoising(shadow_free, h=12)
    thresholded = cv2.adaptiveThreshold(
        denoised,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        31,
        12,
    )

    contours, _ = cv2.findContours(thresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    min_area = max(24, int(image.shape[0] * image.shape[1] * 0.00003))
    filtered = [contour for contour in contours if cv2.contourArea(contour) > min_area]
    glyph_contours = _sort_contours(filtered)

    character_dir = settings.resolved_upload_dir / upload_id / "characters"
    character_dir.mkdir(parents=True, exist_ok=True)
    saved_characters: list[str] = []

    for index, contour in enumerate(glyph_contours[:96]):
        x, y, width, height = cv2.boundingRect(contour)
        pad = 8
        crop = thresholded[max(0, y - pad) : y + height + pad, max(0, x - pad) : x + width + pad]
        normalized = cv2.resize(crop, (256, 256), interpolation=cv2.INTER_AREA)
        character_path = character_dir / f"{index:02d}-{uuid4().hex[:8]}.png"
        Image.fromarray(255 - normalized).save(character_path)
        saved_characters.append(str(character_path))

    return {
        "stages": [
            "Uploading",
            "Cleaning image",
            "Removing background",
            "Detecting characters",
            "Extracting letters",
            "Generating vector glyphs",
            "Creating font",
            "Ready",
        ],
        "character_count": len(saved_characters),
        "characters": saved_characters,
        "preview_image": str(image_path),
    }

