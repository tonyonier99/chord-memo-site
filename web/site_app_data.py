"""網頁重畫 App 畫面用的資料：全部從和弦大師專案（只讀）讀出，不自己編。

- 和弦名稱與按法：網頁執行時呼叫 App 內建的和弦引擎（native/ChordMaster/engine.js，App 用 JavaScriptCore 跑的同一份），
  build 時把它複製成 site/assets/chord-engine.js。
- STRINGS：App 原文字串（每項註明出處）。
"""
from pathlib import Path

from site_content import CHORD_APP_DIR

ENGINE_SRC = "native/ChordMaster/engine.js"


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
