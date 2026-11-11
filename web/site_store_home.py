"""首頁的範本入口：照 App 範本支線「空作品庫大卡」（ArtistTemplateHomeViews.swift ArtistTemplateHomeWelcome）。

- 由上到下：疊放封面（120pt、區高 150）、標題 welcomeTitle、內文 welcomeBody、主要按鈕「看看藝人範本」；卡片圓角 18、內距 20。
- 疊放封面（ArtistTemplateCoverStack）：最多 3 張，第一筆在最上面；角度 −10°、−2°、9°，往右錯開 0、14%、28%；
  只有最上面那張有陰影（0.18／5／3）。封面圓角 10、沒封面＝灰底 music.note。只排版、不畫圖。
- App 卡片外那行「或按右下角的按鈕，寫你的第一首歌」是指 App 裡的按鈕，網站沒有 → 不放。
文案逐字照 ArtistTemplateText.swift；6 首＝FreeTier.demoLimit（跟 site_content.FREE_TIER 同一個數）。
"""
from site_icons import icon
from site_store_data import TEMPLATES
from site_theme import esc

WELCOME_TITLE = "沒想法？先看看合作藝人怎麼寫歌"
WELCOME_BODY = "下載藝人用和弦備忘錄做的歌，從靈感、錄音到編曲一步步拆開看。範本不算進 6 首。"
WELCOME_BUTTON = "看看藝人範本"
ANGLES = [-10, -2, 9]
OFFSETS = [0, 0.14, 0.28]

WELCOME_CSS = """
.tw-welcome { max-width:560px; margin:0 auto; padding:20px; border-radius:18px; background:var(--card); display:grid; gap:12px; }
.tw-stack { --side:120px; position:relative; height:150px; width:calc(var(--side) * 1.28); margin:0 auto; }
.tw-stack > * { position:absolute; left:0; top:15px; width:var(--side); height:var(--side); border-radius:10px; object-fit:cover;
  box-shadow:inset 0 0 0 0.5px var(--line); }
.tw-stack .tw-ph { display:flex; align-items:center; justify-content:center; background:var(--fill); color:var(--sub); font-size:2rem; }
.tw-stack .tw-top { box-shadow:0 3px 5px rgba(0,0,0,.18); }
.tw-welcome h2 { font-size:1.25rem; font-weight:800; }
.tw-welcome p { color:var(--sub); font-size:0.95rem; line-height:1.7; margin-top:-6px; }
.tw-welcome .btn { justify-content:center; text-align:center; }
"""


def _stack_item(t: dict, root: str, index: int) -> str:
    style = f'style="transform:translateX(calc(var(--side) * {OFFSETS[index]})) rotate({ANGLES[index]}deg)"'
    top = " tw-top" if index == 0 else ""
    if t["cover"]:
        return f'<img class="tw-cv{top}" src="{root}{t["cover"]}" alt="" loading="lazy" {style}>'
    return f'<span class="tw-ph{top}" {style}>{icon("music.note")}</span>'


def cover_stack(root: str) -> str:
    """最多 3 張；第一筆疊在最上面 → HTML 反過來排（後畫的在上面）。"""
    items = [_stack_item(t, root, i) for i, t in enumerate(TEMPLATES[:3])]
    return f'<div class="tw-stack" aria-hidden="true">{"".join(reversed(items))}</div>'


def welcome_card(root: str) -> str:
    return (f'<section class="st-band"><div class="sc-in"><div class="tw-welcome" data-reveal>{cover_stack(root)}'
            f'<h2>{esc(WELCOME_TITLE)}</h2><p>{esc(WELCOME_BODY)}</p>'
            f'<a class="btn" href="{root}templates/">{esc(WELCOME_BUTTON)}</a></div></div></section>')
