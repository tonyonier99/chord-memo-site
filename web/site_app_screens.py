"""網頁重畫的 App 畫面（HTML 骨架；會動的部分由 site_app_js*.py 接手）。

對照的 SwiftUI 檔：
- 所有歌曲（首頁歌曲牆）：SongGalleryView.swift、SongOrganizationViews.swift（歌卡的星）
- 工作區外框（導覽列、底部四分頁）：WorkspaceChrome.swift、ContentView.swift SongWorkspaceView
- 靈感：InspirationView.swift（「聲音」選單＝confirmationDialog）
- 錄音：RecorderView.swift、MeterHaloButton.swift、RecordCountdownViews.swift、RecordClickViews.swift
- 編曲：ArrangeTabView.swift、ArrangeLaneViews.swift、ArrangeRecordButton.swift、ArrangeAddTrackCard.swift
- 和弦（和弦譜）：ChartTabView.swift、ChartTabView+Sections.swift、ChartTabView+Editing.swift、ChartPlayBar.swift
- 按法：FretboardEditorView.swift（和弦按法由 App 和弦引擎 engine.js 即時算）
圖示：SF Symbols → Phosphor（site_icons.py 對照表）。
"""
import json

from site_app_data import STRINGS as S
from site_app_inspire import inspire_sheets
from site_content import DEMO_NOTE
from site_icons import icon
from site_theme import esc

TAB_ICONS = {"靈感": "lightbulb", "錄音": "waveform", "編曲": "slider.vertical.3", "和弦": "music.note.list"}  # WorkspaceTab.label
SEED_ICONS = {"聲音": "speaker.wave.2", "文字": "text.quote", "照片": "photo", "塗鴉": "scribble"}  # InspirationView rowContent


def phone(inner: str, *, attrs: str = "", status: str = "9:41") -> str:
    return (f'<div class="ph"{attrs}><div class="ph-screen"><div class="ph-status">{status}</div>'
            f'{inner}<div class="a-toast" role="status"></div></div></div>')


def stage(phone_html: str, note: str = DEMO_NOTE) -> str:
    note_html = f'<p class="ph-note">{esc(note)}</p>' if note else ""  # 空字串＝不放（同一區多支手機時只在區塊標一次）
    return f'<div class="ph-stage"><div class="ph-card">{phone_html}{note_html}</div></div>'


def song_json(song: dict) -> str:
    return esc(json.dumps(song, ensure_ascii=False))


def menu_item(label: str, sf: str = "", attrs: str = 'data-close', cls: str = "") -> str:
    """iOS 選單列：左字、右圖示。"""
    klass = f' class="{cls}"' if cls else ""
    return f'<button type="button"{klass} {attrs}><span>{esc(label)}</span>{icon(sf)}</button>'


def song_card(name: str, status: str, push: bool) -> str:
    tag, attrs = ("button", ' type="button" data-push="song"') if push else ("div", "")
    return (f'<{tag} class="a-songcard"{attrs}><div class="cover">{icon("waveform")}'
            f'<span class="card-star">{icon("star")}</span></div>'
            f'<strong>{esc(name)}</strong><em class="a-pill">{esc(status)}</em></{tag}>')


def gallery_view(song: dict) -> str:
    cards = (song_card(song["name"], S["status"].get(song["status"], "收集"), True)
             + song_card(S["sample_name"], S["status"]["collecting"], False))
    return ('<div class="ph-view on" data-view="gallery"><div class="ph-nav"><b></b>'
            f'<span class="ph-circle" aria-hidden="true">{icon("ellipsis.circle")}</span></div>'
            f'<div class="ph-scroll"><div class="ph-large">{esc(S["gallery_title"])}</div>'
            f'<div class="a-search">{icon("magnifyingglass")}<span>{esc(S["search"])}</span></div>'
            f'<div class="a-card a-row"><span class="tint">{icon("tray.full")}</span><span>{esc(S["inbox"])}</span>'
            f'<span class="chev">{icon("chevron.right")}</span></div>'
            f'<div class="a-grid" style="margin-top:12px">{cards}</div></div>'
            f'<span class="fab-new" aria-hidden="true">{icon("square.and.pencil")}</span></div>')


SEED_ACTS = {"聲音": "voice", "文字": "text", "照片": "photo", "塗鴉": "sketch"}


def seed_row(title: str, sub: str, song: dict) -> str:
    """一個起點一格（data-seed）；有內容＝攤開的卡，空＝細加列（InspirationView rowContent）。"""
    act = SEED_ACTS[title]
    if title == "文字" and song.get("seed"):
        inner = (f'<div class="a-card seed-text" role="button" tabindex="0" data-act="text"><div class="seed-head"><small>{title}</small>'
                 f'<span class="more">{icon("ellipsis")}</span></div><p data-seed-text>{esc(song["seed"])}</p></div>')
    else:
        inner = (f'<button type="button" class="a-card a-row" data-act="{act}"><span class="ico">{icon(SEED_ICONS[title])}</span>'
                 f'<div><small>{title}</small><span class="muted">{sub}</span></div>'
                 f'<span class="chev">{icon("chevron.right")}</span></button>')
    return f'<div data-seed="{act}">{inner}</div>'


def inspiration_pane(song: dict) -> str:
    rows = "".join(seed_row(title, sub, song) for title, sub in S["seed_rows"])
    # confirmationDialog 的按鈕是純文字（InspirationView.swift Button("哼一段")），不帶圖示
    hum, imp, cancel = S["voice_dialog"]
    return (f'<div class="ph-pane on" data-pane="靈感"><div class="ph-scroll">'
            f'<div class="a-card name-row"><span class="tint">{icon("pencil")}</span>{esc(song["name"] or S["name_placeholder"])}</div>'
            f'<div class="a-stack" style="margin-top:10px">{rows}</div></div>'
            f'<div class="a-dialog" data-dialog="voice"><div class="a-dialog-box"><div class="a-dialog-group">'
            f'<button type="button" data-act="hum">{esc(hum)}</button><button type="button" data-close>{esc(imp)}</button></div>'
            f'<button type="button" class="a-dialog-cancel" data-close>{esc(cancel)}</button></div></div>{inspire_sheets()}</div>')


def record_pane(song: dict) -> str:
    timer_opts = "".join(f'<button type="button" data-count="{s}"><span>{"關" if s == 0 else f"{s} 秒"}</span></button>'
                         for s in (0, 3, 5, 10))  # RecordCountdownSettings.options／title
    return ('<div class="ph-pane" data-pane="錄音" data-ctl="record"><div class="ph-scroll"><div class="rec-panel">'
            f'<p class="rec-status">{esc(S["rec_idle"])}</p><div class="rec-row">'
            f'<button type="button" class="rec-side" data-act="countdown" aria-label="開錄倒數">{icon("timer")}<small data-count-label></small></button>'
            f'<button type="button" class="rec-btn" data-act="rec" aria-label="錄音"><span class="rec-ic idle">{icon("mic.fill")}</span>'
            f'<span class="rec-ic busy">{icon("stop.fill")}</span></button>'
            f'<button type="button" class="rec-side" data-act="met" aria-label="節拍器">{icon("metronome")}</button></div>'
            '<div class="rec-time">0:00</div><div class="rec-cap"></div></div>'
            '<div class="a-seg"><button type="button" class="on" data-fav="0"></button><button type="button" data-fav="1"></button></div>'
            '<div class="a-sec" data-takes-head></div><div class="a-card" data-takes></div>'
            f'<p class="rec-cap" data-fav-empty style="display:none;padding:8px">{esc(S["fav_empty"])}</p></div>'
            f'<div class="a-menu" data-menu="countdown">{timer_opts}</div></div>')


def arrange_pane() -> str:
    return ('<div class="ph-pane" data-pane="編曲" data-ctl="arrange"><div class="ph-scroll">'
            '<div class="a-card ar-transport">'
            f'<button type="button" class="tr-btn" data-act="rewind" aria-label="回到開頭">{icon("backward.end.fill")}</button>'
            f'<button type="button" class="tr-btn rec" aria-label="錄音">{icon("record.circle")}</button>'
            f'<button type="button" class="tr-play" data-act="play" aria-label="播放"><span class="p-on">{icon("play.circle.fill")}</span>'
            f'<span class="p-off">{icon("stop.circle.fill")}</span></button>'
            '<span class="ar-time" data-time></span>'
            f'<button type="button" class="tr-btn" aria-label="縮小時間軸">{icon("minus.magnifyingglass")}</button>'
            f'<button type="button" class="tr-btn" aria-label="放大時間軸">{icon("plus.magnifyingglass")}</button></div>'
            '<div class="a-card lanes" data-lanes><div class="playhead"></div></div>'
            f'<div class="a-card add-card"><div class="add-head"><button type="button" class="a-link add-main" data-act="add">'
            f'{icon("plus.circle.fill")}<span data-add-label>{esc(S["add_track"])}</span></button>'
            f'<span class="a-pro" data-pro hidden>Pro</span><button type="button" class="a-link add-import">{icon("square.and.arrow.down")}'
            f'{esc(S["import"])}</button><small data-count></small></div><p data-add-hint></p></div></div></div>')


def chart_menus() -> str:
    bar = (menu_item("從這裡播放", "play", 'data-act="play-from"') + menu_item("改按法", "guitars", 'data-act="fingering"')
           + menu_item("自訂按法…", "hand.point.up.left") + menu_item("清空小節", "eraser", 'data-act="clear-bar"', "danger"))
    sec = (menu_item("上移", "arrow.up", 'data-act="up"') + menu_item("下移", "arrow.down", 'data-act="down"')
           + menu_item("刪除段落", "trash", 'data-act="delete"', "danger"))
    return f'<div class="a-menu" data-menu="bar">{bar}</div><div class="a-menu" data-menu="section">{sec}</div>'


def chart_sheets() -> str:
    presets = "".join(f'<button type="button" class="a-chip" data-preset="{p}">{p}</button>' for p in S["section_presets"])
    return (f'<div class="a-sheet" data-sheet="fret"><div class="a-sheet-bar"><button type="button" class="a-link" data-close>取消</button>'
            f'<b>{esc(S["fret_title"])}</b><button type="button" class="a-link" data-act="save-fret">儲存</button></div>'
            f'<div class="ph-scroll"><div class="a-card fret-card"><small>{icon("hand.point.up.left")} <span data-fret-title></span></small>'
            f'<p>{esc(S["fret_hint"])}</p></div><div class="a-card fret-card" data-fretboard></div>'
            '<div class="a-card fret-card fret-guess"><div data-fret-guess></div>'
            f'<button type="button" class="a-link fret-clear" data-act="clear-fret">{icon("arrow.uturn.backward")} 清除自訂 · 改回預設按法</button></div></div></div>'
            '<div class="a-sheet" data-sheet="add"><div class="a-sheet-bar"><button type="button" class="a-link" data-close>取消</button>'
            '<b>加入段落</b><button type="button" class="a-link" data-act="add-confirm">加入</button></div>'
            f'<div class="ph-scroll"><div class="a-sec">段落名稱</div><div class="preset-chips">{presets}</div>'
            '<div class="a-sec">內容</div><div class="a-card a-row"><span>小節數</span><span class="chev">4 小節</span></div></div></div>')


def chart_pane(song: dict) -> str:
    sections = song["sections"]
    meter = sections[0]["meter"] if sections else "4/4"
    return ('<div class="ph-pane" data-pane="和弦" data-ctl="chart"><div class="ph-scroll"><div data-sections></div>'
            f'<button type="button" class="a-btn soft chart-add" data-act="add-section">{icon("plus.rectangle.on.rectangle")} 加入段落</button></div>'
            f'<div class="playbar"><button type="button" class="pb-play" data-act="play-all" aria-label="從頭播">{icon("play.circle.fill")}</button><span class="pb-dim">{icon("backward.end.fill")}</span>'
            f'<span class="pb-cap">從頭播 · {song["bpm"]} BPM · {esc(meter)}</span><span class="pb-dim">{icon("repeat")}</span></div>'
            f'{chart_menus()}{chart_sheets()}</div>')


def tab_bar(active: str, interactive: bool) -> str:
    def one(t: str) -> str:
        attrs = f'data-tab="{t}"' if interactive else 'tabindex="-1"'
        return f'<button type="button" {attrs} class="{"on" if t == active else ""}">{icon(TAB_ICONS[t])}<span>{t}</span></button>'
    role = ' role="tablist"' if interactive else ' aria-hidden="true"'
    return f'<div class="ph-tabs"{role}>{"".join(one(t) for t in S["tabs"])}</div>'


def workspace_nav(title: str, back_attrs: str) -> str:
    return (f'<div class="ph-nav"><button type="button" class="ph-circle" {back_attrs}>{icon("chevron.left")}</button>'
            f'<b>{esc(title)}</b><button type="button" class="ph-circle" data-act="more" aria-label="更多">{icon("ellipsis.circle")}</button></div>')


BACK_LIVE = 'data-back aria-label="返回"'
BACK_STATIC = 'tabindex="-1" aria-hidden="true"'


def workspace_view(song: dict) -> str:
    return (f'<div class="ph-view" data-view="song">{workspace_nav(song["name"], BACK_LIVE)}'
            f'{inspiration_pane(song)}{record_pane(song)}{arrange_pane()}{chart_pane(song)}{tab_bar("靈感", True)}</div>')


def tour_phone(song: dict) -> str:
    inner = f'<div class="ph-stack">{gallery_view(song)}{workspace_view(song)}</div>'
    return phone(inner, attrs=f' data-tour data-song="{song_json(song)}"')


def pane_phone(song: dict, pane: str, demo: str, title: str, pro: bool = False) -> str:
    """功能區塊的小示範手機：工作區外框＋只開一個分頁。"""
    builders = {"靈感": inspiration_pane, "錄音": record_pane, "和弦": chart_pane}
    body = arrange_pane() if pane == "編曲" else builders[pane](song)
    body = body.replace('class="ph-pane on"', 'class="ph-pane"').replace(f'class="ph-pane" data-pane="{pane}"',
                                                                         f'class="ph-pane on" data-pane="{pane}"', 1)
    inner = (f'<div class="ph-stack"><div class="ph-view on">{workspace_nav(title, BACK_STATIC)}'
             f'{body}{tab_bar(pane, False)}</div></div>')
    pro_attr = ' data-pro="1"' if pro else ""
    return phone(inner, attrs=f' data-demo="{demo}"{pro_attr} data-song="{song_json(song)}"')
