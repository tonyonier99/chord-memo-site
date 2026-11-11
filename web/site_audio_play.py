"""示範手機裡「會一直響」的播放：和弦譜從頭播／從這裡播放、編曲多軌混音。參數照 App 原始碼（只讀）：

- 和弦譜播放（Transport.swift＋Accompaniment.swift）：網頁沒有伴奏模式選單，固定用 App 的「每拍下刷」（.strum）：
  每拍一刷、低→高、每弦隔 0.035 秒（±0.006 隨機、不少於一半）；時值＝一拍 × 0.95（gapFactor）；
  力度小節第 1 拍 102、其他正拍 90，±5 隨機（AccompanimentDynamics）。速度用示範歌的 BPM，拍號用第一段的拍號。
- 編曲（ArrangeModel／OverdubGraph）：每軌是示範歌裡真的錄音檔，同時起播；Mute 優先，有人 Solo 時其他軌不出聲。
- 自動示範按下去的播放只走畫面不出聲（CMAudio.isQuiet）；喇叭關掉時照樣走畫面。
"""

AUDIO_PLAY_JS = """<script>
(function () {
  var A = window.CMApp, S = window.CMAudio;
  function jitter(v, d) { return v + (Math.random() * 2 - 1) * d; }
  A.chartPlayer = function (pane, getSections, fretsFor, song) {
    var btn = A.$(pane, '[data-act="play-all"]'), beat = 60 / (song.bpm || 100), timer = null, seq = [], i = 0, ctx0 = 0, perf0 = 0, quiet = false;
    var meter = ((song.sections[0] || {}).meter || '4/4').split('/'), perBar = Math.max(1, +meter[0] || 4);
    function paint(key) {
      A.$$(pane, '.bar.now').forEach(function (b) { b.classList.remove('now'); });
      var el = key && A.$(pane, '[data-bar="' + key + '"]'); if (el) el.classList.add('now');
    }
    function build(fromKey) {
      var out = [];
      getSections().forEach(function (s, si) {
        s.bars.forEach(function (c, b) { for (var k = 0; k < perBar; k++) out.push({ key: si + ':' + b, chord: c, first: k === 0 }); });
      });
      var at = out.findIndex(function (e) { return e.key === fromKey && e.first; });
      return out.slice(Math.max(0, at));
    }
    function tick() {
      var ev = seq[i]; if (!ev) { stop(); return; }
      if (ev.first) paint(ev.key);
      if (ev.chord && !quiet && S.live()) {
        S.strum(S.midis(fretsFor(ev.chord)), { at: ctx0 + i * beat, stagger: Math.max(0.0175, jitter(0.035, 0.006)),
          vel: jitter(ev.first ? 102 : 90, 5), dur: beat * 0.95 });
      }
      i++; timer = setTimeout(tick, Math.max(0, (perf0 + i * beat - 0.06) * 1000 - performance.now()));
    }
    function stop() { clearTimeout(timer); timer = null; paint(null); btn.innerHTML = A.ic('play.circle.fill'); btn.setAttribute('aria-label', '從頭播'); }
    function start(fromKey) {
      stop(); quiet = S.isQuiet(); seq = build(fromKey); i = 0;
      ctx0 = S.now() + 0.08; perf0 = performance.now() / 1000 + 0.08;
      btn.innerHTML = A.ic('stop.circle.fill'); btn.setAttribute('aria-label', '停止'); tick();
    }
    return { start: start, stop: stop, toggle: function () { if (timer) stop(); else start(null); } };
  };
  // 編曲：各軌真的錄音同時起播；gain 跟著靜音／S 即時變
  A.arrangeMixer = function (ph) {
    var all = window.CMAudioFiles || {}, files = (ph.dataset.pro === '1' ? all.lanes : all.free) || [], nodes = [], token = 0;  // 免費版示範 2 軌、付費版 5 軌
    function level(lanes, i) { var solo = lanes.some(function (l) { return l.solo; }), l = lanes[i] || {}; return l.mute || (solo && !l.solo) ? 0 : 1; }
    function stop() { token++; nodes.forEach(function (n) { try { n.src.stop(); } catch (e) { return; } }); nodes = []; }
    function start(lanes, offset) {
      stop(); if (!S.allowed()) return;
      var mine = token;
      Promise.all(files.map(function (f) { return S.load(S.url(f)); })).then(function (bufs) {
        if (mine !== token || !S.live()) return;
        nodes = bufs.map(function (b, i) { var g = S.gain(level(lanes, i)); return { gain: g, src: S.play(b, offset, g) }; });
      }).catch(function () { A.toast(ph, '音檔載入失敗，請重新整理'); });
    }
    function mix(lanes) { nodes.forEach(function (n, i) { n.gain.gain.setTargetAtTime(level(lanes, i), S.now(), 0.02); }); }
    return { start: start, stop: stop, mix: mix };
  };
})();
</script>"""
