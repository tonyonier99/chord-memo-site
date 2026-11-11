"""搜尋引擎收錄用檔案（站長 2026-11-11 同意）：sitemap.xml、robots.txt。

網址一律用 site_content.SITE_URL 當根（跟每頁的 canonical 同一套寫法），換網域只改那一個常數。
sitemap 只列正式頁（各資料夾的 index.html），404 不列；robots 允許全站抓取並寫上 sitemap 網址。
"""
from html import escape
from pathlib import Path

from site_content import SITE_URL


def page_url(out: Path, html_file: Path) -> str:
    """site/features/index.html → SITE_URL + "features/"；首頁 → SITE_URL。"""
    folder = html_file.relative_to(out).parent.as_posix()
    return SITE_URL if folder == "." else f"{SITE_URL}{folder}/"


def sitemap_xml(urls: list[str]) -> str:
    rows = "".join(f"  <url><loc>{escape(u)}</loc></url>\n" for u in urls)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + rows + "</urlset>\n")


def robots_txt() -> str:
    return f"User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}sitemap.xml\n"


def write_crawl_files(out: Path, pages: list[Path]) -> list[Path]:
    urls = [page_url(out, p) for p in pages if p.name == "index.html"]
    sitemap, robots = out / "sitemap.xml", out / "robots.txt"
    sitemap.write_text(sitemap_xml(urls), encoding="utf-8")
    robots.write_text(robots_txt(), encoding="utf-8")
    return [sitemap, robots]
