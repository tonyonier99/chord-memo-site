"""示範手機共用的樣式（BANDS_CSS）與互動程式（app_scripts）；首頁的示範手機用。"""
import json

from site_app_css import APP_CSS
from site_song import audio_urls
from site_audio_play import AUDIO_PLAY_JS
from site_app_js import APP_BASE_JS
from site_app_inspire import INSPIRE_CSS
from site_app_js_chart import APP_CHART_JS
from site_app_js_inspire import APP_INSPIRE_JS
from site_app_js_run import APP_RUN_JS
from site_app_js_tools import APP_TOOLS_JS
from site_app_css_icons import ICON_PANE_CSS
from site_app_css_panes import PANE_CSS
from site_app_tools import TOOLS_CSS
from site_icons import ICON_CSS, icons_js

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
