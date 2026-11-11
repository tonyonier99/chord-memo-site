"""首頁（站長 2026-11-11 方向：照寫歌的順序走、外觀像一間深色工作室；不再沿用初級大人手冊的模板）。

段落順序：
1. 首屏：標語＋簡介＋示範歌「夜車」實際用到的和弦（點了出指板按法，按法由 App 和弦引擎 engine.js 算）
2. 寫歌四步：靈感來了 → 錄一段 → 編曲 → 和弦譜（每步一支只演那一步的示範手機，全部用「夜車」）
3. 整個 App 玩一次：四個分頁都能操作的導覽手機
4. 寫歌時順手的工具：調音器、節拍器、分享整份譜
5. 還有這些（bento）→ 隱私 → 收尾
文字出處見 site_content.py（每段註明 App 原始碼或現有官網）；只有段落標題「寫歌時順手的工具」「整個 App 玩一次」照站長方向訂。
"""
from site_app_data import demo_songs
from site_app_screens import song_json, stage
from site_bands import demo_phone, tour_stage
from site_content import APP_NAME, DEMO_NOTE, FEATURES, INTRO, PRIVACY_PROMISE, TAGLINE, TOOL_BANDS
from site_showcase import bento, final_cta, store_actions
from site_icons import icon
from site_store_home import welcome_card
from site_theme import esc

STEP_TITLES = ["靈感來了", "錄一段", "編曲", "和弦譜"]  # 站長訂的四步名稱
CHART_CAPTION = "這首歌的獨特和弦 · 照著按就彈得出來"  # ChartExport.swift／ChordPickerSheet.swift
FRET_HINT = "點格子設定每條弦的按法，✕ = 悶弦、○ = 空弦"  # FretboardEditorView.swift


def song_meta(song: dict) -> str:
    """「夜車 · C 大調 · 100 BPM · 4/4」：調名格式照 ChartTabView.keyLabel。"""
    mode = "大調" if song["mode"] == "major" else "小調"
    meter = song["sections"][0]["meter"] if song["sections"] else "4/4"
    return f'{song["name"]} · {song["key"]} {mode} · {song["bpm"]} BPM · {meter}'


def hero(song: dict) -> str:
    return (
        '<section class="st-hero"><div class="sc-in st-hero-grid">'
        f'<div class="st-copy"><p class="st-eyebrow">{esc(TAGLINE)}</p><h1>{esc(APP_NAME)}</h1>'
        f'<p class="st-lead">{esc(INTRO)}</p>{store_actions("")}</div>'
        f'<div class="st-chords" data-hero-chords data-song="{song_json(song)}">'
        f'<p class="st-mono st-meta">{esc(song_meta(song))}</p><p class="st-cap">{esc(CHART_CAPTION)}</p>'
        '<div class="st-chord-row" role="tablist" aria-label="和弦"></div>'
        '<div class="st-board"><p class="st-board-title"></p><div class="st-board-grid" role="group" aria-label="指板"></div>'
        f'<p class="st-cap">{esc(FRET_HINT)}</p>'
        # FretboardEditorView.swift 兩顆試聽：整個和弦一次響／一弦一弦往下彈
        f'<div class="st-play"><button type="button" data-hero-play="all">{icon("play.circle.fill")}試聽整個和弦</button>'
        f'<button type="button" data-hero-play="each">{icon("arrow.down.to.line")}一弦一弦彈</button></div></div>'
        '<div class="st-guess" aria-live="polite"></div></div></div></section>'
    )


def step(index: int, feature: dict, phone_html: str) -> str:
    pts = "".join(f"<li>{esc(p)}</li>" for p in feature["points"])
    flip = " flip" if index % 2 else ""
    return (f'<section class="st-step" id="{feature["anchor"]}"><div class="sc-in sc-split{flip}">'
            f'<div class="st-copy" data-reveal><p class="st-num st-mono">{index + 1:02d}</p>'
            f'<p class="st-eyebrow">{esc(STEP_TITLES[index])} · {esc(feature["eyebrow"])}</p>'
            f'<h2>{esc(feature["title"])}</h2><p class="st-lead">{esc(feature["lead"])}</p>'
            f'<ul class="st-points">{pts}</ul></div><div>{stage(phone_html)}</div></div></section>')


def steps(songs: dict) -> str:
    head = ('<div class="sc-in st-head" data-reveal><p class="st-eyebrow st-mono">'
            f'{esc(song_meta(songs["free"]))}</p><h2>{esc(" → ".join(STEP_TITLES))}</h2></div>')
    body = "".join(step(i, f, demo_phone(f["demo"], songs)) for i, f in enumerate(FEATURES))
    return f'<div class="st-steps">{head}{body}</div>'


def tour() -> str:
    return ('<section class="st-band" id="tour"><div class="sc-in st-tour">'
            f'<div class="st-head" data-reveal><h2>整個 App 玩一次</h2><p class="st-lead">{esc(DEMO_NOTE)}</p></div>'
            f'{tour_stage()}</div></section>')


def tool_card(item: dict, phone_html: str) -> str:
    lead = f'<p class="st-cap">{esc(item["lead"])}</p>' if item["lead"] else ""
    return (f'<div class="st-tool" id="{item["anchor"]}"><h3>{esc(item["title"])}</h3>{lead}'
            f'<p class="st-mono st-tags">{esc(" · ".join(item["points"]))}</p>{stage(phone_html)}</div>')


def tools(songs: dict) -> str:
    cards = "".join(tool_card(t, demo_phone(t["demo"], songs)) for t in TOOL_BANDS)
    return (f'<section class="st-band"><div class="sc-in"><div class="st-head" data-reveal><h2>寫歌時順手的工具</h2></div>'
            f'<div class="st-tools">{cards}</div></div></section>')


def promise() -> str:
    return (f'<section class="st-band"><div class="sc-in sc-promise" data-reveal><p>{esc(PRIVACY_PROMISE)}</p>'
            '<a href="privacy/">讀隱私政策 →</a></div></section>')


def home_body() -> str:
    songs = demo_songs()
    return ('<div class="studio">' + hero(songs["free"]) + steps(songs) + tour() + tools(songs)
            + welcome_card("") + bento("") + promise() + final_cta("") + "</div>")
