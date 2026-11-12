"""首頁的範本入口：照 App 範本支線「空作品庫大卡」（ArtistTemplateHomeViews.swift ArtistTemplateHomeWelcome）。

- 由上到下：疊放封面（120pt、區高 150）、標題 welcomeTitle、內文 welcomeBody、主要按鈕「看看藝人範本」；卡片圓角 18、內距 20。
- 疊放封面：App 是 3 張往右錯開（ArtistTemplateCoverStack）；網站站長 11-12 改成扇形 5 張（FAN），有封面的在中間最上面、
  不足用 music.note 佔位。封面圓角 10、沒封面＝灰底 music.note。只排版、不畫圖。
- App 卡片外那行「或按右下角的按鈕，寫你的第一首歌」是指 App 裡的按鈕，網站沒有 → 不放。
文案逐字照 ArtistTemplateText.swift；6 首＝FreeTier.demoLimit（跟 site_content.FREE_TIER 同一個數）。
"""
from site_icons import icon
from site_store_data import TEMPLATES
from site_theme import esc

WELCOME_TITLE = "沒想法？先看看合作藝人怎麼寫歌"
WELCOME_BODY = "下載藝人用和弦備忘錄做的歌，從靈感、錄音到編曲一步步拆開看。"  # 站長 11-13：「不算進 6 首」不用寫
WELCOME_BUTTON = "看看藝人範本"
# 站長 11-12：直接放好幾張專輯 → 改成扇形 5 張：中間最上面、左右各兩張往後排，露出佔位的音符。
# 順序＝疊放順序（第一張在最上面）；(往右錯開 × 邊長, 角度, 縮放)
FAN = [(0, 0, 1.0), (-0.62, -7, 0.88), (0.62, 7, 0.88), (-1.12, -13, 0.76), (1.12, 13, 0.76)]
STACK_SIZE = len(FAN)

WELCOME_CSS = """
.tw-welcome { max-width:560px; margin:0 auto; padding:20px; border-radius:18px; background:var(--card); display:grid; gap:12px; }
.tw-stack { --side:120px; position:relative; height:150px; width:100%; }
.tw-stack > * { position:absolute; left:calc(50% - var(--side) / 2); top:15px; width:var(--side); height:var(--side); border-radius:10px;
  object-fit:cover; box-shadow:0 2px 6px rgba(0,0,0,.12), inset 0 0 0 0.5px var(--line); }
.tw-stack .tw-ph { display:flex; align-items:center; justify-content:center; background:#E5E5EA;  /* 實色＝疊起來不透 */
  color:var(--sub); font-size:2rem; }
.tw-stack .tw-top { box-shadow:0 4px 12px rgba(0,0,0,.22); }
@media (max-width:420px) { .tw-stack { --side:92px; height:120px; } .tw-stack .tw-ph { font-size:1.5rem; } }
.tw-welcome h2 { font-size:1.25rem; font-weight:800; }
.tw-welcome p { color:var(--sub); font-size:0.95rem; line-height:1.7; margin-top:-6px; }
.tw-welcome .btn { justify-content:center; text-align:center; }
"""


def _stack_item(t: dict, root: str, index: int) -> str:
    dx, angle, scale = FAN[index]
    style = f'style="transform:translateX(calc(var(--side) * {dx})) rotate({angle}deg) scale({scale})"'
    top = " tw-top" if index == 0 else ""
    if t["cover"]:
        return f'<img class="tw-cv{top}" src="{root}{t["cover"]}" alt="" loading="lazy" {style}>'
    return f'<span class="tw-ph{top}" {style}>{icon("music.note")}</span>'


def cover_stack(root: str) -> str:
    """扇形 5 張；第一筆疊在最上面 → HTML 反過來排（後畫的在上面）。"""
    # 站長 11-12：直接疊好幾張專輯，有封面的在上面，不足的用 App 的「沒封面＝灰底 music.note」補滿
    picks = [t for t in TEMPLATES if t["cover"]][:STACK_SIZE]
    picks = picks + [{"cover": ""}] * (STACK_SIZE - len(picks))
    items = [_stack_item(t, root, i) for i, t in enumerate(picks)]
    return f'<div class="tw-stack" aria-hidden="true">{"".join(reversed(items))}</div>'


def welcome_card(root: str) -> str:
    return (f'<section class="st-band"><div class="sc-in"><div class="tw-welcome" data-reveal>{cover_stack(root)}'
            f'<h2>{esc(WELCOME_TITLE)}</h2><p>{esc(WELCOME_BODY)}</p>'
            f'<a class="btn" href="{root}templates/">{esc(WELCOME_BUTTON)}</a></div></div></section>')
