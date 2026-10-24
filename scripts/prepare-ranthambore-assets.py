from pathlib import Path
import shutil

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Ranthambore-main" / "assets"
TARGET = ROOT / "public" / "assets"


def main() -> None:
    graphics = TARGET / "gfx"
    graphics.mkdir(parents=True, exist_ok=True)
    (TARGET / "video").mkdir(parents=True, exist_ok=True)

    for name in ("damask.svg", "marigold.svg", "lantern.svg", "cartouche.svg"):
        shutil.copy2(SOURCE / "gfx" / name, graphics / name)

    frame_names = (
        "frame-oval.png",
        "frame-oval-landscape.png",
        "frame-baroque-pink-landscape.png",
        "chai-elephant-left.png",
        "chai-elephant-right.png",
    )
    for name in frame_names:
        with Image.open(SOURCE / "gfx" / name) as image:
            image.save(graphics / f"{Path(name).stem}.webp", "WEBP", quality=92, method=6)

    with Image.open(SOURCE / "frames" / "f_0001.jpg") as poster:
        poster.save(graphics / "gate-poster.webp", "WEBP", quality=86, method=6)

    # Preserve the wedding-specific adaptations after the initial import.
    if not (TARGET / "event.css").exists():
        shutil.copy2(SOURCE / "event.css", TARGET / "event.css")
    shutil.copy2(SOURCE / "video" / "gates.mp4", TARGET / "video" / "gates.mp4")
    print("Prepared the reference ornaments, event styles, and scroll-reveal video.")


if __name__ == "__main__":
    main()
