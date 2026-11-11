"""瀏覽器分頁圖示（站長 2026-11-11：正方形太醜 → 圓角）。

- 用 App icon 原圖，只把四個角裁成透明（圓角半徑＝邊長 22%，接近 iOS），圖案不動、不重畫。
- favicon-32／48／180.png：圓角透明；apple-touch-icon.png：180 正方形不透明（iOS 自己裁圓角，透明角會變黑邊）。
- 圓角用 4 倍大的遮罩畫完再縮小，邊緣才平順。
"""
from pathlib import Path

from PIL import Image, ImageDraw

CORNER_RATIO = 0.22
FAVICON_SIZES = (32, 48, 180)
TOUCH_SIZE = 180
SUPERSAMPLE = 4


def _rounded(icon: Image.Image) -> Image.Image:
    side = icon.width * SUPERSAMPLE
    mask = Image.new("L", (side, side), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, side - 1, side - 1), radius=round(side * CORNER_RATIO), fill=255)
    out = icon.convert("RGBA")
    out.putalpha(mask.resize(icon.size, Image.LANCZOS))
    return out


def favicon_name(size: int) -> str:
    return f"favicon-{size}.png"


def write_favicons(source: Path, out_dir: Path) -> list[Path]:
    """source：App icon 原圖（正方形）；回傳產出的檔案。"""
    with Image.open(source) as raw:
        if raw.width != raw.height:
            raise ValueError(f"App 圖示不是正方形：{raw.size}")
        rounded = _rounded(raw)
        touch = raw.convert("RGB").resize((TOUCH_SIZE, TOUCH_SIZE), Image.LANCZOS)
    out_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for size in FAVICON_SIZES:
        path = out_dir / favicon_name(size)
        rounded.resize((size, size), Image.LANCZOS).save(path, optimize=True)
        paths.append(path)
    touch_path = out_dir / "apple-touch-icon.png"
    touch.save(touch_path, optimize=True)
    return [*paths, touch_path]
