"""網站的示範歌：站長的 there's nothing…（站長 2026-11-12：夜車是 AI 做的不能用 → 全站改用這首）。

出處：
- 歌名、署名、試聽：site_store_data.MINE（App 範本支線 ArtistTemplateDemoVideoSource.swift）；錄音名「試聽片段」＝同檔 takeName。
- 調性 E 小調、速度約 81 BPM、和弦：2026-11-12 用分軌（吉他＋貝斯、鼓）分析音檔得到的初稿，站長同意照草稿做；
  和弦位置是估的，站長若給正確和弦就改這裡。這首是純音樂 → 不放歌詞、不編靈感內容。
- 分軌：Demucs 拆出的鼓、貝斯、吉他、其他（人聲、鋼琴幾乎無聲沒留），站長聽過可用；
  網站用 1:10 起 30 秒（站長 11-12 指定；web/assets/theres-nothing-stems/clip/，做法見該資料夾 README）。
  錄音分頁的「試聽片段」仍是範本試聽那段（0:30 起）。
"""
from pathlib import Path

from site_store_data import MINE

STEM_DIR = Path(__file__).resolve().parent / "assets" / "theres-nothing-stems" / "clip"
AUDIO_SUBDIR = "tn"  # → site/assets/audio/tn/
# (檔名, 軌名)：軌名用 App 編曲軌常見的中文名稱
STEMS = [("drums", "鼓"), ("bass", "貝斯"), ("guitar", "吉他"), ("other", "其他")]

SONG = {
    "name": MINE["title"],
    "artist": MINE["artist"],
    "key": "E",
    "mode": "minor",
    "bpm": 81,
    "meter": "4/4",
    "take": "試聽片段",
    "takeSeconds": 30.0,
    "seed": "",
    "status": "collecting",
    "lanes": [name for _, name in STEMS],
    # 首屏和弦卡：這首最常出現的四個和弦
    "chords": ["Em", "G", "Am", "C"],
    # 和弦譜 8 小節（分析稿 0:20 那段）
    "bars": ["C", "Am", "Am", "Em", "G", "Em", "Am", "E"],
    "sections": [{"kind": "verse", "name": "", "romans": [], "beats": [4] * 8, "meter": "4/4", "lyrics": []}],
}


def song_meta() -> str:
    """「E 小調 · 81 BPM · 4/4」；站長 11-12：網站上不寫歌名。"""
    mode = "大調" if SONG["mode"] == "major" else "小調"
    return f'{SONG["key"]} {mode} · {SONG["bpm"]} BPM · {SONG["meter"]}'


def audio_files() -> list[tuple[Path, str]]:
    """(來源, site/assets/audio/ 底下的路徑)。試聽＝主錄音（take），四軌＝編曲。"""
    preview = Path(__file__).resolve().parent / MINE["preview"]
    files = [(preview, f"{AUDIO_SUBDIR}/take.m4a")]
    files += [(STEM_DIR / f"{stem}.m4a", f"{AUDIO_SUBDIR}/{stem}.m4a") for stem, _ in STEMS]
    missing = [str(src) for src, _ in files if not src.is_file()]
    if missing:
        raise FileNotFoundError("找不到示範歌音檔：" + "、".join(missing))
    return files


def audio_urls() -> dict:
    """給示範手機與編曲元件用（相對 assets/audio/）。"""
    lanes = [f"{AUDIO_SUBDIR}/{stem}.m4a" for stem, _ in STEMS]
    return {"take": f"{AUDIO_SUBDIR}/take.m4a", "free": lanes, "lanes": lanes}
