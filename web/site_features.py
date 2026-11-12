"""功能頁（站長 2026-11-13 重做：嫌舊版「設定頁清單」醜，順序改照 App 定位）。

定位（站長 11-13）：任何形式的靈感先記下來 → 彈到奇怪的和弦能自訂按法、還會認出名字 → 錄成簡易 demo。
版面：每組一段＝小標（01 02 03）＋大標＋一句說明，底下一格一格的功能（藍色圖示、粗體名稱、一行說明），不再左右兩欄卡片。
隱私那句不放（站長 11-13：沒意義）；ChordPro、匯入電腦檔不寫（站長 11-13）。

文字出處：
- 靈感：site_content.FEATURES[0] 說明、InspirationView.swift seed_rows、EXTRAS（靈感匣、回來聽聽你的歌）
- 和弦：FretboardEditorView.swift（點格子設定按法、看起來像、猜不出名字也沒關係）、ChordsTabView.swift（存進這首歌）、
  FEATURES[3] 和弦譜說明、OthersView.swift 分享整份譜（圖片）
- Demo：FEATURES[1]、[2] 說明與要點、ArrangeTabView 靜音／S、TOOL_BANDS 調音器與節拍器
- 其他：EXTRAS（iCloud 同步、最近刪除）
「站長 11-13」標的是依站長定位新寫的組說明。
"""
from site_app_data import STRINGS
from site_content import EXTRAS, FEATURES, TAGLINE, TOOL_BANDS
from site_icons import ICON_CSS, icon
from site_theme import esc

_EXTRA = {title: text for title, text, _ in EXTRAS}
_SEED_ICONS = {"聲音": "mic.fill", "文字": "text.quote", "照片": "photo", "塗鴉": "scribble"}


def _groups() -> list[dict]:
    ins, rec, arr, chart = FEATURES
    tools = {t["anchor"]: t for t in TOOL_BANDS}
    seeds = [(_SEED_ICONS[k], k, d) for k, d in STRINGS["seed_rows"]]
    return [
        {"anchor": "inspiration", "name": "靈感", "title": "想到什麼，先記下來", "lead": ins["lead"], "items": seeds + [
            ("tray.full", "靈感匣", _EXTRA["靈感匣"]),
            ("repeat", "回來聽聽你的歌", _EXTRA["回來聽聽你的歌"])]},
        {"anchor": "chords", "name": "和弦", "title": "彈出獨特和弦，也存得起來",  # 站長 11-13
         "lead": "按出你自己的按法，它會幫你認出這是什麼和弦。",  # 站長 11-13 定位
         "items": [
            ("hand.point.up.left", "自訂按法", "點格子設定每條弦的按法，✕ = 悶弦、○ = 空弦"),
            ("waveform.badge.magnifyingglass", "看起來像", "按好之後，馬上告訴你這可能是什麼和弦"),
            ("music.quarternote.3", "存進這首歌", "彈到喜歡的聲音就存起來；猜不出名字也沒關係，一樣存得起來"),
            ("music.note.list", "和弦譜", chart["lead"]),
            ("square.and.arrow.up", tools["export"]["title"], tools["export"]["lead"])]},
        {"anchor": "demo", "name": "Demo", "title": "錄成一段簡單的 Demo",  # 站長 11-13
         "lead": "進錄音室之前，先把歌錄出個樣子。",  # 站長 11-13 定位
         "items": [
            ("mic.fill", rec["title"], rec["lead"]),
            ("lock.fill", "錄音留在你手上", rec["points"][0]),
            ("slider.vertical.3", arr["title"], arr["lead"]),
            ("speaker.wave.2.fill", "靜音與只聽這軌", "每一軌都能關掉，或只聽這一軌"),
            ("metronome", tools["metronome"]["title"], tools["metronome"]["lead"]),
            ("guitars", tools["tuner"]["title"], tools["tuner"]["lead"])]},
        {"anchor": "more", "name": "其他", "title": "其他", "lead": "", "items": [
            ("lock.fill", "iCloud 同步（可選）", _EXTRA["iCloud 同步（可選）"]),
            ("trash", "最近刪除", _EXTRA["最近刪除"])]},
    ]


def _tile(ic: str, name: str, text: str) -> str:
    return (f'<li><span class="ft-ic">{icon(ic)}</span><strong>{esc(name)}</strong>'
            f'<span class="ft-tx">{esc(text)}</span></li>')


def _section(g: dict, index: int, total: int) -> str:
    num = f'<p class="ft-num">{index + 1:02d}</p>' if index < total - 1 else ""
    lead = f'<p class="ft-lead">{esc(g["lead"])}</p>' if g["lead"] else ""
    tiles = "".join(_tile(*it) for it in g["items"])
    small = " ft-small" if not g["lead"] else ""
    return (f'<section class="ft-sec{small}" id="{g["anchor"]}"><div class="sc-in"><div class="ft-head" data-reveal>{num}'
            f'<h2>{esc(g["title"])}</h2>{lead}</div><ul class="ft-grid" data-reveal>{tiles}</ul></div></section>')


def feature_list(pro_html: str, pro_name: str) -> str:
    groups = _groups()
    jump = "".join(f'<a href="#{g["anchor"]}">{esc(g["name"])}</a>' for g in groups) + f'<a href="#pro">{esc(pro_name)}</a>'
    head = (f'<section class="pg-head"><div class="sc-in"><h1>功能</h1><p>{esc(TAGLINE)}</p>'
            f'<nav class="jump" aria-label="跳到功能">{jump}</nav></div></section>')
    body = "".join(_section(g, i, len(groups)) for i, g in enumerate(groups))
    return head + f'<div class="ft-wrap">{body}</div>' + pro_html


FEATURES_CSS = ICON_CSS + """
.ft-sec { padding:clamp(2.6rem,6vw,4.2rem) 0 0; }
/* 最後一段跟 Pro 區之間留白（站長 11-13：其他那段貼著 Pro 區） */
.ft-wrap { padding-bottom:clamp(3.5rem,8vw,6rem); }
.ft-head { max-width:40rem; }
.ft-num { color:var(--sub); font-size:0.95rem; font-weight:600; font-variant-numeric:tabular-nums; }
.ft-head h2 { font-size:clamp(1.8rem,3.6vw,2.6rem); line-height:1.2; margin-top:0.2rem; }
.ft-lead { color:var(--sub); font-size:1.1rem; line-height:1.7; margin-top:0.6rem; }
.ft-small .ft-head h2 { font-size:clamp(1.4rem,2.6vw,1.8rem); }
.ft-grid { list-style:none; display:grid; grid-template-columns:minmax(0,1fr); gap:0.8rem; margin-top:1.6rem; }
@media (min-width:600px) { .ft-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:960px) { .ft-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
.ft-grid li { background:var(--card); border-radius:22px; padding:1.4rem 1.3rem; display:flex; flex-direction:column; gap:0.3rem; }
.ft-ic { color:var(--accent); font-size:1.7rem; line-height:1; margin-bottom:0.5rem; display:flex; }
.ft-grid strong { font-size:1.08rem; }
.ft-tx { color:var(--sub); font-size:0.94rem; line-height:1.65; }
"""
