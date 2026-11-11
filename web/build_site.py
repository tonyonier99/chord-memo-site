#!/usr/bin/env python3
"""和弦備忘錄官網：離線預覽產生器（架構仿初級大人手冊 web版/build_site_v2.py 的精簡版）。

用法：python3 build_site.py → web/site/（整個資料夾每次重建；不載 GA 或任何追蹤）
預覽：python3 preview_server.py site 8797（同一個 Wi-Fi 的手機也要看：加 0.0.0.0）

拆檔：
- site_content.py  文案與素材清單（每段註明出處）
- site_theme.py    色彩 token、頁首頁尾、page()
- site_motion.py   淡入、跑馬燈
- site_home.py     首頁（照寫歌順序、深色工作室；樣式與首屏和弦在 site_home_style.py）
- site_showcase.py 首頁沿用的區塊（bento、收尾、下載按鈕）
- site_bands.py    功能區塊＋示範手機（首頁、功能頁共用）
- site_app_*.py    網頁重畫的 App 畫面：資料（data）、樣式（css）、畫面（screens、tools）、互動（js、js_chart、js_tools、js_run）
- site_pages.py    功能頁、下載頁、404
- site_templates.py 藝人範本頁（假範本庫示意，導到創作者頁）
- site_creator*.py 申請成為創作者頁（概要＋申請表；假範本庫手機元件在 site_creator_phone.py）
- site_audio*.py   聲音：示範歌錄音取出（audio）、全站 CMAudio＋喇叭開關（audio_js）、和弦譜播放與編曲混音（audio_play）
- site_legal.py    隱私政策、使用條款、支援（讀 chord-memo-site 現有 .md，內文不改）
- site_favicon.py  分頁圖示：App icon 裁圓角（favicon-32/48/180）＋ apple-touch-icon
- site_seo.py      搜尋引擎收錄：sitemap.xml、robots.txt（canonical／noindex 在 site_theme.seo_head）

網址沿用現有 Jekyll 站的 /privacy/、/terms/、/support/（App 的 Info.plist 指向這些網址），
其餘頁同樣用「資料夾/index.html」。404 頁可能出現在任何路徑，所以連結用網站絕對路徑 SITE_BASE。
"""
import shutil
import sys
from pathlib import Path

from site_app_data import engine_path
from site_audio import export_demo_audio
from site_bands import BANDS_CSS, app_scripts
from site_creator import CREATOR_CSS, CREATOR_JS, creator_body
from site_store import store_js
from site_store_home import WELCOME_CSS
from site_templates import TEMPLATES_CSS, templates_body
from site_content import APP_ICON, APP_NAME, CHORD_APP_DIR, INTRO, PRO_NAME, SITE_BASE, TAGLINE
from site_legal import LEGAL_CSS, legal_body, read_markdown
from site_motion import MOTION_CSS, MOTION_JS
from site_pages import PAGES_CSS, download_body, features_body, not_found_body
from site_home import home_body
from site_home_style import HOME_CSS, HOME_JS
from site_favicon import write_favicons
from site_seo import write_crawl_files
from site_showcase import SHOWCASE_CSS
from site_theme import page

WEB = Path(__file__).resolve().parent
REPO = WEB.parent
OUT = WEB / "site"
LEGAL_PAGES = [("privacy", "privacy.md"), ("terms", "terms.md"), ("support", "support.md")]
COMMON_CSS = MOTION_CSS + SHOWCASE_CSS


def write(rel: str, html: str) -> Path:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")
    return path


def build_home() -> Path:
    html = page(APP_NAME, INTRO, home_body(), root="", path="", section="home", extra_css=COMMON_CSS + BANDS_CSS + HOME_CSS + WELCOME_CSS,
                tail=MOTION_JS + app_scripts("") + HOME_JS)
    return write("index.html", html)


def build_features() -> Path:
    html = page("功能", f"{TAGLINE}：靈感、錄音、編曲、和弦與 {PRO_NAME}。", features_body("../"), root="../", path="features/",
                section="features", extra_css=COMMON_CSS + PAGES_CSS + BANDS_CSS, tail=MOTION_JS + app_scripts("../"))
    return write("features/index.html", html)


def build_download() -> Path:
    html = page("下載", TAGLINE, download_body("../"), root="../", path="download/", section="download",
                extra_css=COMMON_CSS + PAGES_CSS, tail=MOTION_JS)
    return write("download/index.html", html)


def build_creator() -> Path:
    html = page("申請成為創作者", "和弦備忘錄音樂人推薦計畫：專屬折扣碼、分潤與藝人範本。", creator_body("../"), root="../", path="creator/",
                section="creator", extra_css=COMMON_CSS + PAGES_CSS + BANDS_CSS + CREATOR_CSS, tail=MOTION_JS + CREATOR_JS("../"))
    return write("creator/index.html", html)


def build_templates() -> Path:
    html = page("藝人範本", "合作藝人用和弦備忘錄做的歌，免費下載當範本。", templates_body("../"), root="../", path="templates/",
                section="templates", extra_css=COMMON_CSS + PAGES_CSS + BANDS_CSS + CREATOR_CSS + TEMPLATES_CSS,
                tail=MOTION_JS + store_js())
    return write("templates/index.html", html)


def build_legal(slug: str, filename: str) -> Path:
    meta, body = read_markdown(REPO / filename)
    html = page(meta.get("title", slug), TAGLINE, legal_body(meta, body), root="../", path=f"{slug}/", section=slug,
                extra_css=COMMON_CSS + LEGAL_CSS)
    return write(f"{slug}/index.html", html)


def build_404() -> Path:
    html = page("找不到這一頁", TAGLINE, not_found_body(SITE_BASE), root=SITE_BASE, path=None,
                extra_css=COMMON_CSS + PAGES_CSS)
    return write("404.html", html)


def copy_assets() -> list[Path]:
    """從 App 專案（只讀）複製 App 圖示與 App 內建和弦引擎；缺檔直接停下，不產生缺圖、缺資料的頁面。"""
    icon = CHORD_APP_DIR / APP_ICON[0]
    if not icon.is_file():
        raise FileNotFoundError(f"找不到 App 圖示（可用環境變數 CHORD_APP_DIR 指定 App 專案）：{icon}")
    targets = [(icon, OUT / "assets" / APP_ICON[1]), (engine_path(), OUT / "assets" / "chord-engine.js"),
               (WEB / "assets" / "icons" / "LICENSE", OUT / "assets" / "icons" / "LICENSE")]  # Phosphor Icons MIT 授權（圖示已內嵌）
    store = sorted((WEB / "assets" / "templates").glob("*.*"))  # 範本庫：站長範本的封面與試聽（site_store_data.py）
    targets += [(f, OUT / "assets" / "templates" / f.name) for f in store]
    verify = sorted((WEB / "assets" / "verify").glob("*.html"))  # Google Search Console 驗證檔：放網站根、不可移除
    targets += [(f, OUT / f.name) for f in verify]
    for src, target in targets:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, target)
    return [target for _, target in targets] + write_favicons(icon, OUT / "assets") + export_demo_audio(OUT)


def main() -> int:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    try:
        assets = copy_assets()
        pages = [build_home(), build_features(), build_templates(), build_creator(), build_download(),
                 *[build_legal(slug, name) for slug, name in LEGAL_PAGES]]
        crawl = write_crawl_files(OUT, pages)  # sitemap 只列正式頁，不含 404
        pages.append(build_404())
    except (FileNotFoundError, ValueError) as error:
        sys.stderr.write(f"產生失敗：{error}\n")
        return 1
    sys.stdout.write(f"和弦備忘錄官網預覽：{len(pages)} 頁、{len(assets)} 個素材 → {OUT}\n")
    for path in [*pages, *crawl, *assets]:
        sys.stdout.write(f"  {path.relative_to(OUT)}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
