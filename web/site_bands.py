"""功能區塊（左字右手機、交錯排列）＋每塊配一支示範手機；首頁與功能頁共用。

示範手機一律用 App 內建示範歌「夜車」（示範歌曲/）：靈感、錄音、和弦、分享用免費版示範，編曲用付費版示範（五軌完整編曲）。
"""
import json

from site_app_css import APP_CSS
from site_audio import audio_urls
from site_audio_play import AUDIO_PLAY_JS
from site_app_data import demo_songs
from site_app_js import APP_BASE_JS
from site_app_inspire import INSPIRE_CSS
from site_app_js_chart import APP_CHART_JS
from site_app_js_inspire import APP_INSPIRE_JS
from site_app_js_run import APP_RUN_JS
from site_app_js_tools import APP_TOOLS_JS
from site_app_css_icons import ICON_PANE_CSS
from site_app_css_panes import PANE_CSS
from site_app_screens import pane_phone, stage, tour_phone
from site_app_tools import TOOLS_CSS, metronome_phone, tuner_phone
from site_icons import ICON_CSS, icons_js
from site_theme import esc

BANDS_CSS = ICON_CSS + APP_CSS + PANE_CSS + ICON_PANE_CSS + INSPIRE_CSS + TOOLS_CSS + """
.points { list-style:none; margin-top:1.2rem; display:grid; gap:0.6rem; }
.points li { padding-left:1.5rem; position:relative; font-size:1.02rem; line-height:1.7; }
.points li::before { content:""; position:absolute; left:0.1rem; top:0.58em; width:0.62rem; height:0.62rem; border-radius:50%;
  background:var(--accent-soft); box-shadow:inset 0 0 0 3px var(--accent); }
section[id] { scroll-margin-top:84px; }
"""


def app_scripts(root: str) -> str:
    """App 和弦引擎（engine.js）先載入，再放互動程式；只放在有示範手機的頁面。"""
    files = json.dumps(audio_urls(), ensure_ascii=False)
    return (f'<script src="{root}assets/chord-engine.js"></script>'
            f'<script>window.CMAudioBase = "{root}assets/audio/"; window.CMAudioFiles = {files};</script>'
            + icons_js() + APP_BASE_JS + AUDIO_PLAY_JS + APP_INSPIRE_JS + APP_CHART_JS + APP_TOOLS_JS + APP_RUN_JS)


def demo_phone(kind: str, songs: dict) -> str:
    free, pro = songs["free"], songs["pro"]
    if kind == "tuner":
        return tuner_phone()
    if kind == "metronome":
        return metronome_phone(free["bpm"])
    panes = {"inspiration": (free, "靈感"), "record": (free, "錄音"), "arrange": (pro, "編曲"),
             "chart": (free, "和弦"), "export": (free, "和弦")}
    song, pane = panes[kind]
    return pane_phone(song, pane, kind, song["name"], pro=kind == "arrange")


def band(item: dict, phone_html: str, index: int) -> str:
    pts = "".join(f"<li>{esc(p)}</li>" for p in item["points"])
    lead = f'<p class="sc-lead">{esc(item["lead"])}</p>' if item["lead"] else ""
    flip = " flip" if index % 2 else ""
    tint = " tint" if index % 2 else ""
    return (f'<section class="sc-band{tint}" id="{item["anchor"]}"><div class="sc-in sc-split{flip}">'
            f'<div class="sc-copy" data-reveal><p class="sc-eyebrow">{esc(item["eyebrow"])}</p><h2>{esc(item["title"])}</h2>'
            f'{lead}<ul class="points">{pts}</ul></div><div>{stage(phone_html)}</div></div></section>')


def bands(items: list[dict], start: int = 0) -> str:
    songs = demo_songs()
    return "".join(band(item, demo_phone(item["demo"], songs), start + i) for i, item in enumerate(items))


def tour_stage() -> str:
    return stage(tour_phone(demo_songs()["free"]))
