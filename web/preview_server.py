#!/usr/bin/env python3
"""本機預覽用的靜態伺服器（複製自初級大人手冊 web版/preview_server.py，加上 SITE_BASE 前綴處理）：補上正式站有、但 python -m http.server 沒有的
「無副檔名網址自動補 .html」（clean URL），例如 /a/traffic-6 → a/traffic-6.html、
/group-buy/<id> → group-buy/<id>.html。

正式站（GitHub Pages）本來就會做這個路徑解析，python -m http.server 不會，
用裸的 http.server 預覽時，只要點任何一個站內連結幾乎都會 404。

和弦備忘錄：正式站在 GitHub Pages 的 /chord-memo-site/ 底下，404 頁的連結用這個絕對路徑；
本機預覽把這個前綴拿掉再找檔案，404 頁的連結才點得通。

用法：python3 preview_server.py site 8797
      同一個 Wi-Fi 的手機也要看：python3 preview_server.py site 8797 0.0.0.0

用絕對路徑指定資料夾、不 chdir：產生器重建時會整個刪掉再建資料夾，
chdir 進去的伺服器會卡在已刪除的目錄，之後每個請求都失敗。
"""
import functools
import http.server
import os
import sys


SITE_PREFIX = "/chord-memo-site"


class PrettyURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if path == SITE_PREFIX or path.startswith(SITE_PREFIX + "/"):
            path = path[len(SITE_PREFIX):] or "/"
        translated = super().translate_path(path)
        if os.path.exists(translated) or os.path.splitext(translated)[1]:
            return translated
        with_html = translated + ".html"
        if os.path.isfile(with_html):
            return with_html
        return translated

    def send_error(self, code, message=None, explain=None):
        """找不到的網址回站內 404.html（跟 GitHub Pages 一樣），沒有這個檔才用預設錯誤頁。"""
        page = os.path.join(self.directory, "404.html")
        if code != 404 or not os.path.isfile(page):
            return super().send_error(code, message, explain)
        with open(page, "rb") as handle:
            body = handle.read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)


if __name__ == "__main__":
    directory = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8797
    bind = sys.argv[3] if len(sys.argv) > 3 else "127.0.0.1"
    handler = functools.partial(PrettyURLHandler, directory=directory)
    http.server.test(HandlerClass=handler, port=port, bind=bind)
