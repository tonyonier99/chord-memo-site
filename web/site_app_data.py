"""網頁重畫 App 畫面用的資料：全部從和弦大師專案（只讀）讀出，不自己編。

- 示範歌：$CHORD_APP_DIR/示範歌曲/ 的「免費版示範：夜車」「付費版示範：夜車（完整編曲）」（.chorddemo＝JSON）。
  讀歌名、調、速度、拍號、段落（羅馬級數）、歌詞、文字起點、主錄音名稱、錄音長度、編曲軌名。
- 和弦名稱與按法：網頁執行時呼叫 App 內建的和弦引擎（native/ChordMaster/engine.js，App 用 JavaScriptCore 跑的同一份），
  build 時把它複製成 site/assets/chord-engine.js。
- 讀不到示範歌就讓 build 失敗（不產生缺資料的頁面）。
"""
import base64
import json
import struct
from pathlib import Path

from site_content import CHORD_APP_DIR

ENGINE_SRC = "native/ChordMaster/engine.js"
FREE_DEMO = "示範歌曲/免費版示範：夜車.chorddemo"
PRO_DEMO = "示範歌曲/付費版示範：夜車（完整編曲）.chorddemo"
DEMO_PREFIXES = ("免費版示範：", "付費版示範：")
PRO_SUFFIX = "（完整編曲）"


def _load(rel: str) -> dict:
    path = CHORD_APP_DIR / rel
    if not path.is_file():
        raise FileNotFoundError(f"找不到示範歌曲：{path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise ValueError(f"示範歌曲不是有效的 JSON：{path.name}（{error}）") from error


def _m4a_seconds(raw: bytes) -> float:
    """讀 m4a 的 mvhd box 算出長度（秒）；讀不到回 0。"""
    i = raw.find(b"mvhd")
    if i < 0:
        return 0.0
    if raw[i + 4] == 1:
        scale, length = struct.unpack(">IQ", raw[i + 24:i + 36])
    else:
        scale, length = struct.unpack(">II", raw[i + 16:i + 24])
    return length / scale if scale else 0.0


def _files(doc: dict) -> dict[str, bytes]:
    return {f["relativePath"]: base64.b64decode(f["data"]) for f in doc.get("files", [])}


def _main_take(doc: dict, files: dict[str, bytes]) -> tuple[str, float]:
    take = doc["demo"].get("mainTakeId") or ""
    seconds = _m4a_seconds(files.get(f"hums/{take}.m4a", b""))
    return take, round(seconds, 2)


def _lanes(files: dict[str, bytes]) -> list[str]:
    stack = next((v for k, v in files.items() if k.endswith(".stack.json")), None)
    if stack is None:
        return []
    return [layer["name"] for layer in json.loads(stack.decode("utf-8")).get("layers", [])]


def _short_name(name: str) -> str:
    """畫面上的歌名去掉檔名裡區分免費／付費版的前綴與「（完整編曲）」。"""
    for prefix in DEMO_PREFIXES:
        name = name.removeprefix(prefix)
    return name.removesuffix(PRO_SUFFIX)


def _song(doc: dict) -> dict:
    demo = doc["demo"]
    files = _files(doc)
    take, seconds = _main_take(doc, files)
    sections = [{"kind": s.get("kind", "verse"), "name": s.get("name", ""), "romans": s.get("progression", []),
                 "beats": s.get("beats", []), "meter": s.get("meter", "4/4"), "lyrics": s.get("lyricLines", [])}
                for s in demo.get("sections", [])]
    return {"name": _short_name(demo.get("name", "")), "fileName": demo.get("name", ""), "key": demo.get("key", "C"),
            "mode": demo.get("mode", "major"), "bpm": demo.get("bpm", 120), "seed": demo.get("seed", ""),
            "status": demo.get("libraryStatus", "collecting"), "take": take, "takeSeconds": seconds,
            "lanes": _lanes(files), "sections": sections}


def demo_songs() -> dict:
    """{"free": 免費版示範, "pro": 付費版示範}。"""
    return {"free": _song(_load(FREE_DEMO)), "pro": _song(_load(PRO_DEMO))}


def engine_path() -> Path:
    path = CHORD_APP_DIR / ENGINE_SRC
    if not path.is_file():
        raise FileNotFoundError(f"找不到 App 和弦引擎：{path}")
    return path


# ---- App 原文字串（每項註明出處） ----
STRINGS = {
    "gallery_title": "所有歌曲",                       # SongGalleryView.swift navigationTitle
    "search": "搜尋歌名或靈感",                          # SongGalleryView.swift searchable prompt
    "inbox": "靈感匣",                                  # SongGalleryView.swift
    "status": {"collecting": "收集", "incubating": "醞釀", "parked": "暫放", "revisit": "回來聽", "completed": "完成"},  # Demo.swift DemoLibraryStatus
    "sample_name": "範例：你的第一首歌",                 # Demo.swift SampleSong.name
    "tabs": ["靈感", "錄音", "編曲", "和弦"],            # WorkspaceChrome.swift WorkspaceTab（顯示順序 all）
    "seed_rows": [("聲音", "哼一段或加一段聲音"), ("文字", "寫一句話"), ("照片", "拍一張畫面"), ("塗鴉", "畫一筆")],  # InspirationView.swift；文字、照片說明站長 11-13 改
    "name_placeholder": "+ 歌名",                        # InspirationView.swift nameRow
    "voice_dialog": ["哼一段", "匯入音檔", "取消"],        # InspirationView.swift confirmationDialog
    "rec_idle": "點麥克風開始錄", "rec_on": "錄音中…自彈自唱或哼旋律",  # MeterHaloButton.swift
    "takes_header": "這裡的錄音",                        # RecorderView.swift Section
    "fav_empty": "還沒有最愛的錄音，點星星加入。",          # RecorderView.swift
    "add_track": "加一軌", "import": "匯入音檔",          # ArrangeAddTrackCard.swift
    "add_hint": "新增的是空白軌：選定後按上方的錄音鈕錄進去。",  # ArrangeModel.swift ArrangeAddTrack.howToRecord
    "full_hint": "想再錄，可以重錄現有的軌，或先刪掉用不到的那一軌",  # ArrangeModel.swift fullHint
    "lock_hint": "免費版可以錄前 2 軌，第 3 軌以後要 Pro",  # ArrangeLaneLock.swift recordHint（OverdubLimits.freeMaxLayers＝2）
    "chart_hint": "點一下小節 → 下方點和弦連續填 · 點一下歌詞列寫詞 · 段名旁「歌詞」整段貼上 · 底部「加入段落」開主歌副歌",  # ChartTabView.swift
    "section_presets": ["主歌", "導歌", "副歌", "橋段", "前奏", "間奏", "尾奏"],  # SectionOps.swift presetNames
    "fret_title": "編輯按法",                            # FretboardEditorView.swift navigationTitle
    "fret_hint": "點格子設定每條弦的按法，✕ = 悶弦、○ = 空弦",  # FretboardEditorView.swift header
    "string_labels": ["E", "A", "D", "G", "B", "e"],     # InstrumentDefinition.swift guitarStandardTuning.labels
    "open_midi": [40, 45, 50, 55, 59, 64],               # 同上 openMidi
    "copied": "已複製為 ChordPro",                       # ChartTabView+Sections.swift showToast
}
