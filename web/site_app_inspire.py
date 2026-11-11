"""靈感分頁的四個起點編輯畫面（HTML 骨架；互動在 site_app_js_inspire.py）。

對照的 SwiftUI 檔：
- 塗鴉：SketchCanvasView.swift（標題「畫一張」、取消／儲存；右上浮鈕 復原／重做／畫紙深淺／底紋／適合畫面；
  下方 PencilKit 筆選器：鋼筆黑、麥克筆黃、鉛筆黑、橡皮擦）。網頁版：訪客自己在 canvas 上畫，筆跡只留在記憶體。
- 文字：InspirationView.swift textEditorSheet（標題「起點文字」、取消／儲存、提示字「這首歌從哪裡開始？一句話、一個畫面都好」）。
- 聲音：SeedVoiceRecorderSheet.swift（標題「聲音起點」、取消、重錄／用這段）；沿用錄音分頁的大錄音鈕，不出聲。
- 照片：App 用系統照片選擇器（PhotosPicker）。網頁不開相簿，改成幾格純色示意（標「功能示意」）。
"""
from site_app_data import STRINGS as S
from site_icons import icon
from site_theme import esc

# 照片選擇器的示意色塊：App 的系統色（Theme.swift 用的 systemBlue／systemRed＋iOS 系統色）
PHOTO_SWATCHES = ["#0A84FF", "#FF453A", "#30D158", "#FF9F0A", "#BF5AF2", "#64D2FF"]
TOOLS = [("pk.pen", "pen", "鋼筆"), ("pk.marker", "marker", "麥克筆"), ("pk.pencil", "pencil", "鉛筆"), ("pk.eraser", "eraser", "橡皮擦")]
TEXT_PLACEHOLDER = "這首歌從哪裡開始？一句話、一個畫面都好"  # InspirationView.swift CardTextEditor placeholder


def sheet_bar(title: str, confirm: str, confirm_act: str) -> str:
    return (f'<div class="a-sheet-bar"><button type="button" class="a-link" data-close>取消</button><b>{esc(title)}</b>'
            f'<button type="button" class="a-link" data-act="{confirm_act}">{esc(confirm)}</button></div>')


def sketch_sheet() -> str:
    float_btns = "".join(f'<button type="button" class="sk-float" {attrs} aria-label="{label}">{icon(sf)}</button>'
                         for sf, label, attrs in (("arrow.uturn.backward", "復原", 'data-act="undo"'),
                                                  ("arrow.uturn.forward", "重做", 'data-act="redo"'),
                                                  ("circle.lefthalf.filled", "畫紙深淺", 'tabindex="-1"'),
                                                  ("square.grid.3x3", "底紋", 'tabindex="-1"'),
                                                  ("arrow.up.left.and.arrow.down.right", "適合畫面", 'tabindex="-1"')))
    tools = "".join(f'<button type="button" class="sk-tool{" on" if key == "pen" else ""}" data-tool="{key}" aria-label="{label}">{icon(sf)}</button>'
                    for sf, key, label in TOOLS)
    return (f'<div class="a-sheet sk-sheet" data-sheet="sketch">{sheet_bar("畫一張", "儲存", "save-sketch")}'
            f'<div class="sk-paper"><canvas class="sk-canvas" aria-label="畫布：用手指或滑鼠畫"></canvas>'
            f'<div class="sk-floats">{float_btns}</div></div><div class="sk-tools">{tools}</div></div>')


def text_sheet() -> str:
    return (f'<div class="a-sheet" data-sheet="text">{sheet_bar("起點文字", "儲存", "save-text")}'
            f'<div class="ph-scroll"><textarea class="a-card tx-area" rows="6" placeholder="{esc(TEXT_PLACEHOLDER)}" aria-label="起點文字"></textarea></div></div>')


def photo_sheet() -> str:
    tiles = "".join(f'<button type="button" class="pp-tile" data-color="{c}" style="background:{c}" aria-label="示意照片 {i + 1}"></button>'
                    for i, c in enumerate(PHOTO_SWATCHES))
    return (f'<div class="a-sheet" data-sheet="photo"><div class="a-sheet-bar"><button type="button" class="a-link" data-close>取消</button>'
            '<b>照片</b><span style="width:44px"></span></div>'
            f'<div class="ph-scroll"><p class="pp-note">功能示意：App 這裡是系統的照片選擇器，只複製你挑的那一張</p>'
            f'<div class="pp-grid">{tiles}</div></div></div>')


def voice_sheet() -> str:
    return ('<div class="a-sheet" data-sheet="voice"><div class="a-sheet-bar"><button type="button" class="a-link" data-close>取消</button>'
            '<b>聲音起點</b><span style="width:44px"></span></div><div class="ph-scroll"><div class="rec-panel">'
            f'<p class="rec-status" data-v-status>{esc(S["rec_idle"])}</p><div class="rec-row">'
            f'<button type="button" class="rec-btn" data-act="v-rec" aria-label="錄音"><span class="rec-ic idle">{icon("mic.fill")}</span>'
            f'<span class="rec-ic busy">{icon("stop.fill")}</span></button></div><div class="rec-time" data-v-time>0:00</div></div>'
            '<div class="vs-actions" hidden><button type="button" class="a-btn soft" data-act="v-redo">重錄</button>'
            '<button type="button" class="a-btn" data-act="v-use">用這段</button></div></div></div>')


def inspire_sheets() -> str:
    return sketch_sheet() + text_sheet() + photo_sheet() + voice_sheet()


INSPIRE_CSS = """
.sk-sheet { inset:0; border-radius:0; z-index:9; }
.sk-paper { position:relative; flex:1; margin:0 10px; border-radius:12px; overflow:hidden; background:#FFF; }
@media (prefers-color-scheme:dark) { .sk-paper { background:#000; box-shadow:inset 0 0 0 1px var(--a-hair); } }
.studio .sk-paper { background:#000; box-shadow:inset 0 0 0 1px var(--a-hair); }
.sk-canvas { position:absolute; inset:0; width:100%; height:100%; touch-action:none; cursor:crosshair; }
.sk-floats { position:absolute; top:8px; right:8px; display:flex; gap:4px; }
.sk-float { width:30px; height:26px; border:0; border-radius:8px; background:var(--a-card); color:var(--a-label); font-size:14px;
  display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.15); }
.sk-float:disabled { color:var(--a-sub); opacity:.5; cursor:default; }
.sk-tools { flex:none; display:flex; justify-content:center; gap:14px; padding:10px 0 16px; }
.sk-tool { width:40px; height:40px; border-radius:12px; border:0; background:var(--a-card); color:var(--a-label); font-size:20px;
  display:flex; align-items:center; justify-content:center; cursor:pointer; }
.sk-tool[data-tool="marker"] { color:#FFCC00; }
.sk-tool.on { background:var(--a-accent); color:#fff; }
.tx-area { display:block; width:100%; border:0; padding:12px; font:15px/1.6 inherit; font-family:inherit; color:var(--a-label); resize:none; }
.tx-area:focus { outline:2px solid var(--a-accent); }
.pp-note { font-size:11.5px; color:var(--a-sub); margin:4px 2px 10px; }
.pp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; }
.pp-tile { aspect-ratio:1; border:0; border-radius:4px; cursor:pointer; }
.vs-actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:14px; }
.seed-media { padding:12px 14px; }
.seed-media img { display:block; width:100%; max-height:150px; object-fit:contain; border-radius:12px; margin-top:6px; }
.seed-photo { position:relative; height:120px; border-radius:12px; margin-top:6px; display:flex; align-items:flex-end; justify-content:flex-end; }
.seed-photo em { font-style:normal; font-size:10.5px; font-weight:700; color:#fff; background:rgba(0,0,0,0.35); border-radius:999px; padding:2px 8px; margin:8px; }
.seed-voice .ico { background:var(--a-accent); color:#fff; }
.a-dialog-title { padding:12px 14px; text-align:center; font-size:12.5px; color:var(--a-sub); border-bottom:0.5px solid var(--a-hair); }
.a-dialog-title b { display:block; font-size:13px; color:var(--a-sub); margin-bottom:2px; }
.a-dialog .danger { color:var(--a-red); }
.sk-sheet + .a-dialog, .a-dialog { z-index:21; }
"""
