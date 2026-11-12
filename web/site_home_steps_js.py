"""首頁四步的互動（site_home_steps.py 的多軌與和弦譜）。

- 多軌：四軌真的分軌同時起播（CMAudio.load／gain／play）；喇叭＝關掉這軌，S＝只聽這軌（可多軌一起 S，跟 App 編曲一樣）；
  播完、再按、聲音開關關掉都會停。下載中時間欄顯示「載入中…」、按鈕變淡（站長 11-12：網路慢時看不出在載入），載入中再按＝取消。
- 和弦譜：點小節 → 用 App 和弦引擎算這個和弦的吉他按法（CMApp.frets），列出六條弦，並整彈一次（velocity 64、0.45 秒＝App 和弦盤試聽）。
"""

STEPS_JS = r"""<script>
(function () {
  var S = window.CMAudio, A = window.CMApp;
  var mt = document.querySelector('[data-hs-mt]');
  if (mt && S) {
    var urls = JSON.parse(mt.dataset.hsMt), rows = Array.prototype.slice.call(mt.querySelectorAll('[data-hs-lane]'));
    var play = mt.querySelector('[data-hs-play]'), time = mt.querySelector('[data-hs-time]'), err = mt.querySelector('[data-hs-err]');
    var nodes = null, loading = false, started = 0, dur = 30, raf = 0, token = 0, ICON = play.innerHTML, STOP = '<span aria-hidden="true">&#9632;</span>';
    function state() { return rows.map(function (r) { return { mute: r.querySelector('.hs-mute').getAttribute('aria-pressed') === 'true',
      solo: r.querySelector('.hs-solo').getAttribute('aria-pressed') === 'true' }; }); }
    function level(i) { var st = state(), any = st.some(function (s) { return s.solo; }); return (any ? st[i].solo : !st[i].mute) ? 1 : 0; }
    function paint() { rows.forEach(function (r, i) { r.classList.toggle('off', level(i) === 0); });
      if (nodes) nodes.forEach(function (n, i) { n.gain.gain.setTargetAtTime(level(i), S.now(), 0.02); }); }
    function fmt(s) { s = Math.max(0, Math.floor(s)); return '0:' + (s < 10 ? '0' : '') + s; }
    function tick() {
      var t = Math.min(dur, S.now() - started);
      time.textContent = fmt(t) + ' / 0:30';
      rows.forEach(function (r) { r.querySelector('.hs-bar i').style.width = (t / dur * 100) + '%'; });
      if (t >= dur) { stop(); return; } raf = requestAnimationFrame(tick);
    }
    function stop() {
      token++; cancelAnimationFrame(raf);
      if (nodes) nodes.forEach(function (n) { try { n.src.stop(); } catch (e) { n.src = null; } });
      nodes = null; busy(false); play.innerHTML = ICON; play.setAttribute('aria-label', '播放');
    }
    function busy(on) { loading = on; mt.classList.toggle('loading', on); if (on) time.textContent = '載入中…';
      else if (!nodes) time.textContent = '0:00 / 0:30'; }
    play.addEventListener('click', function () {
      if (nodes || loading) { stop(); return; }
      if (!S.allowed()) return;
      var mine = ++token; err.hidden = true; busy(true); play.setAttribute('aria-label', '載入中，再按取消');
      Promise.all(urls.map(function (u) { return S.load(u); })).then(function (bufs) {
        if (mine !== token || !S.live()) return;
        dur = Math.min.apply(null, bufs.map(function (b) { return b.duration; }));
        busy(false); nodes = bufs.map(function (b, i) { var g = S.gain(level(i)); return { gain: g, src: S.play(b, 0, g) }; });
        started = S.now(); play.innerHTML = STOP; play.setAttribute('aria-label', '停止'); tick();
      }).catch(function () { if (mine === token) { stop(); err.hidden = false; } });
    });
    rows.forEach(function (r) {
      ['.hs-mute', '.hs-solo'].forEach(function (sel) {
        var b = r.querySelector(sel);
        b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); paint(); });
      });
    });
    document.addEventListener('cmsound', function (e) { if (!e.detail.on) stop(); });
  }
  var sheet = document.querySelector('[data-hs-sheet]');
  if (sheet && A) {
    var song = JSON.parse(sheet.dataset.hsSheet), box = sheet.querySelector('[data-hs-fing]'), names = ['E', 'A', 'D', 'G', 'B', 'e'];
    sheet.addEventListener('click', function (e) {
      var b = e.target.closest('[data-hs-chord]'); if (!b) return;
      sheet.querySelectorAll('[data-hs-chord]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var c = b.dataset.hsChord, f = A.frets(c, song);
      box.innerHTML = '<p>' + A.esc(c) + ' 的按法（低音弦 → 高音弦）</p><ol>' + f.map(function (v, i) {
        return '<li><b>' + names[i] + '</b><span>' + (v < 0 ? '✕' : v === 0 ? '○' : v) + '</span></li>'; }).join('') + '</ol>';
      if (S && S.allowed()) S.frets(f, { stagger: 0, vel: 64, dur: 0.45 });
    });
  }
})();
</script>"""
