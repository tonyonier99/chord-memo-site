"""調音器、節拍器示範手機的互動（TunerView.swift／TunerLogic.swift、RhythmView.swift）。

調音器：點弦＝鎖定這條弦、切到「手動」（App tapString）；「開始調音」後的讀數是示意（網頁不收音），
音名、頻率、音分字樣照 App（captionText：「%.1f Hz · %+.0f 音分 · 調高一點／準了」）。
節拍器：− ＋、滑桿（30–250）、Tap 抓速度、播放時拍點燈依速度輪流亮（第一拍較大）；不出聲。
"""

APP_TOOLS_JS = """<script>
(function () {
  var A = CMApp, NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'], OPEN = [40, 45, 50, 55, 59, 64];
  A.ctl.tuner = function (ph) {
    var strings = A.$$(ph, '[data-string]'), modes = A.$$(ph, '[data-mode]'), note = A.$(ph, '[data-note]'), cap = A.$(ph, '[data-cap]');
    var needle = A.$(ph, '.tn-needle'), listen = A.$(ph, '[data-act="listen"]'), locked = null, mode = '自動', active = false, timer = null;
    function setMode(m) { mode = m; modes.forEach(function (b) { b.classList.toggle('on', b.dataset.mode === m); }); paintStrings(-1, false); }
    function paintStrings(hit, ok) {
      strings.forEach(function (b, i) { b.classList.toggle('lock', mode === '手動' && i === locked); b.classList.toggle('hit', i === hit); b.classList.toggle('ok', i === hit && ok); });
    }
    function idle() {
      note.textContent = '—'; note.classList.remove('ok'); needle.style.display = 'none';
      cap.textContent = active ? '對著樂器發聲' : '按「開始調音」'; paintStrings(-1, false);
    }
    function show(i, cents) {
      var midi = OPEN[i], ok = Math.abs(cents) < 1, hz = 440 * Math.pow(2, (midi + cents / 100 - 69) / 12);
      note.innerHTML = NAMES[midi % 12] + '<sub>' + (Math.floor(midi / 12) - 1) + '</sub>'; note.classList.toggle('ok', ok);
      needle.style.display = 'block'; needle.classList.toggle('ok', ok); needle.style.left = Math.max(0, Math.min(100, (cents + 50))) + '%';
      cap.textContent = hz.toFixed(1) + ' Hz · ' + (cents >= 0 ? '+' : '') + Math.round(cents) + ' 音分 · ' + (ok ? '準了' : (cents < 0 ? '調高一點' : '調低一點'));
      paintStrings(i, ok);
    }
    function stop() { clearInterval(timer); timer = null; active = false; listen.innerHTML = A.ic('mic.fill') + '開始調音'; listen.classList.remove('soft'); idle(); }
    function start() {
      active = true; listen.innerHTML = A.ic('stop.fill') + '停止'; listen.classList.add('soft'); idle();
      var seq = [-24, -11, -4, 0], k = 0, target = locked == null ? 1 : locked;
      timer = setInterval(function () { if (k < seq.length) show(target, seq[k++]); }, 750);
    }
    // 點弦：鎖定這條弦並播參考音（TunerView.tapString；A4 = 440 Hz）
    strings.forEach(function (b, i) { b.addEventListener('click', function () { var S = window.CMAudio; locked = i; setMode('手動'); if (active) { stop(); start(); } S.tone(S.hz(S.open(i))); }); });
    modes.forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode); }); });
    listen.addEventListener('click', function () { if (active) stop(); else start(); });
    function reset() { locked = null; stop(); setMode('自動'); }
    reset();
    function wait() { return null; }
    return { reset: reset, steps: [function () { return strings[1]; }, function () { return listen; }, wait, wait, wait, function () { return listen; }] };
  };
  A.ctl.metronome = function (ph) {
    var start = +ph.dataset.bpm || 100, bpm = start, label = A.$(ph, '[data-bpm]'), slider = A.$(ph, '.mt-slider');
    var dots = A.$$(ph, '.mt-beats i'), play = A.$(ph, '[data-act="play"]'), tapBtn = A.$(ph, '[data-act="tap"]'), timer = null, beat = 0, taps = [], heard = false;
    function set(v) { bpm = Math.max(30, Math.min(250, Math.round(v))); label.textContent = bpm; slider.value = bpm; if (timer) { halt(); go(); } }
    // 第一拍強、其他拍中（RecordClickTrack 的合成 click；App 節拍器頁用音色庫的木魚，網頁沒有那份取樣）
    function tick() { dots.forEach(function (d, i) { d.classList.toggle('hit', i === beat); }); if (heard && window.CMAudio.live()) window.CMAudio.click(beat === 0 ? 'strong' : 'medium'); beat = (beat + 1) % dots.length; }
    function go() { heard = !window.CMAudio.isQuiet(); beat = 0; tick(); timer = setInterval(tick, 60000 / bpm); play.innerHTML = A.ic('stop.fill') + '<span>停止</span>'; }
    function halt() { clearInterval(timer); timer = null; dots.forEach(function (d) { d.classList.remove('hit'); }); play.innerHTML = A.ic('play.fill') + '<span>播放</span>'; }
    A.$$(ph, '[data-step]').forEach(function (b) { b.addEventListener('click', function () { set(bpm + +b.dataset.step); }); });
    slider.addEventListener('input', function () { set(+slider.value); });
    play.addEventListener('click', function () { if (timer) halt(); else go(); });
    tapBtn.addEventListener('click', function () {
      var now = Date.now(); taps = taps.filter(function (t) { return now - t < 2500; }).concat([now]).slice(-5);
      tapBtn.classList.add('pulse'); setTimeout(function () { tapBtn.classList.remove('pulse'); }, 150);
      if (taps.length > 1) set(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)));
    });
    function reset() { halt(); taps = []; set(start); }
    reset();
    function wait() { return null; }
    var plus = A.$(ph, '[data-step="1"]');
    return { reset: reset, steps: [function () { return plus; }, function () { return plus; }, function () { return play; }, wait, wait, function () { return play; }] };
  };
})();
</script>"""
