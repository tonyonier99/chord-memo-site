"""藝人範本頁的範本庫：照 App 範本支線的範本庫（ArtistTemplates/，Apple Music 版面）做網頁版＋示範手機版。

- 清單（ArtistTemplateLibraryView／ShelfView）：大標「藝人範本」、說明一行、精選大卡（封面＋毛玻璃：精選範本、歌名、藝人、
  「合作藝人」徽章）、「更多範本」橫向一排（封面、歌名、藝人、徽章）。網站沒有「查看全部」頁，不放那個連結。
- 詳情（ArtistTemplateDetailView，由上到下）：封面、歌名、藝人、資訊行、試聽 Demo 版＋下載範本、這首用到、發行版、署名、
  「{藝人} 是和弦備忘錄的合作藝人」。網頁用 <dialog> 疊在頁面上；下載範本導到網站的下載頁（App 還沒上架）。
- 文案逐字照 ArtistTemplateText.swift；資料在 site_store_data.py。
"""
import json

from site_app_screens import phone, stage
from site_icons import icon
from site_store_data import TEMPLATES
from site_store_motion import MOTION_CSS, MOTION_JS, disc_header
from site_store_style import BASE_CSS
from site_theme import esc

T = {  # ArtistTemplateText.swift
    "title": "藝人範本", "subtitle": "合作藝人用和弦備忘錄做的歌，下載來看看怎麼做", "featured": "精選範本",
    "more": "更多範本", "badge": "合作藝人", "caption": "用和弦備忘錄做的 demo", "play": "試聽 Demo 版",
    "stop": "停止試聽", "loading": "載入中…", "failed": "試聽載入失敗，再按一次重試。", "features": "這首用到",
    "release": "發行版", "download": "下載範本",
}
NOTE = "範本庫示意・照 App 範本庫的畫面"
STORE_CSS = BASE_CSS + MOTION_CSS


def _length(sec: int) -> str:
    return f"{sec // 60}:{sec % 60:02d}"


def _cover(t: dict, root: str, cls: str) -> str:
    if t["cover"]:
        return f'<img class="{cls}" src="{root}{t["cover"]}" alt="{esc(t["title"])}、{esc(t["artist"])}" loading="lazy">'
    return f'<span class="{cls} ts-ph">{icon("music.note")}</span>'


def _badge() -> str:
    return f'<span class="ts-badge">{T["badge"]}</span>'


def _featured(t: dict, root: str) -> str:
    return (f'<button type="button" class="ts-feat" data-ts-open="{t["id"]}">{_cover(t, root, "ts-cv")}'
            f'<span class="ts-glass"><small>{T["featured"]}</small><strong>{esc(t["title"])}</strong>'
            f'<span>{esc(t["artist"])}</span>{_badge()}</span></button>')


def _card(t: dict, root: str) -> str:
    return (f'<button type="button" class="ts-card" data-ts-open="{t["id"]}">{_cover(t, root, "ts-cv")}'
            f'<strong>{esc(t["title"])}</strong><span>{esc(t["artist"])}</span>{_badge()}</button>')


def _shelf(root: str) -> str:
    first, rest = TEMPLATES[0], TEMPLATES[1:]
    row = "".join(_card(t, root) for t in rest)
    return (f'{_featured(first, root)}<div class="ts-more"><h3>{T["more"]}</h3></div>'
            f'<div class="ts-row" tabindex="0" aria-label="{T["more"]}">{row}</div>')


def store_wall(root: str) -> str:
    """網頁版範本庫（藝人範本頁最上面）。"""
    return (f'<section class="cr-sec ts-wall" id="wall" data-reveal>'
            f'<p class="ts-sub">{T["subtitle"]}</p>{_shelf(root)}</section>')


def store_phone(root: str) -> str:
    """示範手機版：同一份清單，點了一樣開詳情。"""
    inner = (f'<div class="ph-view on" style="position:relative"><div class="ph-scroll ts-app">'
             f'<div class="ts-app-title">{T["title"]}</div><p class="ts-sub">{T["subtitle"]}</p>{_shelf(root)}</div></div>')
    return stage(phone(inner, attrs=" data-store-phone"), note=NOTE)


def _release(t: dict) -> str:
    if not t["links"] and not t["release_note"]:
        return ""
    rows = "".join(f'<a class="ts-link" href="{esc(u)}" target="_blank" rel="noopener">{esc(n)}{icon("arrow.up.right")}</a>'
                   for n, u in t["links"])
    note = f'<p class="ts-fine">{esc(t["release_note"])}</p>' if t["release_note"] else ""
    return f'<div class="ts-blk"><h4>{T["release"]}</h4>{rows}{note}</div>'


def _detail(t: dict, root: str) -> str:
    tags = "".join(f"<span>{esc(f)}</span>" for f in t["features"])
    info = "・".join([T["badge"], T["caption"], _length(t["seconds"])])
    src = f' data-src="{root}{t["preview"]}"' if t["preview"] else " disabled"
    cover = disc_header(_cover(t, root, "ts-big"), root + t["cover"]) if t["cover"] else _cover(t, root, "ts-big")
    return (f'<article class="ts-detail" data-ts-detail="{t["id"]}" hidden>{cover}'
            f'<h3>{esc(t["title"])}</h3><p class="ts-artist">{esc(t["artist"])}</p><p class="ts-fine">{info}</p>'
            f'<div class="ts-btns"><button type="button" class="ts-play" data-ts-play{src}>'
            f'<span data-ts-ic>{icon("play.fill")}</span><span data-ts-label>{T["play"]}</span></button>'
            f'<a class="ts-dl" href="{root}download/">{icon("arrow.down.to.line")}{T["download"]}</a></div>'
            f'<p class="ts-err" data-ts-err hidden>{T["failed"]}</p>'
            f'<div class="ts-blk"><h4>{T["features"]}</h4><div class="ts-tags">{tags}</div></div>{_release(t)}'
            f'<p class="ts-fine">{esc(t["credits"])}</p>'
            f'<p class="ts-fine ts-dim">{esc(t["artist"])} 是和弦備忘錄的合作藝人</p></article>')


def store_dialog(root: str) -> str:
    details = "".join(_detail(t, root) for t in TEMPLATES)
    return (f'<dialog class="ts-dlg" data-ts-dlg aria-label="{T["title"]}">'
            f'<div class="ts-top"><span class="ts-toptitle" data-ts-toptitle aria-hidden="true"></span>'
            f'<button type="button" class="ts-close" data-ts-close aria-label="關閉">{icon("chevron.down")}</button></div>'
            f'{details}</dialog>')


def store_js() -> str:
    labels = {"play": T["play"], "stop": T["stop"], "loading": T["loading"]}
    ics = {"play": icon("play.fill"), "stop": icon("stop.fill")}
    return ("<script>(function () {\n  var L = " + json.dumps(labels, ensure_ascii=False) + ", IC = " + json.dumps(ics) + ";\n"
            + STORE_JS_BODY + MOTION_JS + "})();</script>")


STORE_JS_BODY = r"""
  var dlg = document.querySelector('[data-ts-dlg]'), S = window.CMAudio; if (!dlg) return;
  var cur = null, token = 0;
  function paint(btn, state) {
    btn.querySelector('[data-ts-ic]').innerHTML = state === 'play' ? IC.play : IC.stop;
    btn.querySelector('[data-ts-label]').textContent = L[state]; btn.setAttribute('aria-pressed', state === 'play' ? 'false' : 'true');
    disc(btn, state);
  }
  function stop() {
    token++; if (!cur) return;
    if (cur.src) { try { cur.src.stop(); } catch (e) { cur.src = null; } }
    paint(cur.btn, 'play'); cur = null;
  }
  function play(btn) {
    var err = btn.closest('[data-ts-detail]').querySelector('[data-ts-err]'), mine = ++token;
    err.hidden = true; paint(btn, 'loading'); cur = { btn: btn, src: null };
    S.load(btn.dataset.src).then(function (buf) {
      if (mine !== token) return;
      if (!S.live()) { stop(); return; }
      var src = S.play(buf, 0); cur = { btn: btn, src: src }; paint(btn, 'stop');
      src.addEventListener('ended', function () { if (cur && cur.src === src) { cur = null; paint(btn, 'play'); } });
    }).catch(function () { if (mine === token) { stop(); err.hidden = false; } });
  }
  dlg.querySelectorAll('[data-ts-play]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (cur && cur.btn === btn) { stop(); return; }
      if (!S || !S.allowed()) return;
      stop(); play(btn);
    });
  });
  function open(id) {
    dlg.querySelectorAll('[data-ts-detail]').forEach(function (d) { d.hidden = d.dataset.tsDetail !== id; });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.scrollTop = 0;
    var d = dlg.querySelector('[data-ts-detail="' + id + '"]');
    topTitle.textContent = d.querySelector('h3').textContent; topTitle.classList.remove('on');
  }
  document.querySelectorAll('[data-ts-open]').forEach(function (b) { b.addEventListener('click', function () { open(b.dataset.tsOpen); }); });
  dlg.querySelector('[data-ts-close]').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', stop);
  document.addEventListener('cmsound', function (e) { if (!e.detail.on) stop(); });
"""
