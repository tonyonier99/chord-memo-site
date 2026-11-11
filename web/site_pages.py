"""功能頁、下載頁、404（版型照初級大人手冊 site_v2_pages.py：交錯的圖文色帶、下載選項卡）。"""
from site_content import (
    APP_NAME, APP_STORE_URL, CONTACT_EMAIL, EXTRAS, FEATURES, FREE_TIER,
    PRO_NAME, PRO_PLANS, PRO_PRICES, REQUIREMENT, STORE_PLACEHOLDER, TAGLINE, TOOL_BANDS,
)
from site_bands import bands
from site_compare import COMPARE_CSS, compare_table
from site_showcase import extra_tile
from site_theme import esc

PAGES_CSS = COMPARE_CSS + """
.pg-head { padding:3rem 0 1.4rem; text-align:center; background:var(--hero); }
.pg-head h1 { font-size:clamp(1.9rem,4.4vw,2.7rem); font-weight:800; line-height:1.3; }
.pg-head p { color:var(--sub); margin:0.6rem auto 0; max-width:38rem; font-size:1.05rem; }
.jump { display:flex; flex-wrap:wrap; justify-content:center; gap:0.45rem; margin-top:1.3rem; }
.jump a { background:var(--card); border:1px solid var(--line); border-radius:999px; padding:0.35rem 1rem; font-weight:700;
  font-size:0.9rem; color:var(--ink); min-height:40px; display:inline-flex; align-items:center; }
.jump a:hover { text-decoration:none; border-color:var(--accent); }
.points { list-style:none; margin-top:1.2rem; display:grid; gap:0.6rem; }
.points li { padding-left:1.5rem; position:relative; font-size:1.02rem; line-height:1.7; }
.points li::before { content:""; position:absolute; left:0.1rem; top:0.58em; width:0.62rem; height:0.62rem; border-radius:50%;
  background:var(--accent-soft); box-shadow:inset 0 0 0 3px var(--accent); }
section[id] { scroll-margin-top:84px; }
.pro-box { max-width:880px; margin:2rem auto 0; padding:1.6rem 1.5rem; }
.pro-box h3 { font-size:1.05rem; margin-top:1.2rem; }
.pro-box h3:first-child { margin-top:0; }
.pro-box p, .pro-box dd { color:var(--sub); }
.pro-box dl { display:grid; gap:0.8rem; margin-top:0.6rem; }
.pro-box dt { font-weight:700; }
.price-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:0.7rem; margin-top:0.8rem; }
.price-row div { background:var(--bg); border:1px solid var(--line); border-radius:14px; padding:0.8rem 0.9rem; }
.price-row b { display:block; font-size:0.9rem; } .price-row strong { display:block; font-size:1.35rem; margin-top:0.2rem; }
.price-row small { color:var(--sub); font-size:0.82rem; }
.dl-card { max-width:680px; margin:2rem auto 0; padding:2rem 1.5rem; text-align:center; }
.dl-card img { width:112px; height:112px; border-radius:26px; margin:0 auto 1rem; box-shadow:var(--shadow); }
.dl-card h2 { font-size:1.5rem; }
.dl-card .sc-actions { justify-content:center; }
.dl-meta { margin-top:1.4rem; display:grid; gap:0.35rem; color:var(--sub); font-size:0.94rem; text-wrap:balance; }
.nf { text-align:center; padding:5rem 16px 3rem; }
.nf h1 { font-size:clamp(1.8rem,4vw,2.4rem); }
.nf p { color:var(--sub); margin-top:0.6rem; }
.nf .sc-actions { justify-content:center; }
"""


def extras_band() -> str:
    tiles = "".join(extra_tile(t, d) for t, d, _ in EXTRAS)
    return (f'<section class="sc-band" id="more"><div class="sc-in"><div class="sc-sec-head" data-reveal><h2>還有這些</h2></div>'
            f'<div class="bento">{tiles}</div></div></section>')


def price_line() -> str:
    """下載頁一行版：月訂 NT$90・年訂 NT$990・永久版 NT$1,990。"""
    return "・".join(f"{name.removeprefix(PRO_NAME).strip()} {price}" for name, price, _ in PRO_PRICES)


def price_row() -> str:
    cells = "".join(f"<div><b>{esc(n)}</b><strong>{esc(p)}</strong><small>{esc(note)}</small></div>" for n, p, note in PRO_PRICES)
    return f'<div class="price-row">{cells}</div>'


def pro_band() -> str:
    return (f'<section class="sc-band tint" id="pro"><div class="sc-in"><div class="sc-sec-head" data-reveal>'
            f'<h2>{esc(PRO_NAME)}</h2><p>{esc(PRO_PLANS)}</p></div>'
            f'<div class="card pro-box" data-reveal><h3>免費版</h3><p>{esc(FREE_TIER)}</p>'
            f'<h3>免費版與 Pro 對照</h3>{compare_table(PRO_NAME)}'
            f'<h3>價格</h3>{price_row()}</div></div></section>')


def features_body(root: str) -> str:
    jump = "".join(f'<a href="#{f["anchor"]}">{esc(f["eyebrow"])}</a>' for f in FEATURES)
    jump += "".join(f'<a href="#{t["anchor"]}">{esc(t["title"])}</a>' for t in TOOL_BANDS)
    head = (f'<section class="pg-head"><div class="sc-in"><h1>功能</h1><p>{esc(TAGLINE)}</p>'
            f'<nav class="jump" aria-label="跳到功能">{jump}<a href="#more">還有這些</a><a href="#pro">{esc(PRO_NAME)}</a></nav>'
            '</div></section>')
    demos = bands(FEATURES) + bands(TOOL_BANDS, start=len(FEATURES))
    return head + demos + extras_band() + pro_band()


def store_button() -> str:
    if APP_STORE_URL:
        return f'<a class="btn" href="{esc(APP_STORE_URL)}" rel="noopener">在 App Store 下載</a>'
    return f'<span class="btn placeholder" aria-disabled="true">{esc(STORE_PLACEHOLDER)}</span>'


def download_body(root: str) -> str:
    return (
        f'<section class="pg-head"><div class="sc-in"><h1>下載 {esc(APP_NAME)}</h1><p>{esc(TAGLINE)}</p></div></section>'
        f'<div class="sc-in"><div class="card dl-card" data-reveal>'
        f'<img src="{root}assets/app-icon.png" alt="{esc(APP_NAME)} App 圖示" width="112" height="112">'
        f'<h2>{esc(APP_NAME)}</h2><div class="sc-actions">{store_button()}</div>'
        f'<div class="dl-meta"><span>支援裝置：{esc(REQUIREMENT)}</span>'
        f'<span>{esc(PRO_PLANS)}</span>'
        f'<span>{esc(price_line())}</span>'
        f'<span><a href="{root}support/">有問題或建議，歡迎聯絡我們。</a>'
        f' <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a></span>'
        '</div></div></div>'
    )


def not_found_body(root: str) -> str:
    return ('<section class="nf"><h1>找不到這一頁</h1>'
            f'<div class="sc-actions"><a class="btn" href="{root}">回首頁</a>'
            f'<a class="btn ghost" href="{root}support/">支援</a></div></section>')
