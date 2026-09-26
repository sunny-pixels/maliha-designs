"""
One-off asset preparation for the Maliha site.

Reads ../maliha-assets (Instagram photos, lookbook PDF, logo) and writes
optimised files into ../public. Requires Pillow only.

    python scripts/prepare-assets.py
"""

import io
import re
import shutil
import zlib
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "maliha-assets"
PUBLIC = ROOT / "public"
LOOKBOOK = PUBLIC / "images" / "lookbook"
MALIHA = PUBLIC / "images" / "maliha"
QUALITY = 88


def extract_pdf_images(pdf: Path) -> list[Image.Image]:
    """Embedded images use `/Filter [/FlateDecode /DCTDecode]`: inflate, then JPEG."""
    data = pdf.read_bytes()
    images = []
    for m in re.finditer(rb"(\d+) 0 obj\s*<<", data):
        start = m.end()
        stream = data.find(b"stream", start)
        end = data.find(b"endobj", start)
        if stream < 0 or stream > end:
            continue
        header = data[start:stream]
        if b"/Subtype /Image" not in header:
            continue
        body = stream + 6 + (1 if data[stream + 6 : stream + 7] == b"\n" else 2)
        length = int(re.search(rb"/Length\s+(\d+)", header).group(1))
        raw = data[body : body + length]
        if b"FlateDecode" in header:
            raw = zlib.decompress(raw)
        img = Image.open(io.BytesIO(raw))
        img.load()
        images.append(img.convert("RGB"))
    return images


def cover(img: Image.Image, w: int, h: int, focus_y: float = 0.5) -> Image.Image:
    """Resize + crop to exactly w×h (like CSS object-fit: cover)."""
    scale = max(w / img.width, h / img.height)
    resized = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = (resized.width - w) // 2
    top = round((resized.height - h) * focus_y)
    return resized.crop((left, top, left + w, top + h))


def triptych(paths: list[Path], w: int, h: int, focus_y: float, trim_left: list[float] | None = None) -> Image.Image:
    """Photos side by side; `trim_left` drops a coloured border strip per photo first."""
    panel = w // len(paths)
    out = Image.new("RGB", (w, h))
    for i, p in enumerate(paths):
        img = Image.open(p).convert("RGB")
        dx = round(img.width * (trim_left[i] if trim_left else 0))
        img = img.crop((dx, 0, img.width - round(img.width * 0.04 if trim_left else 0), img.height))
        out.paste(cover(img, panel, h, focus_y), (i * panel, 0))
    return out


def main() -> None:
    # Remove the old Ströms imagery.
    for old in ["hero-man.jpg", "hero-woman.jpg", "store-facade.jpg"]:
        (PUBLIC / "images" / old).unlink(missing_ok=True)
    shutil.rmtree(PUBLIC / "images" / "menu", ignore_errors=True)
    for placeholder in ["logo.svg", "logo-footer.svg"]:
        (PUBLIC / placeholder).unlink(missing_ok=True)

    LOOKBOOK.mkdir(parents=True, exist_ok=True)
    MALIHA.mkdir(parents=True, exist_ok=True)

    # Lookbook PDF: image 1 is the logo, 2 a line drawing, 3–35 the looks.
    pdf_images = extract_pdf_images(SRC / "Maliha SS2021 - Lookbook.pdf")
    pdf_images[0].save(PUBLIC / "logo.png", optimize=True)
    for n, img in enumerate(pdf_images[2:], start=3):
        img.save(LOOKBOOK / f"look-{n:02d}.jpg", quality=QUALITY, optimize=True, progressive=True)

    # Instagram photos, in filename (= posting) order.
    ig = sorted(SRC.glob("SaveClip.App_*.jpg"))
    for n, path in enumerate(ig, start=1):
        Image.open(path).convert("RGB").save(
            MALIHA / f"ig-{n:02d}.jpg", quality=QUALITY, optimize=True, progressive=True
        )

    # Wide banners at the exact desktop ratios (24/10 and 10/4).
    triptych([MALIHA / "ig-09.jpg", MALIHA / "ig-10.jpg", MALIHA / "ig-11.jpg"], 2400, 1000, 0.3, trim_left=[0.05, 0.05, 0.14]).save(
        MALIHA / "banner-woman.jpg", quality=QUALITY, optimize=True, progressive=True
    )
    triptych([LOOKBOOK / "look-10.jpg", LOOKBOOK / "look-16.jpg", LOOKBOOK / "look-23.jpg"], 2400, 960, 0.22).save(
        MALIHA / "banner-atelier.jpg", quality=QUALITY, optimize=True, progressive=True
    )
    triptych([LOOKBOOK / "look-05.jpg", LOOKBOOK / "look-15.jpg", LOOKBOOK / "look-30.jpg"], 2400, 1000, 0.2).save(
        MALIHA / "banner-lookbook.jpg", quality=QUALITY, optimize=True, progressive=True
    )

    print(f"lookbook: {len(pdf_images) - 2} looks, instagram: {len(ig)} photos, logo: {pdf_images[0].size}")


if __name__ == "__main__":
    main()
