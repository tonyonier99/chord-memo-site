"""圖示：App 的 SF Symbols → Phosphor Icons（MIT 授權，@phosphor-icons/core@2.1.1，站長 2026-11-11 裁決）。

- SVG 原檔放在 web/assets/icons/（用 curl 從 unpkg 下載，LICENSE 同目錄）；build 時讀檔內嵌進頁面，
  顏色跟著 CSS 的 currentColor、大小跟著 font-size（1em），所以顏色、大小可以照 App 設。
- 對照表只收「網頁有重畫到的位置」用到的 SF 名稱；粗細照 SF：xxx.fill → Phosphor fill，其餘 regular。
- 找不到合適對應的列在 UNMAPPED，畫面上那一格不放圖示（不自己畫）。
"""
import json
import re
from pathlib import Path

ICON_DIR = Path(__file__).resolve().parent / "assets" / "icons"

# SF Symbols 名稱 → Phosphor 檔名（不含 .svg）。後面註明 App 用在哪裡。
SF_TO_PHOSPHOR = {
    "lightbulb": "lightbulb",                   # 分頁列「靈感」（WorkspaceChrome.swift）
    "waveform": "waveform",                     # 分頁列「錄音」；歌卡縮圖（SongGalleryView.swift SongCardThumb）
    "slider.vertical.3": "sliders",             # 分頁列「編曲」；主錄音列「繼續編曲」鈕（RecorderView.swift）
    "music.note.list": "playlist",              # 分頁列「和弦」
    "chevron.left": "caret-left",               # 返回（系統導覽列）；指板「往低把位」（FretboardEditorView.swift）
    "chevron.right": "caret-right",             # 列尾箭頭；指板「往高把位」
    "chevron.down": "caret-down",               # 段落名稱旁（ChartTabView+Sections.swift）
    "chevron.up.chevron.down": "caret-up-down",  # 調音器樂器選單（TunerView.swift）
    "ellipsis": "dots-three",                   # 各處「⋯」選單
    "ellipsis.circle": "dots-three-circle",     # 工作區、所有歌曲右上（WorkspaceChrome／SongGalleryView）
    "square.and.pencil": "note-pencil",         # 所有歌曲「新增一首歌」
    "magnifyingglass": "magnifying-glass",      # 搜尋列
    "tray.full": "tray",                        # 靈感匣列（SongGalleryView.swift）
    "star": "star",                             # 最愛（未加）（SongOrganization.swift）
    "star.fill": "star-fill",                   # 最愛（已加）
    "pencil": "pencil-simple",                  # 靈感頁歌名列（InspirationView.swift）
    "speaker.wave.2": "speaker-high",           # 靈感「聲音」
    "text.quote": "quotes",                     # 靈感「文字」；段落「歌詞」
    "photo": "image",                           # 靈感「照片」；分享整份譜（圖片）
    "scribble": "scribble",                     # 靈感「塗鴉」
    "mic": "microphone",                        # 「哼一段」
    "square.and.arrow.down": "download-simple",  # 匯入音檔
    "mic.fill": "microphone-fill",              # 大錄音鈕（MeterHaloButton.swift）、開始調音
    "stop.fill": "stop-fill",                   # 大錄音鈕（錄音中）、節拍器停止、調音停止
    "timer": "timer",                           # 開錄倒數鈕（RecordCountdownViews.swift）
    "metronome": "metronome",                   # 節拍器鈕（RecordClickViews.swift）、工具選單、節拍器「速度」
    "play.circle.fill": "play-circle-fill",     # 錄音列播放、走帶播放、試聽整個和弦
    "stop.circle.fill": "stop-circle-fill",     # 走帶停止（ArrangeLaneViews.swift、ChartPlayBar.swift）
    "backward.end.fill": "skip-back-fill",      # 回到開頭／從頭播放
    "record.circle": "record",                  # 編曲走帶錄音鈕（ArrangeRecordButton.swift）
    "minus.magnifyingglass": "magnifying-glass-minus",  # 縮小時間軸
    "plus.magnifyingglass": "magnifying-glass-plus",    # 放大時間軸
    "lock.fill": "lock-fill",                   # 原始錄音軌（ArrangeLaneViews.swift）
    "speaker.wave.2.fill": "speaker-high-fill",  # 軌道靜音鈕（未靜音）
    "speaker.slash.fill": "speaker-slash-fill",  # 軌道靜音鈕（已靜音）
    "plus.circle.fill": "plus-circle-fill",     # 加一軌（ArrangeAddTrackCard.swift）
    "plus": "plus",                             # 「+ 小節」「+ 歌詞」；空小節；節拍器加快
    "minus": "minus",                           # 節拍器減慢
    "plus.rectangle.on.rectangle": "stack-plus",  # 加入段落（ChartTabView.swift）※近似
    "repeat": "repeat",                         # 播放列循環（ChartPlayBar.swift）
    "play": "play",                             # 從這裡播放
    "play.fill": "play-fill",                   # 節拍器播放（RhythmView.swift）
    "guitars": "guitar",                        # 改按法 ※近似（SF 是兩把吉他）
    "hand.point.up.left": "hand-pointing",      # 自訂按法…；指板說明
    "eraser": "eraser",                         # 清空小節
    "arrow.up": "arrow-up",                     # 段落上移
    "arrow.down": "arrow-down",                 # 段落下移
    "trash": "trash",                           # 刪除段落
    "square.and.arrow.up": "export",            # 分享（子選單）
    "doc.plaintext": "file-text",               # 分享 ChordPro 文字
    "doc.on.doc": "copy",                       # 複製為 ChordPro
    "list.bullet.indent": "text-indent",        # 整理段落
    "books.vertical": "books",                  # 和弦櫃
    "music.quarternote.3": "music-notes",       # 這首歌的和弦
    "arrow.down.to.line": "arrow-line-down",    # 一弦一弦彈
    "arrow.uturn.backward": "arrow-u-up-left",  # 塗鴉「復原」（SketchCanvasView.swift）；清除自訂按法
    "arrow.uturn.forward": "arrow-u-up-right",  # 塗鴉「重做」
    "circle.lefthalf.filled": "circle-half",    # 塗鴉「畫紙深淺」
    "waveform.badge.magnifyingglass": "magnifying-glass",  # 按法「看起來像」（FretboardEditorView.swift）※近似
    "square.grid.3x3": "grid-nine",             # 塗鴉「底紋」
    "arrow.up.left.and.arrow.down.right": "arrows-out",  # 塗鴉「適合畫面」
    "music.note": "music-note",                 # 範本沒有封面時的佔位（ArtistTemplateArtwork.swift）
    "arrow.up.right": "arrow-up-right",         # 範本詳情「發行版」各平台列（ArtistTemplateReleaseSection.swift）
    # PencilKit 系統筆選器（SketchCanvasView.makeToolPicker；不是 SF 名稱，是系統畫的筆）
    "pk.pen": "pen-nib",                        # 鋼筆（黑）
    "pk.marker": "highlighter",                 # 麥克筆（黃）
    "pk.pencil": "pencil",                      # 鉛筆（黑）
    "pk.eraser": "eraser",                      # 橡皮擦
}

# 找不到合適對應（畫面上那一格不放圖示，交站長看）
UNMAPPED = {
    "tuningfork": "工具選單「調音器」（OthersView.swift）：Phosphor 沒有音叉圖示",
}

_SVG_OPEN = re.compile(r"<svg\b[^>]*>")


def _svg(name: str) -> str:
    path = ICON_DIR / f"{name}.svg"
    if not path.is_file():
        raise FileNotFoundError(f"找不到圖示檔：{path}（用 curl 從 @phosphor-icons/core@2.1.1 下載）")
    body = _SVG_OPEN.sub("", path.read_text(encoding="utf-8"), count=1).replace("</svg>", "")
    return ('<svg class="ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" '
            f'aria-hidden="true" focusable="false">{body}</svg>')


def icon(sf: str) -> str:
    """App 的 SF 名稱 → 內嵌 SVG；沒有對應的回空字串（不自己畫）。"""
    name = SF_TO_PHOSPHOR.get(sf)
    return _svg(name) if name else ""


def icons_js() -> str:
    """給互動程式用：window.CMIcons[SF 名稱] = 內嵌 SVG 字串。"""
    table = {sf: _svg(name) for sf, name in SF_TO_PHOSPHOR.items()}
    return f"<script>window.CMIcons = {json.dumps(table, ensure_ascii=False)};</script>"


ICON_CSS = """
.ic { width:1em; height:1em; display:inline-block; vertical-align:-0.125em; flex:none; }
"""
