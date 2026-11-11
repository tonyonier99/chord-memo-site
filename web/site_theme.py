"""全站外殼：色彩 token、共用版面 CSS、頁首、頁尾與 page()。

品牌色取自 App 的 native/ChordMaster/Theme.swift（docs/36 方案 A：純 Apple 系統色）：
互動強調色＝系統 tint systemBlue（App 不另設 AccentColor）、錄音紅＝systemRed、
頁底＝systemGroupedBackground、卡片＝secondarySystemGroupedBackground、
文字＝label／secondaryLabel。下方 CSS 用的是這些系統色的淺色／深色標準值。
"""
from html import escape

from site_apple_style import APPLE_CSS
from site_audio_js import AUDIO_JS, SOUND_CSS, sound_toggle
from site_content import APP_NAME, SITE_URL, TAGLINE
from site_favicon import FAVICON_SIZES, favicon_name

THEME_CSS = """
:root { color-scheme:light;  /* 站長 2026-11-12：網站一律淺色（像 Apple 官網），示範手機照 App 跟系統 */
  --accent:#007AFF; --accent-ink:#0063D1; --accent-soft:rgba(0,122,255,0.12); --on-accent:#FFFFFF;
  --record:#FF3B30; --bg:#F2F2F7; --card:#FFFFFF; --fill:rgba(118,118,128,0.12);
  --ink:#000000; --sub:#5E5E63; --line:rgba(60,60,67,0.18); --shadow:0 12px 30px rgba(0,30,80,0.08);
  --hero:radial-gradient(1100px 520px at 85% 0%, rgba(0,122,255,0.16), rgba(0,122,255,0) 62%); }
* { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; -webkit-text-size-adjust:100%; }
body { background:var(--bg); color:var(--ink); font-family:-apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",
  "Helvetica Neue",Arial,sans-serif; line-height:1.75; overflow-x:hidden; }
img { max-width:100%; display:block; }
a { color:var(--accent-ink); text-decoration:none; }
a:hover { text-decoration:underline; }
a:focus-visible, button:focus-visible { outline:3px solid var(--accent); outline-offset:3px; border-radius:8px; }
.wrap { max-width:1120px; margin:0 auto; padding:0 16px; }
@media (min-width:700px) { .wrap { padding:0 1.25rem; } }
header.site { position:sticky; top:0; z-index:20; background:var(--bg); background:color-mix(in srgb, var(--bg) 88%, transparent);
  -webkit-backdrop-filter:saturate(180%) blur(14px); backdrop-filter:saturate(180%) blur(14px); border-bottom:1px solid var(--line); }
header.site .wrap { display:flex; align-items:center; flex-wrap:wrap; gap:0.4rem 1rem; min-height:60px; padding-top:0.5rem; padding-bottom:0.5rem; }
.logo { display:flex; align-items:center; gap:0.55rem; color:var(--ink); font-weight:800; font-size:1.08rem; }
.logo:hover { text-decoration:none; }
.logo img { width:32px; height:32px; border-radius:8px; }
.site-nav { display:flex; gap:1.3rem; margin-left:auto; }
.site-nav a { color:var(--sub); font-weight:600; font-size:0.95rem; }
.site-nav a.on, .site-nav a:hover { color:var(--ink); text-decoration:none; }
.nav-cta { background:var(--accent); color:var(--on-accent); font-weight:700; font-size:0.9rem; padding:0.42rem 1rem;
  border-radius:999px; white-space:nowrap; }
.nav-cta:hover { text-decoration:none; filter:brightness(1.08); }
@media (max-width:700px) {
  .nav-cta { margin-left:auto; order:1; }
  .site-nav { order:2; width:100%; margin-left:0; gap:1.1rem; }
}
main { min-height:60vh; }
footer.site { margin-top:3rem; border-top:1px solid var(--line); padding:2rem 0 2.6rem; color:var(--sub); font-size:0.9rem; }
footer.site .wrap { display:flex; flex-wrap:wrap; gap:0.8rem 1.4rem; align-items:center; }
footer.site nav { display:flex; flex-wrap:wrap; gap:0.6rem 1.2rem; }
footer.site a { color:var(--sub); }
footer.site .foot-name { font-weight:700; color:var(--ink); margin-right:auto; }
.btn { display:inline-flex; align-items:center; justify-content:center; min-height:50px; padding:0 1.5rem; border-radius:999px;
  background:var(--accent); color:var(--on-accent); font-weight:700; font-size:1.02rem; border:2px solid var(--accent);
  transition:transform .2s, filter .2s; }
.btn:hover { text-decoration:none; transform:translateY(-2px); filter:brightness(1.06); }
.btn:active { transform:scale(0.97); }
.btn.ghost { background:transparent; color:var(--accent-ink); }
.btn.placeholder { background:var(--fill); border-color:var(--line); color:var(--sub); cursor:default; }
.btn.placeholder:hover { transform:none; filter:none; }
.card { background:var(--card); border-radius:16px; border:1px solid var(--line); }
.pending { color:var(--record); font-weight:700; }
"""


def esc(text: str) -> str:
    return escape(text, quote=True)


NAV_ITEMS = [("features", "功能", "features/"), ("templates", "範本", "templates/"), ("creator", "創作者", "creator/"), ("support", "支援", "support/")]
FOOT_ITEMS = [("隱私政策", "privacy/"), ("使用條款", "terms/"), ("支援", "support/")]


def header_html(root: str, section: str) -> str:
    links = "".join(
        f'<a href="{root}{href}" class="{"on" if key == section else ""}">{label}</a>' for key, label, href in NAV_ITEMS
    )
    cta_on = ' aria-current="page"' if section == "download" else ""  # 選單不再另放「下載」，跟右上按鈕重複
    return (f'<header class="site"><div class="wrap"><a class="logo" href="{root}">'
            f'<img src="{root}assets/app-icon.png" alt="" width="32" height="32">{esc(APP_NAME)}</a>'
            f'<nav class="site-nav" aria-label="主選單">{links}</nav>{sound_toggle()}'
            f'<a class="nav-cta" href="{root}download/"{cta_on}>下載 App</a></div></header>')


def footer_html(root: str) -> str:
    links = "".join(f'<a href="{root}{href}">{label}</a>' for label, href in FOOT_ITEMS)
    return (f'<footer class="site"><div class="wrap"><span class="foot-name">{esc(APP_NAME)}</span>'
            f'<nav aria-label="頁尾">{links}</nav></div></footer>')


def icon_links(root: str) -> str:
    """分頁圖示（圓角，site_favicon.py 產）；加到主畫面用正方形那張。"""
    sizes = "".join(f'<link rel="icon" type="image/png" sizes="{n}x{n}" href="{root}assets/{favicon_name(n)}">'
                    for n in FAVICON_SIZES)
    return sizes + f'<link rel="apple-touch-icon" href="{root}assets/apple-touch-icon.png">'


def seo_head(path: str | None) -> str:
    """path：這頁在網站根目錄下的路徑（首頁 ""、其他 "features/"）→ canonical；None＝不收錄（404）。"""
    if path is None:
        return '<meta name="robots" content="noindex">'
    return f'<link rel="canonical" href="{esc(SITE_URL + path)}">'


def page(title: str, description: str, body: str, *, root: str, path: str | None, section: str = "",
         extra_css: str = "", tail: str = "") -> str:
    """root：從這頁回到網站根目錄的前綴（根目錄 ""、子資料夾 "../"、404 用網站絕對路徑）；path 見 seo_head。"""
    full_title = APP_NAME if title == APP_NAME else f"{title}｜{APP_NAME}"
    return (
        '<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>{esc(full_title)}</title><meta name="description" content="{esc(description or TAGLINE)}">'
        f'{seo_head(path)}<meta name="color-scheme" content="light">'
        "<script>document.documentElement.classList.add('js')</script>"
        f'{icon_links(root)}'
        f'<style>{THEME_CSS}{SOUND_CSS}{extra_css}{APPLE_CSS}</style></head>\n<body>\n'
        f'{header_html(root, section)}<main>{body}</main>{footer_html(root)}{AUDIO_JS}{tail}\n</body></html>\n'
    )
