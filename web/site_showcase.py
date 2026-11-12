"""首頁與功能頁共用的樣式（SHOWCASE_CSS）與收尾 CTA（final_cta）；首頁本身由 site_home.py 組裝。"""
from site_content import APP_NAME, TAGLINE
from site_theme import esc

SHOWCASE_CSS = """
.sc-in { max-width:1120px; margin:0 auto; padding:0 16px; }
@media (min-width:700px) { .sc-in { padding:0 1.25rem; } }
.sc-split { display:grid; grid-template-columns:minmax(0,1fr); gap:2.4rem; align-items:center; }
@media (min-width:900px) { .sc-split { grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:3.5rem; }
  .sc-split.flip > :last-child { order:-1; } }
.sc-hero { padding:3.2rem 0 3.6rem; background:var(--hero); }
.sc-hero-icon { width:84px; height:84px; border-radius:20px; box-shadow:var(--shadow); }
.sc-eyebrow { font-size:0.92rem; font-weight:800; color:var(--accent-ink); letter-spacing:0.04em; margin-top:1.1rem; }
.sc-copy h1 { font-size:clamp(2.2rem,5.4vw,3.4rem); line-height:1.2; font-weight:800; margin-top:0.35rem; }
.sc-copy h2 { font-size:clamp(1.6rem,3.6vw,2.3rem); line-height:1.3; font-weight:800; margin-top:0.35rem; }
.sc-lead { color:var(--sub); font-size:1.08rem; line-height:1.9; margin-top:1rem; max-width:34rem; }
.sc-actions { display:flex; flex-wrap:wrap; gap:0.7rem; margin-top:1.6rem; }
.sc-band { padding:4.2rem 0; }
.sc-band.tint { background:var(--card); }
.sc-sec-head { text-align:center; max-width:42rem; margin:0 auto; }
.sc-sec-head h2 { font-size:clamp(1.6rem,3.6vw,2.3rem); font-weight:800; line-height:1.3; }
.sc-sec-head p { color:var(--sub); margin-top:0.6rem; font-size:1.04rem; }
.bento { display:grid; grid-template-columns:minmax(0,1fr); gap:0.9rem; margin-top:2.2rem; }
@media (min-width:700px) { .bento { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:1000px) { .bento { grid-template-columns:repeat(4,minmax(0,1fr)); } } .bento .wide { grid-column:1 / -1; }
.tile { background:var(--card); border:1px solid var(--line); border-radius:22px; padding:1.3rem 1.35rem; display:flex;
  flex-direction:column; gap:0.45rem; color:var(--ink); transition:transform .25s, box-shadow .25s, border-color .25s; }
a.tile:hover { text-decoration:none; transform:translateY(-4px); box-shadow:var(--shadow); border-color:var(--accent); }
.sc-band.tint .tile { background:var(--bg); }
.sc-hero .ph-card { background:transparent; border:0; padding:0.5rem 0 0; }
.tile .t-eyebrow { font-size:0.8rem; font-weight:800; color:var(--accent-ink); letter-spacing:0.05em; }
.tile h3 { font-size:1.12rem; line-height:1.45; }
.tile p { color:var(--sub); font-size:0.94rem; line-height:1.7; }
.tile ul { list-style:none; display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.3rem; }
.tile li { background:var(--accent-soft); color:var(--accent-ink); font-weight:700; font-size:0.86rem; padding:0.25rem 0.7rem; border-radius:999px; }
.tile .t-more { margin-top:auto; padding-top:0.4rem; font-size:0.86rem; font-weight:800; color:var(--accent-ink); }
.sc-promise { max-width:46rem; margin:0 auto 2rem; text-align:center; }
.sc-promise p { font-size:0.85rem; color:var(--sub); line-height:1.7; }
.sc-promise a { font-weight:600; white-space:nowrap; }
.sc-final { text-align:center; background:var(--card); border:1px solid var(--line); border-radius:32px; margin:2.4rem 16px 1rem;
  padding:3.6rem 1.25rem; background-image:var(--hero); }
.sc-final .sc-actions { justify-content:center; }
.sc-final .center { margin-left:auto; margin-right:auto; }
.sc-final img { width:72px; height:72px; border-radius:17px; margin:0 auto 1rem; }
@media (min-width:1152px) { .sc-final { max-width:1120px; margin:2.4rem auto 1rem; } }
"""


def store_actions(root: str) -> str:
    return (f'<div class="sc-actions"><a class="btn" href="{root}download/">下載 App</a>'
            f'<a class="btn ghost" href="{root}features/">看功能</a></div>')


def final_cta(root: str) -> str:
    return (f'<section class="sc-final" data-reveal><img src="{root}assets/app-icon.png" alt="" width="72" height="72">'
            f'<div class="sc-copy"><h2>{esc(APP_NAME)}</h2><p class="sc-lead center">'
            f'{esc(TAGLINE)}</p></div>{store_actions(root)}</section>')
