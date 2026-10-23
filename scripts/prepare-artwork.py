from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "artwork" / "source"
OUTPUT_DIR = ROOT / "public" / "images"
SCENES = (
    "welcome-courtyard",
    "engagement",
    "sagan",
    "jaggo-courtyard",
    "haldi-mehendi",
    "anand-karaj",
    "wedding-celebration",
)


def save_scene_variants(name: str) -> None:
    source_path = SOURCE_DIR / f"{name}-1536.png"
    with Image.open(source_path) as source:
        image = source.convert("RGB")

    for width in (768, 1536):
        variant = image.copy()
        variant.thumbnail((width, int(width * 2 / 3)), Image.Resampling.LANCZOS)
        base_path = OUTPUT_DIR / f"{name}-{width}"
        variant.save(base_path.with_suffix(".webp"), "WEBP", quality=84, method=6)
        variant.save(base_path.with_suffix(".avif"), "AVIF", quality=52, speed=6)


def save_door_variants() -> None:
    with Image.open(SOURCE_DIR / "courtyard-doors.png") as source:
        image = source.convert("RGB")

    image.save(OUTPUT_DIR / "courtyard-doors.webp", "WEBP", quality=88, method=6)
    image.save(OUTPUT_DIR / "courtyard-doors.avif", "AVIF", quality=55, speed=6)


def save_review_sheet() -> None:
    sheet = Image.new("RGB", (900, 660), "#f5e7d0")
    draw = ImageDraw.Draw(sheet)
    for index, name in enumerate(SCENES[1:]):
        with Image.open(OUTPUT_DIR / f"{name}-768.webp") as source:
            preview = ImageOps.fit(source, (300, 195))
        x, y = (index % 3) * 300, (index // 3) * 330
        sheet.paste(preview, (x, y))
        draw.text((x + 10, y + 205), name, fill="#582836")
    sheet.save(ROOT / "docs" / "artwork-review.jpg", quality=82, optimize=True)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for scene in SCENES:
        save_scene_variants(scene)
    save_door_variants()
    save_review_sheet()
    print("Generated responsive AVIF and WebP artwork from local source masters.")


if __name__ == "__main__":
    main()
