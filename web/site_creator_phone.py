"""創作者頁的示範手機：「假範本庫」（站長 2026-11-11 同意先做示意；App 尚未開發，畫面標明示意）。

- 清單照 docs/52 §7.2：方形封面、歌名、藝人名、小標「合作藝人」。第一首放站長自己的範本「夜車」（站長 2026-11-11：「先放我的範本」；藝人名未給→【待站長確認】）；
  其餘三格是還沒有的合作藝人範本，歌名、藝人名用括號留空、灰掉。
- 詳情照 §7.3 由上而下：封面、歌名、試聽 Demo 版（「用和弦備忘錄做的 demo」）、「這首用到」、
  下載鈕「下載範本（約 13 MB，免費，不算進 6 首）」（示意，不能按）。夜車不是合作藝人的歌，所以不放「○○ 是合作藝人」那行。
- 試聽播「夜車（完整編曲）」五軌同時。
"""
import json

from site_song import audio_urls
from site_content import CONFIRM
from site_app_screens import phone, stage
from site_icons import icon
from site_theme import esc

TABS = ["靈感", "錄音", "編曲", "和弦"]  # WorkspaceChrome.swift 四個分頁（docs/52 §5：範本要全功能用上）
MY_SONG = "夜車"
MY_ARTIST = CONFIRM  # 站長的藝人名，還沒給
NOTE = "範本庫示意（App 尚未推出）・「夜車」可以點開試聽"

CREATOR_PHONE_CSS = """
.tp-body { padding:4px 14px 14px; display:grid; gap:10px; }
.tp-nav { display:flex; align-items:center; gap:6px; padding:2px 12px 6px; font-weight:700; font-size:15px; }
.tp-nav .ic { color:var(--a-accent); font-size:18px; }
.tp-cover { width:118px; height:118px; margin:0 auto; border-radius:16px; background:var(--a-card); display:flex; align-items:center; justify-content:center;
  font-size:44px; color:var(--a-sub); }
.tp-title strong { display:block; font-size:17px; } .tp-title span { font-size:13px; color:var(--a-sub); }
.tp-play { display:flex; align-items:center; gap:10px; width:100%; border:0; padding:10px; border-radius:12px; background:var(--a-card);
  color:var(--a-label); text-align:left; cursor:pointer; }
.tp-play .ic { font-size:30px; color:var(--a-accent); } .tp-play b { display:block; font-size:13.5px; }
.tp-play small { font-size:11px; color:var(--a-sub); } .tp-play em { margin-left:auto; font-style:normal; font-size:12px; color:var(--a-sub); }
.tp-tags { display:flex; flex-wrap:wrap; gap:6px; } .tp-tags span { font-size:11.5px; padding:3px 9px; border-radius:999px; background:var(--a-fill); color:var(--a-sub); }
.tp-dl { border:0; border-radius:12px; background:var(--a-accent); color:#fff; font-weight:700; font-size:13.5px; padding:11px 8px; }
.tp-foot { font-size:11px; color:var(--a-sub); text-align:center; }
.tp-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.tp-cell { width:100%; align-content:start; display:grid; gap:2px; border:0; background:none; padding:0; text-align:left; color:var(--a-label); cursor:pointer; font:inherit; }
.tp-cell.dim { opacity:.45; cursor:default; }
.tp-thumb { aspect-ratio:1; border-radius:12px; background:var(--a-card); display:flex; align-items:center; justify-content:center; font-size:30px; color:var(--a-sub); margin-bottom:4px; }
.tp-cell strong { font-size:13px; } .tp-cell span:not(.tp-thumb) { font-size:11px; color:var(--a-sub); } .tp-cell .a-pill { justify-self:start; margin-top:2px; }
.tp-back { border:0; background:none; color:var(--a-label); cursor:pointer; font:inherit; font-weight:700; font-size:15px; }
"""


def _grid_cell(title: str, artist: str, live: bool) -> str:
    tag, attrs = ("button", ' type="button" data-tp-open') if live else ("div", ' aria-disabled="true"')
    pill = "" if live else '<em class="a-pill">合作藝人</em>'
    return (f'<{tag} class="tp-cell{"" if live else " dim"}"{attrs}><span class="tp-thumb">{icon("waveform")}</span>'
            f'<strong>{esc(title)}</strong><span>{esc(artist)}</span>{pill}</{tag}>')


def template_phone() -> str:
    """範本庫清單（§7.2）→ 點「夜車」進詳情頁（§7.3）。其餘三格是還沒有的合作藝人範本，灰掉不能點。"""
    tags = "".join(f"<span>{esc(t)}</span>" for t in TABS)
    cells = _grid_cell(MY_SONG, MY_ARTIST, True) + "".join(_grid_cell("（歌名）", "（藝人名）", False) for _ in range(3))
    grid = (f'<div data-tp-list><div class="tp-nav">藝人範本</div><div class="tp-body"><div class="tp-grid">{cells}</div></div></div>')
    detail = ('<div data-tp-detail hidden>'
              f'<button type="button" class="tp-nav tp-back" data-tp-back>{icon("chevron.left")}藝人範本</button><div class="tp-body">'
              f'<div class="tp-cover">{icon("waveform")}</div>'
              f'<div class="tp-title"><strong>{esc(MY_SONG)}</strong><span>{esc(MY_ARTIST)}</span></div>'
              f'<button type="button" class="tp-play" data-tp-play><span data-tp-ic>{icon("play.circle.fill")}</span>'
              '<span><b>試聽 Demo 版</b><small>用和弦備忘錄做的 demo</small></span><em data-tp-time>0:00</em></button>'
              f'<div><div class="a-sec">這首用到</div><div class="tp-tags">{tags}</div></div>'
              '<button type="button" class="tp-dl" disabled>下載範本（約 13 MB，免費，不算進 6 首）</button></div></div>')
    inner = f'<div class="ph-view on" style="position:relative"><div class="ph-scroll">{grid}{detail}</div></div>'
    return stage(phone(inner, attrs=' data-template'), note=NOTE)


def creator_phone_js(root: str) -> str:
    files = json.dumps(audio_urls(), ensure_ascii=False)
    play_ic = json.dumps(icon("play.circle.fill"))
    stop_ic = json.dumps(icon("stop.circle.fill"))
    return (f'<script>window.CMAudioBase = "{root}assets/audio/"; window.CMAudioFiles = {files};</script>' + """<script>
(function () {
  // 頁面上每個 [data-tp-play]（示範手機、範本牆）共用一套：同時只播一個
  var S = window.CMAudio; if (!S) return;
  var cur = null;
  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function player(btn) {
    var ic = btn.querySelector('[data-tp-ic]'), time = btn.querySelector('[data-tp-time]'), srcs = [], timer = null, t0 = 0, token = 0, me = {};
    me.stop = function () {
      token++; srcs.forEach(function (s) { try { s.stop(); } catch (e) { return; } }); srcs = [];
      clearInterval(timer); timer = null; ic.innerHTML = """ + play_ic + """; btn.setAttribute('aria-pressed', 'false'); if (cur === me) cur = null;
    };
    me.reset = function () { me.stop(); time.textContent = '0:00'; };
    btn.addEventListener('click', function () {
      if (cur === me) { me.stop(); return; }
      if (!S.allowed()) return;
      if (cur) cur.stop();
      cur = me; var mine = ++token, files = (window.CMAudioFiles || {}).lanes || [];
      ic.innerHTML = """ + stop_ic + """; btn.setAttribute('aria-pressed', 'true');
      Promise.all(files.map(function (f) { return S.load(S.url(f)); })).then(function (bufs) {
        if (mine !== token) return;
        if (!S.live()) { me.stop(); return; }
        srcs = bufs.map(function (b) { return S.play(b, 0); }); t0 = Date.now();
        var dur = Math.max.apply(null, bufs.map(function (b) { return b.duration; }));
        timer = setInterval(function () { var s = (Date.now() - t0) / 1000; time.textContent = fmt(s); if (s >= dur) me.stop(); }, 250);
      }).catch(function () { me.stop(); time.textContent = '載入失敗'; });
    });
    return me;
  }
  var players = Array.prototype.map.call(document.querySelectorAll('[data-tp-play]'), player);
  document.addEventListener('cmsound', function (e) { if (!e.detail.on && cur) cur.stop(); });
  var ph = document.querySelector('[data-template]'); if (!ph) return;
  var list = ph.querySelector('[data-tp-list]'), detail = ph.querySelector('[data-tp-detail]');
  var phonePlay = players.filter(function (p, i) { return ph.contains(document.querySelectorAll('[data-tp-play]')[i]); })[0];
  ph.querySelector('[data-tp-open]').addEventListener('click', function () { list.hidden = true; detail.hidden = false; });
  ph.querySelector('[data-tp-back]').addEventListener('click', function () { if (phonePlay) phonePlay.reset(); detail.hidden = true; list.hidden = false; });
})();
</script>""")


CREATOR_PHONE_JS = creator_phone_js
