"""
One-off asset preparation for the Maliha site.

Reads ../maliha-assets (Instagram photos, lookbook PDF, logo) and writes
optimised files into ../public. Requires Pillow only.

    python scripts/prepare-assets.py
"""

import base64
import io
import json
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
QUALITY = 82
# Largest width any slot needs: lookbook tiles are ≤ 1/3 of a 1440px layout at
# 2x DPR, product cards ≤ 1/4. Bigger originals only slow the image optimiser.
MAX_W = 1400
PLACEHOLDERS = ROOT / "src" / "data" / "placeholders.json"


def save(img: Image.Image, path: Path, max_w: int = MAX_W) -> None:
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    img.save(path, quality=QUALITY, optimize=True, progressive=True)


def blur_data_url(path: Path) -> str:
    """Tiny blurred JPEG as a data URL, shown while the real image loads."""
    img = Image.open(path).convert("RGB")
    img.thumbnail((10, 10))
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


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


def save_logo(fallback: Image.Image) -> None:
    """Header/footer logo: the transparent gold wordmark (public/logo_new.png),
    trimmed to its visible pixels. `maliha-assets/logo_new.png` has the
    checkerboard baked in, so it can't be used. Falls back to the lookbook's
    gold-box logo if the transparent file is missing."""
    src = PUBLIC / "logo_new.png"
    if not src.exists():
        fallback.save(PUBLIC / "logo-maliha.png", optimize=True)
        return
    img = Image.open(src).convert("RGBA")
    left, top, right, bottom = img.split()[3].point(lambda a: 255 if a > 8 else 0).getbbox()
    pad = 2
    img.crop((max(0, left - pad), max(0, top - pad), right + pad, bottom + pad)).save(PUBLIC / "logo-maliha.png", optimize=True)


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
    # New filename so image-optimiser and browser caches never serve the old logo.
    for placeholder in ["logo.svg", "logo-footer.svg", "logo.png"]:
        (PUBLIC / placeholder).unlink(missing_ok=True)

    LOOKBOOK.mkdir(parents=True, exist_ok=True)
    MALIHA.mkdir(parents=True, exist_ok=True)

    # Lookbook PDF: image 1 is the logo, 2 a line drawing, 3–35 the looks.
    pdf_images = extract_pdf_images(SRC / "Maliha SS2021 - Lookbook.pdf")
    save_logo(pdf_images[0])
    for n, img in enumerate(pdf_images[2:], start=3):
        save(img, LOOKBOOK / f"look-{n:02d}.jpg")

    # Instagram photos, in filename (= posting) order.
    ig = sorted(SRC.glob("SaveClip.App_*.jpg"))
    for n, path in enumerate(ig, start=1):
        save(Image.open(path).convert("RGB"), MALIHA / f"ig-{n:02d}.jpg")

    # Wide banners at the exact desktop ratios (24/10 and 10/4).
    save(triptych([MALIHA / "ig-09.jpg", MALIHA / "ig-10.jpg", MALIHA / "ig-11.jpg"], 2400, 1000, 0.3, trim_left=[0.05, 0.05, 0.14]), MALIHA / "banner-woman.jpg", max_w=2400)
    save(triptych([LOOKBOOK / "look-10.jpg", LOOKBOOK / "look-16.jpg", LOOKBOOK / "look-23.jpg"], 2400, 960, 0.22), MALIHA / "banner-atelier.jpg", max_w=2400)
    save(triptych([LOOKBOOK / "look-05.jpg", LOOKBOOK / "look-15.jpg", LOOKBOOK / "look-30.jpg"], 2400, 1000, 0.2), MALIHA / "banner-lookbook.jpg", max_w=2400)

    # Blur placeholders for every public image, keyed by URL.
    blurs = {
        "/" + p.relative_to(PUBLIC).as_posix(): blur_data_url(p)
        for p in sorted((PUBLIC / "images").rglob("*.jpg"))
    }
    PLACEHOLDERS.write_text(json.dumps(blurs, indent=1) + "\n", encoding="utf-8")

    print(f"lookbook: {len(pdf_images) - 2} looks, instagram: {len(ig)} photos, logo: {pdf_images[0].size}")


if __name__ == "__main__":
    main()
