"""首頁（站長 2026-11-12 照 web/drafts/redesign.html 草稿重排；示範歌＝站長的 there's nothing…，夜車不用）。

段落順序：
1. 首屏：小標＋大標＋說明＋按鈕，右邊和弦卡「試試你的按法」（從這首最常出現的四個和弦開始，點格子改按法，
   即時跳出「看起來像」的和弦名稱、可儲存；站長 11-13：要讓人知道能記下獨特和弦）
2. 寫歌四步：靈感＝四張起點卡、錄一段＝全頁唯一一支手機、編曲＝四軌分軌元件、和弦譜＝可點的 8 小節（site_home_steps.py）
3. 寫歌時順手的工具：三張資訊卡（site_tool_cards.py）
4. 藝人範本預告卡 → 5. 免費版與 Pro（長條對比＋對照表＋價格，site_home_pro.py）→ 6. 收尾（站長 11-13 拿掉隱私承諾小字）
文字出處見 site_content.py；「看看怎麼用 ›」是站長 11-12 審過的新寫按鈕。
"""
from site_app_screens import pane_phone, song_json, stage
from site_content import APP_NAME, FEATURES, HERO_EYEBROW, INTRO, PRIVACY_PROMISE, TOOL_BANDS
from site_home_pro import pro_section
from site_home_steps import chord_sheet, inspire_cards, multitrack
from site_icons import icon
from site_showcase import final_cta
from site_song import SONG
from site_store_home import welcome_card
from site_tool_cards import tool_cards
from site_theme import esc

STEP_TITLES = ["靈感來了", "錄一段", "編曲", "和弦譜"]  # 站長訂的四步名稱
TRY_TITLE = "試試你的按法"  # 站長 11-13：首屏要叫人試按法、看它跳出和弦名稱
TRY_CAPTION = "點格子換按法，它會認出這是什麼和弦。"  # 站長 11-13（FretboardEditorView「看起來像」＋儲存）
HOW_TO = "看看怎麼用"  # 站長 11-12 草稿


def hero() -> str:
    return (
        '<section class="st-hero"><div class="sc-in st-hero-grid">'
        f'<div class="st-copy"><p class="st-eyebrow">{esc(HERO_EYEBROW)}</p><h1>{esc(APP_NAME)}</h1>'
        f'<p class="st-lead">{esc(INTRO)}</p><div class="sc-actions"><a class="btn" href="download/">下載 App</a>'
        f'<a class="btn ghost" href="#steps">{HOW_TO}</a></div></div>'
        f'<div class="st-chords" data-hero-chords data-song="{song_json(SONG)}">'
        f'<p class="st-try">{esc(TRY_TITLE)}</p><p class="st-cap">{esc(TRY_CAPTION)}</p>'
        '<div class="st-chord-row" role="tablist" aria-label="和弦"></div>'
        '<div class="st-board"><p class="st-board-title"></p><div class="st-board-grid" role="group" aria-label="指板"></div>'
        # 站長 11-13 嫌排版醜 → 指板下面收成一列：左邊「看起來像」＋和弦名，右邊兩顆試聽（FretboardEditorView：整個和弦／一弦一弦）＋儲存
        '<div class="st-result"><div class="st-guess" aria-live="polite"></div><div class="st-acts">'
        f'<button type="button" data-hero-play="all" aria-label="試聽整個和弦" title="試聽整個和弦">{icon("play.fill")}</button>'
        f'<button type="button" data-hero-play="each" aria-label="一弦一弦彈" title="一弦一弦彈">{icon("arrow.down.to.line")}</button>'
        '<button type="button" class="st-save" data-hero-save>儲存</button></div></div></div>'
        '</div></div></section>'
    )


def _visual(index: int) -> str:
    if index == 0:
        return inspire_cards()
    if index == 1:
        return stage(pane_phone(SONG, "錄音", "record", ""), note="")  # 標題不寫歌名
    if index == 2:
        return multitrack("")
    return chord_sheet()


def step(index: int, feature: dict) -> str:
    pts = "".join(f"<li>{esc(p)}</li>" for p in feature["points"])
    flip = " flip" if index % 2 else ""
    points = f'<ul class="st-points">{pts}</ul>' if pts else ""
    return (f'<section class="st-step" id="{feature["anchor"]}"><div class="sc-in sc-split{flip}">'
            f'<div class="st-copy" data-reveal><p class="st-eyebrow"><span class="st-num">{index + 1:02d}</span>'
            f'{esc(STEP_TITLES[index])}</p><h2>{esc(feature["title"])}</h2><p class="st-lead">{esc(feature["lead"])}</p>'
            f'{points}</div><div data-reveal>{_visual(index)}</div></div></section>')


def steps() -> str:
    flow = " → ".join(f'<span>{esc(t)}</span>' for t in STEP_TITLES)  # 每步不拆行（「錄一段」不會斷成兩行）
    head = f'<div class="sc-in st-head" data-reveal><h2 class="st-flow">{flow}</h2></div>'
    body = "".join(step(i, f) for i, f in enumerate(FEATURES))
    return f'<div class="st-steps" id="steps">{head}{body}</div>'


def tools() -> str:
    return (f'<section class="st-band"><div class="sc-in"><div class="st-head" data-reveal><h2>寫歌時順手的工具</h2></div>'
            f'{tool_cards(TOOL_BANDS)}</div></section>')


def promise() -> str:
    """站長 2026-11-11：隱私承諾改成頁尾上方的小字。"""
    return (f'<div class="sc-in sc-promise"><p>{esc(PRIVACY_PROMISE)}'
            ' <a href="privacy/">讀隱私政策 →</a></p></div>')


def home_body() -> str:
    return ('<div class="studio">' + hero() + steps() + tools() + welcome_card("") + pro_section()
            + final_cta("") + "</div>")
