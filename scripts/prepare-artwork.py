from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import shutil
root = Path(__file__).resolve().parents[1]
source = Path(r"C:\Users\manan\.codex\generated_images\01a15a5a-9e77-7253-87c5-71a9009fe38c")
files = {"engagement":"exec-b31f7098-36ba-4712-a52e-aff6da04dd49.png","sagan":"exec-8720b130-a872-4858-b119-ceff4b514ca6.png","haldi-mehendi":"exec-040a9333-9a3e-441d-a8cd-f29fed2f8872.png","anand-karaj":"exec-808e413b-f903-48cc-8bfc-b10b2b768ed8.png","wedding-celebration":"exec-543ef2c4-ea64-4db0-9053-211f312a45c4.png"}
for name, filename in files.items():
    shutil.copy2(source / filename, root / "public/images" / (name + "-1536.png"))
for name in [*files, "jaggo-courtyard", "welcome-courtyard"]:
    image = Image.open(root / "public/images" / (name + "-1536.png")).convert("RGB")
    for width in [768, 1536]:
        variant = image.copy()
        variant.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
        variant.save(root / "public/images" / (name + "-" + str(width) + ".webp"), "WEBP", quality=84, method=6)
# Inspection sheet only; website consumes the standalone paintings.
sheet = Image.new("RGB", (900, 660), "#f5e7d0")
draw = ImageDraw.Draw(sheet)
for i, name in enumerate(files):
    image = ImageOps.fit(Image.open(root / "public/images" / (name + "-1536.webp")), (300, 195))
    x, y = (i % 3) * 300, (i // 3) * 330
    sheet.paste(image, (x,y))
    draw.text((x+10,y+205), name, fill="#582836")
sheet.save(root / "docs/artwork-review.jpg")
print("Prepared five paintings and responsive WebP for all seven environments.")
