"""試聽播放的樣式與程式（CREATOR_PHONE_CSS、CREATOR_PHONE_JS）：頁面上每個 [data-tp-play] 共用一套、同時只播一個。

示範手機「假範本庫」的 HTML 已拿掉；JS 裡 [data-template] 那段找不到元素就直接結束（為了輸出不變先保留）。
"""
import json

from site_song import audio_urls
from site_icons import icon

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
