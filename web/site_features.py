"""功能頁＝完整功能清單（站長 2026-11-12 照草稿：不放手機，每組一張卡、每項一行字；首頁四步負責展示；11-12 加上 iPhone 設定頁那種彩色圖示）。

每一行都沿用 site_content.py 已註明出處的 App 文字（FEATURES、TOOL_BANDS、EXTRAS、PRIVACY_PROMISE）與 App 字串
（InspirationView seed_rows、FretboardEditorView／ChordsTabView 那兩句），不另外寫新功能。Pro 區沿用 site_pages.pro_band。
"""
from site_app_data import STRINGS
from site_content import EXTRAS, FEATURES, PRIVACY_PROMISE, TAGLINE, TOOL_BANDS
from site_icons import icon
from site_theme import esc

_EXTRA = {title: text for title, text, _ in EXTRAS}
CHORD_NOTES = ["彈到喜歡的聲音，按出來存進這首歌",  # ChordsTabView.swift
               "猜不出名字也沒關係，一樣存得起來"]  # FretboardEditorView.swift


# 每項的圖示（站長 2026-11-12 嫌功能頁只有文字 → 像 iPhone 設定頁，每列前面一個彩色圖示；圖示名稱照 App 用的 SF Symbols）
ITEM_ICONS = {"聲音": "mic.fill", "文字": "text.quote", "照片": "photo", "塗鴉": "scribble", "靈感匣": "tray.full",
              "回來聽聽你的歌": "repeat", "調音器": "guitars", "節拍器": "metronome", "分享整份譜": "square.and.arrow.up",
              "iCloud 同步（可選）": "lock.fill", "最近刪除": "trash"}
GROUP_ICONS = {"inspiration": ("lightbulb", "#FF9F0A"), "record": ("mic.fill", "#FF3B30"), "arrange": ("slider.vertical.3", "#5856D6"),
               "chart": ("music.note.list", "#007AFF"), "tools": ("metronome", "#34C759"), "sync": ("lock.fill", "#8E8E93")}


def _rows(items: list[tuple[str, str]], color: str, fallback: str) -> str:
    def row(t: str, d: str) -> str:
        ic = icon(ITEM_ICONS.get(t, fallback))
        text = f"<strong>{esc(t)}</strong>" + (f"<span>{esc(d)}</span>" if d else "")
        return f'<li><i class="fl-ic" style="background:{color}">{ic}</i><div>{text}</div></li>'
    return "".join(row(t, d) for t, d in items)


def _groups() -> list[tuple[str, str, str, list[tuple[str, str]]]]:
    """(錨點, 組名, 一句說明, [(項目, 說明)])。"""
    ins, rec, arr, chart = FEATURES
    tools = {t["anchor"]: t for t in TOOL_BANDS}
    return [
        ("inspiration", "靈感", ins["lead"],
         [(k, d) for k, d in STRINGS["seed_rows"]] + [("靈感匣", _EXTRA["靈感匣"]), ("回來聽聽你的歌", _EXTRA["回來聽聽你的歌"])]),
        ("record", "錄音", rec["lead"], [(p, "") for p in rec["points"]]),
        ("arrange", "編曲", arr["lead"], [(p, "") for p in arr["points"]]),
        ("chart", "和弦譜", chart["lead"], [(p, "") for p in CHORD_NOTES]),
        ("tools", "工具與分享", "",
         [(tools["tuner"]["title"], tools["tuner"]["lead"]), (tools["metronome"]["title"], tools["metronome"]["lead"]),
          (tools["export"]["title"], "・".join(tools["export"]["points"]))]),
        ("sync", "同步與隱私", PRIVACY_PROMISE,
         [("iCloud 同步（可選）", _EXTRA["iCloud 同步（可選）"]), ("最近刪除", _EXTRA["最近刪除"])]),
    ]


def feature_list(pro_html: str, pro_name: str) -> str:
    groups = _groups()
    jump = "".join(f'<a href="#{a}">{esc(n)}</a>' for a, n, _, _ in groups) + f'<a href="#pro">{esc(pro_name)}</a>'
    head = (f'<section class="pg-head"><div class="sc-in"><h1>功能</h1><p>{esc(TAGLINE)}</p>'
            f'<nav class="jump" aria-label="跳到功能">{jump}</nav></div></section>')
    def card(a: str, n: str, lead: str, items: list[tuple[str, str]]) -> str:
        ic, color = GROUP_ICONS[a]
        return (f'<section class="fl-card" id="{a}" data-reveal><div class="fl-head"><i class="fl-big" style="background:{color}">'
                f'{icon(ic)}</i><h2>{esc(n)}</h2></div>{f"<p>{esc(lead)}</p>" if lead else ""}'
                f'<ul>{_rows(items, color, ic)}</ul></section>')
    cards = "".join(card(*g) for g in groups)
    return head + f'<div class="sc-in fl-grid">{cards}</div>' + pro_html


FEATURES_CSS = """
.fl-grid { display:grid; grid-template-columns:minmax(0,1fr); gap:1rem; margin-top:2rem; margin-bottom:clamp(3rem,7vw,5rem); }
.fl-head { display:flex; align-items:center; gap:0.8rem; }
.fl-big, .fl-ic { display:flex; align-items:center; justify-content:center; color:#fff; flex:none; font-style:normal; }
.fl-big { width:48px; height:48px; border-radius:12px; font-size:1.5rem; }
.fl-ic { width:30px; height:30px; border-radius:8px; font-size:1rem; margin-top:0.1rem; }
@media (min-width:820px) { .fl-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
.fl-card { background:var(--card); border-radius:28px; padding:1.8rem 1.6rem; }
.fl-card h2 { font-size:1.5rem; }
.fl-card > p { color:var(--sub); margin-top:0.4rem; line-height:1.7; }
.fl-card ul { list-style:none; display:grid; gap:0.7rem; margin-top:1.1rem; }
.fl-card li { display:grid; grid-template-columns:30px minmax(0,1fr); gap:0.8rem; padding-top:0.7rem; border-top:1px solid var(--line); }
.fl-card li > div { display:grid; gap:0.1rem; }
.fl-card li:first-child { border-top:0; padding-top:0; }
.fl-card li span { color:var(--sub); font-size:0.94rem; line-height:1.65; }
"""
