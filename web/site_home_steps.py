"""首頁寫歌四步的展示（站長 2026-11-12 照草稿：不是四支手機，每步用最適合的方式）。

- 01 靈感：四張卡＝App 靈感的四種起點（InspirationView.swift seed_rows：類型＋說明），不放假的靈感內容。
- 02 錄一段：全頁唯一一支手機（錄音分頁），錄音＝there's nothing… 的「試聽片段」。在 site_home.py 組。
- 03 編曲：多軌元件，四軌真的分軌（鼓、貝斯、吉他、其他）同時播，可以關掉某軌或只聽一軌（App 編曲的靜音／S）。
- 04 和弦譜：8 小節和弦譜，點小節出這個和弦的按法並試聽（按法用 App 和弦引擎 CMApp.frets）。
資料都在 site_song.py。
"""
import json

from site_app_data import STRINGS
from site_icons import icon
from site_song import AUDIO_SUBDIR, SONG, STEMS, song_meta
from site_theme import esc

SEED_ICONS = {"聲音": "mic.fill", "文字": "text.quote", "照片": "photo", "塗鴉": "scribble"}


def inspire_cards() -> str:
    cards = "".join(f'<li><span class="hs-ic">{icon(SEED_ICONS[kind])}</span><strong>{esc(kind)}</strong>'
                    f'<span>{esc(sub)}</span></li>' for kind, sub in STRINGS["seed_rows"])
    return f'<ul class="hs-seeds">{cards}</ul>'


def multitrack(root: str) -> str:
    rows = "".join(f'<li data-hs-lane="{i}"><span class="hs-name">{esc(name)}</span>'
                   f'<button type="button" class="hs-mute" aria-pressed="false" aria-label="關掉{esc(name)}">{icon("speaker.wave.2.fill")}</button>'
                   f'<button type="button" class="hs-solo" aria-pressed="false" aria-label="只聽{esc(name)}">S</button>'
                   f'<span class="hs-bar"><i></i></span></li>' for i, (_, name) in enumerate(STEMS))
    urls = json.dumps([f"{root}assets/audio/{AUDIO_SUBDIR}/{stem}.m4a" for stem, _ in STEMS])
    return (f'<div class="hs-mt" data-hs-mt="{esc(urls)}"><div class="hs-mt-top">'
            f'<button type="button" class="hs-mt-play" data-hs-play aria-label="播放">{icon("play.fill")}</button>'
            f'<span data-hs-time>0:00 / 0:30</span></div>'
            f'<ul class="hs-lanes">{rows}</ul><p class="hs-err" data-hs-err hidden>載入失敗，再按一次重試。</p></div>')


def chord_sheet() -> str:
    bars = "".join(f'<button type="button" data-hs-chord="{esc(c)}">{esc(c)}</button>' for c in SONG["bars"])
    song = esc(json.dumps({"key": SONG["key"], "mode": SONG["mode"]}))
    return (f'<div class="hs-sheet" data-hs-sheet="{song}">'
            f'<p class="hs-sheet-m">{esc(song_meta())}</p><div class="hs-bars">{bars}</div>'
            f'<div class="hs-fing" data-hs-fing aria-live="polite"><p>點一個和弦，看按法、聽聲音</p></div></div>')


STEPS_CSS = """
.hs-seeds { list-style:none; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0.8rem; }
.hs-seeds li { background:var(--card); border-radius:22px; padding:1.4rem 1.2rem; display:grid; gap:0.2rem; }
.hs-ic { width:44px; height:44px; border-radius:12px; background:var(--accent-soft); color:var(--accent); display:flex; align-items:center;
  justify-content:center; font-size:1.4rem; margin-bottom:0.5rem; }
.hs-seeds strong { font-size:1.1rem; } .hs-seeds li > span:last-child { color:var(--sub); font-size:0.92rem; }
.hs-mt, .hs-sheet { background:var(--card); border-radius:28px; padding:1.5rem 1.3rem; }
.hs-mt-top { display:flex; align-items:center; gap:0.9rem; }
.hs-mt-top strong { display:block; font-size:1.1rem; } .hs-mt-top span { color:var(--sub); font-size:1rem; font-variant-numeric:tabular-nums; }
.hs-mt-play { width:52px; height:52px; border-radius:50%; border:0; background:var(--accent); color:#fff; font-size:1.3rem; cursor:pointer;
  display:flex; align-items:center; justify-content:center; flex:none; }
.hs-lanes { list-style:none; display:grid; gap:0.5rem; margin-top:1.2rem; }
.hs-lanes li { display:grid; grid-template-columns:3.6rem auto auto 1fr; align-items:center; gap:0.5rem; background:var(--bg);
  border-radius:14px; padding:0.6rem 0.8rem; }
.hs-name { font-weight:600; }
.hs-mute, .hs-solo { width:34px; height:34px; border-radius:50%; border:0; background:var(--fill); color:var(--accent); font-weight:700; cursor:pointer;
  display:flex; align-items:center; justify-content:center; }
.hs-mute[aria-pressed="true"] { color:var(--sub); }
.hs-solo[aria-pressed="true"] { background:#FFCC00; color:#000; }
.hs-bar { height:28px; border-radius:8px; background:var(--accent-soft); position:relative; overflow:hidden; }
.hs-bar i { position:absolute; inset:0 auto 0 0; width:0; background:var(--accent); opacity:.35; }
.hs-lanes li.off .hs-bar { opacity:.35; }
.hs-mt.loading .hs-mt-play { animation:hs-pulse 1.2s ease-in-out infinite; }
@keyframes hs-pulse { 50% { opacity:.45; } }
@media (prefers-reduced-motion:reduce) { .hs-mt.loading .hs-mt-play { animation:none; opacity:.55; } }
.hs-err { color:var(--record); font-size:0.88rem; margin-top:0.6rem; } .hs-err[hidden] { display:none; }
.hs-sheet-t { font-size:1.3rem; font-weight:700; } .hs-sheet-m { color:var(--sub); font-size:0.9rem; font-variant-numeric:tabular-nums; }
.hs-bars { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:0.4rem; margin-top:1rem; }
.hs-bars button { min-height:52px; border:0; border-left:2px solid var(--line); border-radius:0; background:none; text-align:left;
  padding:0 0.7rem; font-family:inherit; font-size:1.2rem; font-weight:700; color:var(--ink); cursor:pointer; }
.hs-bars button:hover, .hs-bars button[aria-pressed="true"] { background:var(--accent-soft); color:var(--accent-ink); border-radius:0 10px 10px 0; }
.hs-fing { margin-top:1rem; min-height:4.6rem; background:var(--bg); border-radius:16px; padding:0.8rem 1rem; }
.hs-fing p { color:var(--sub); font-size:0.9rem; }
.hs-fing ol { list-style:none; display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:0.3rem; text-align:center; margin-top:0.3rem; }
.hs-fing li b { display:block; font-size:0.75rem; color:var(--sub); }
.hs-fing li span { font-weight:700; font-variant-numeric:tabular-nums; }
@media (max-width:420px) { .hs-lanes li { grid-template-columns:3rem auto auto 1fr; padding:0.5rem 0.6rem; } }
"""
