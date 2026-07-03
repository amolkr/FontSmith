from pathlib import Path
from uuid import uuid4

import svgwrite
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

from app.config import get_settings

settings = get_settings()
DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"


def _draw_handwritten_glyph(char: str, seed: int):
    pen = TTGlyphPen(None)
    width = 640
    left = 68 + seed % 34
    top = 690 - seed % 72
    bottom = -12 + seed % 22
    right = width - 74 - seed % 26

    if char == " ":
        return pen.glyph(), 320

    if char in "ilI1":
        x = width // 2 + seed % 20 - 10
        pen.moveTo((x, bottom))
        pen.lineTo((x + 18, top))
        pen.lineTo((x + 54, top - 18))
        pen.lineTo((x + 34, bottom))
        pen.closePath()
    elif char in "oO0":
        pen.moveTo((width // 2, top))
        pen.qCurveTo((right + 24, top - 18), (width // 2, bottom))
        pen.qCurveTo((left - 18, top - 42), (width // 2, top))
        pen.closePath()
        pen.moveTo((width // 2, top - 130))
        pen.qCurveTo((right - 120, bottom + 166), (width // 2, bottom + 130))
        pen.qCurveTo((left + 115, top - 124), (width // 2, top - 130))
        pen.closePath()
    elif char in "Aa":
        pen.moveTo((left, bottom))
        pen.lineTo((width // 2, top))
        pen.lineTo((right, bottom))
        pen.lineTo((right - 74, bottom))
        pen.lineTo((width // 2 + 42, 236))
        pen.lineTo((width // 2 - 58, 236))
        pen.lineTo((left + 74, bottom))
        pen.closePath()
        pen.moveTo((width // 2 - 20, 326))
        pen.lineTo((width // 2 + 22, 326))
        pen.lineTo((width // 2, 456))
        pen.closePath()
    else:
        pen.moveTo((left, bottom))
        pen.qCurveTo((left + 42, top - 30), (right, top - 90))
        pen.qCurveTo((right - 34, 330), (right - 24, bottom + 28))
        pen.qCurveTo((left + 22, 68), (left, bottom))
        pen.closePath()

    return pen.glyph(), width


def _write_svg_preview(font_id: str, output_dir: Path) -> str:
    svg_path = output_dir / f"{font_id}-glyph-preview.svg"
    drawing = svgwrite.Drawing(str(svg_path), size=("960px", "320px"), profile="tiny")
    drawing.add(drawing.rect(insert=(0, 0), size=("100%", "100%"), fill="#101418"))
    for index, char in enumerate("FontSmith ABC xyz 123"):
        x = 36 + index * 46
        y = 165 + ((index % 3) - 1) * 8
        drawing.add(drawing.text(char, insert=(x, y), fill="#f7f3ea", font_size=42, font_family="serif"))
    drawing.save()
    return str(svg_path)


def generate_font_files(font_name: str, user_id: str, characters: list[str] | None = None) -> dict:
    font_id = uuid4().hex
    output_dir = settings.resolved_font_dir / user_id
    output_dir.mkdir(parents=True, exist_ok=True)

    family_name = "".join(part.capitalize() for part in font_name.split())[:30] or "FontSmith"
    glyph_order = [".notdef", "space"] + [f"uni{ord(char):04X}" for char in DEFAULT_CHARSET]
    character_map = {32: "space"} | {ord(char): f"uni{ord(char):04X}" for char in DEFAULT_CHARSET}

    glyphs = {".notdef": TTGlyphPen(None).glyph()}
    metrics = {".notdef": (640, 0), "space": (320, 0)}
    space_glyph, _ = _draw_handwritten_glyph(" ", 0)
    glyphs["space"] = space_glyph

    source_count = len(characters or [])
    for index, char in enumerate(DEFAULT_CHARSET):
        glyph_name = f"uni{ord(char):04X}"
        glyph, width = _draw_handwritten_glyph(char, seed=index * 17 + source_count)
        glyphs[glyph_name] = glyph
        metrics[glyph_name] = (width, 0)

    font_builder = FontBuilder(1000, isTTF=True)
    font_builder.setupGlyphOrder(glyph_order)
    font_builder.setupCharacterMap(character_map)
    font_builder.setupGlyf(glyphs)
    font_builder.setupHorizontalMetrics(metrics)
    font_builder.setupHorizontalHeader(ascent=820, descent=-180)
    font_builder.setupOS2(sTypoAscender=820, sTypoDescender=-180, usWinAscent=900, usWinDescent=240)
    font_builder.setupNameTable(
        {
            "familyName": family_name,
            "styleName": "Regular",
            "uniqueFontIdentifier": f"FontSmith {family_name} {font_id}",
            "fullName": f"{family_name} Regular",
            "psName": f"{family_name}-Regular",
            "version": "Version 1.000",
        }
    )
    font_builder.setupPost()
    font_builder.setupMaxp()

    ttf_path = output_dir / f"{font_id}.ttf"
    otf_path = output_dir / f"{font_id}.otf"
    font_builder.save(str(ttf_path))
    ttf_path.replace(otf_path)
    font_builder.save(str(ttf_path))
    svg_path = _write_svg_preview(font_id, output_dir)

    return {
        "font_id": font_id,
        "ttf_path": str(ttf_path),
        "otf_path": str(otf_path),
        "svg_preview_path": svg_path,
        "glyph_count": len(DEFAULT_CHARSET),
    }
