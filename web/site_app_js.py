"""網頁重畫 App 的共用程式＋錄音、編曲、靈感分頁的互動。

- 靈感分頁（四個起點與塗鴉畫布）在 site_app_js_inspire.py。
- CMApp：共用小工具（找元素、手指提示、Toast、選單、App 和弦引擎呼叫）。
- 每個分頁一個 controller：ctl.xxx(pane, ph, song) → { reset, steps }；steps 是自動示範時依序要點的元素（null＝停一拍）。
- 只在記憶體裡改畫面，不連後端、不存任何東西、不出聲。
和弦譜在 site_app_js_chart.py、工具在 site_app_js_tools.py、自動播放與導覽在 site_app_js_run.py。
"""

APP_BASE_JS = """<script>
window.CMApp = (function () {
  var A = { ctl: {}, reduce: !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) };
  A.$ = function (root, sel) { return root.querySelector(sel); };
  A.ic = function (sf) { return (window.CMIcons || {})[sf] || ''; };  // SF 名稱 → Phosphor 圖示（site_icons.py）
  A.$$ = function (root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
  A.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  A.time = function (sec) { var s = Math.max(0, Math.floor(sec)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); };
  A.screen = function (el) { return el.closest('.ph-screen'); };
  A.tap = function (el) {
    var screen = A.screen(el); if (!screen || A.reduce) return;
    var r = el.getBoundingClientRect(), s = screen.getBoundingClientRect(), dot = document.createElement('span');
    dot.className = 'tap'; dot.style.left = (r.left - s.left + r.width / 2) + 'px'; dot.style.top = (r.top - s.top + r.height / 2) + 'px';
    screen.appendChild(dot); setTimeout(function () { dot.remove(); }, 700);
  };
  A.toast = function (ph, text) {
    var t = A.$(ph, '.a-toast'); t.textContent = text; t.classList.add('on');
    clearTimeout(t._timer); t._timer = setTimeout(function () { t.classList.remove('on'); }, 2200);
  };
  A.closeMenus = function (ph) { A.$$(ph, '.a-menu.on').forEach(function (m) { m.classList.remove('on'); }); };
  A.openMenu = function (menu, anchor) {
    menu.classList.add('on');
    var box = menu.offsetParent || menu.parentNode, b = box.getBoundingClientRect(), r = anchor.getBoundingClientRect();
    var left = Math.min(Math.max(8, r.left - b.left), b.width - menu.offsetWidth - 8);
    var top = r.bottom - b.top + 4;
    if (top + menu.offsetHeight > b.height - 8) top = Math.max(8, r.top - b.top - menu.offsetHeight - 4);
    menu.style.left = left + 'px'; menu.style.top = top + 'px'; menu.style.right = 'auto'; menu.style.bottom = 'auto';
  };
  A.sheet = function (el, open) { el.classList.toggle('on', open); };
  // App 內建和弦引擎（engine.js，App 以 JavaScriptCore 執行的同一份）
  A.engine = function (name, args) {
    try { return JSON.parse(window.ChordEngine.call(name, JSON.stringify(args))); } catch (e) { return null; }
  };
  A.symbol = function (roman, song) { var c = A.engine('extendChord', [roman, song.key, song.mode, 'triad']); return c && c.symbol ? c.symbol : roman; };
  // MusicEngine.startingFingering：符號 → 羅馬級數 → guitarFrets（nil 悶弦 → -1）；都沒有回全悶
  A.frets = function (symbol, song) {
    var roman = A.engine('symbolToRoman', [symbol, song.key, song.mode]);
    var f = roman ? A.engine('guitarFrets', [roman, song.key, song.mode]) : null;
    if (!f || !f.length) return [-1, -1, -1, -1, -1, -1];
    return f.map(function (v) { return v == null ? -1 : v; });
  };
  A.song = function (ph) { return JSON.parse(ph.dataset.song || '{}'); };
  // 指板格子的朗讀名稱：「B 弦 第 1 品」「A 弦 空弦」「E 弦 悶弦」
  A.fretLabel = function (label, f) { return label + ' 弦 ' + (f === -1 ? '悶弦' : f === 0 ? '空弦' : '第 ' + f + ' 品'); };
  A.hasSound = function (f) { return f.some(function (v) { return v >= 0; }); };  // FretboardEditorView.hasSound：至少一條弦有聲才能儲存
  // FretboardEditorView 候選卡：「看起來像」＋引擎反查（detectChordFromFrets）前 3 個；認不出就說「猜不出名字也沒關係，一樣存得起來」
  A.guessHTML = function (f) {
    var names = (A.engine('detectChordFromFrets', [f, 'standard', 0]) || []).slice(0, 3);
    var body = names.length ? '<div class="fg-chips">' + names.map(function (n) { return '<span>' + A.esc(n) + '</span>'; }).join('') + '</div>'
      : '<p class="fg-none">猜不出名字也沒關係，一樣存得起來</p>';
    return '<p class="fg-head">' + A.ic('waveform.badge.magnifyingglass') + '看起來像</p>' + body +
      '<div class="fg-actions"><button type="button" class="fg-save" data-act="save"' + (A.hasSound(f) ? '' : ' disabled') + '>儲存</button>' +
      '<button type="button" class="fg-clear" data-act="clear">' + A.ic('arrow.uturn.backward') + '清除自訂 · 改回預設按法</button></div>';
  };
  return A;
})();

// 錄音：大錄音鈕（計時、停下就多一筆錄音）、節拍器鈕、全部／最愛、星星
CMApp.ctl.record = function (pane, ph, song) {
  var A = CMApp, btn = A.$(pane, '[data-act="rec"]'), met = A.$(pane, '[data-act="met"]'), cd = A.$(pane, '[data-act="countdown"]');
  var cdMenu = A.$(pane, '[data-menu="countdown"]'), cdLabel = A.$(pane, '[data-count-label]'), countdown = 0;
  var status = A.$(pane, '.rec-status'), clock = A.$(pane, '.rec-time'), cap = A.$(pane, '.rec-cap');
  var list = A.$(pane, '[data-takes]'), head = A.$(pane, '[data-takes-head]'), empty = A.$(pane, '[data-fav-empty]');
  var segs = A.$$(pane, '[data-fav]'), takes, favOnly, start = 0, timer = null, metOn = false, fresh = -1;
  var S = window.CMAudio, clickT = null, takeSrc = null, playing = false, playAt = 0, playT = null;
  function stamp(d) { return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function render() {
    var favs = takes.filter(function (t) { return t.fav; }).length, shown = takes.filter(function (t) { return !favOnly || t.fav; });
    segs[0].textContent = '全部 ' + takes.length; segs[1].textContent = '最愛 ' + favs;
    segs.forEach(function (s) { s.classList.toggle('on', (s.dataset.fav === '1') === favOnly); });
    head.textContent = '這裡的錄音（' + takes.length + '）';
    empty.style.display = shown.length ? 'none' : 'block'; list.style.display = shown.length ? 'block' : 'none';
    list.innerHTML = shown.map(function (t) {
      var i = takes.indexOf(t);
      // 主錄音播放中：圖示換停止、時間顯示「已播／全長」（站長 11-12：原本播放時畫面不會動）
      var on = t.main && playing, secs = on ? A.time(Math.min(t.secs, (Date.now() - playAt) / 1000)) + ' / ' + A.time(t.secs) : A.time(t.secs);
      return '<div class="take' + (i === fresh ? ' new' : '') + (t.main ? ' main' : '') + (on ? ' playing' : '') + '">' + (t.main ? '<button type="button" class="play" aria-label="' + (on ? '停止 ' : '播放 ') + A.esc(t.name) + '">' : '<span class="play">') +
        A.ic(on ? 'stop.circle.fill' : 'play.circle.fill') + (t.main ? '</button>' : '</span>') + '<div><strong>' + A.esc(t.name) +
        '</strong><small>' + secs + '</small></div>' + (t.main ? '<span class="arr" aria-label="繼續編曲">' + A.ic('slider.vertical.3') + '</span>' : '') +
        '<button type="button" class="star' + (t.fav ? ' on' : '') + '" data-star="' + i + '" aria-label="最愛">' + A.ic(t.fav ? 'star.fill' : 'star') +
        '</button><span class="more">' + A.ic('ellipsis') + '</span></div>';
    }).join('');
    fresh = -1;
    cap.textContent = metOn && !timer ? song.bpm + ' BPM · 4/4 · 預備拍 1 小節' : '';
  }
  function toggle() {
    if (timer) {
      clearInterval(timer); timer = null; clearInterval(clickT); clickT = null;
      takes = [{ name: stamp(new Date()), secs: (Date.now() - start) / 1000, fav: false }].concat(takes); fresh = 0;
      btn.classList.remove('on'); clock.classList.remove('on'); clock.textContent = '0:00'; status.textContent = '點麥克風開始錄';
    } else {
      start = Date.now(); btn.classList.add('on'); clock.classList.add('on'); status.textContent = '錄音中…自彈自唱或哼旋律';
      timer = setInterval(function () { clock.textContent = A.time((Date.now() - start) / 1000); }, 250);
      if (metOn && S.allowed()) clicks();
    }
    render();
  }
  // 錄音節拍器：照 RecordClickTrack，第 1 拍強（1760 Hz）、其他拍中（1320 Hz），速度用這首歌的 BPM
  function clicks() {
    var n = 0, beat = 60 / (song.bpm || 100), t0 = S.now() + 0.05;
    function one() { if (S.live()) S.click(n % 4 === 0 ? 'strong' : 'medium', t0 + n * beat); n++; }
    one(); clickT = setInterval(one, beat * 1000);
  }
  function stopTake() { if (takeSrc) { try { takeSrc.stop(); } catch (e) { takeSrc = null; } } takeSrc = null; playing = false; clearInterval(playT); playT = null; render(); }
  // 主錄音「主旋律」：播示範歌裡真的錄音（再點一次停）
  function playTake() {
    if (takeSrc) { stopTake(); return; }
    if (!S.allowed()) return;
    S.load(S.url((window.CMAudioFiles || {}).take || '')).then(function (b) {
      if (!S.live()) return;
      var src = S.play(b, 0); takeSrc = src; playing = true; playAt = Date.now(); render();
      playT = setInterval(render, 250);
      src.addEventListener('ended', function () { if (takeSrc === src) { takeSrc = null; stopTake(); } });
    }).catch(function () { A.toast(ph, '音檔載入失敗，請重新整理'); });
  }
  btn.addEventListener('click', toggle);
  met.addEventListener('click', function () { if (timer) return; metOn = !metOn; met.classList.toggle('on', metOn); render(); });
  // 開錄倒數（RecordCountdownSettings：關／3／5／10 秒）：選了大於 0 就變強調色並顯示秒數
  function setCountdown(v) { countdown = v; cd.classList.toggle('on', v > 0); cdLabel.textContent = v > 0 ? v : ''; }
  cd.addEventListener('click', function () { if (!timer) A.openMenu(cdMenu, cd); });
  cdMenu.addEventListener('click', function (e) { var b = e.target.closest('[data-count]'); if (b) { setCountdown(+b.dataset.count); A.closeMenus(ph); } });
  segs.forEach(function (s) { s.addEventListener('click', function () { favOnly = s.dataset.fav === '1'; render(); }); });
  list.addEventListener('click', function (e) {
    if (e.target.closest('.take.main .play')) { playTake(); return; }
    var star = e.target.closest('[data-star]'); if (!star) return;
    var t = takes[+star.dataset.star]; t.fav = !t.fav; render();
  });
  function reset() {
    if (timer) { clearInterval(timer); timer = null; }
    clearInterval(clickT); clickT = null; stopTake();
    takes = song.take ? [{ name: song.take, secs: song.takeSeconds, fav: false, main: true }] : []; favOnly = false; metOn = false; setCountdown(0);
    met.classList.remove('on'); btn.classList.remove('on'); clock.classList.remove('on'); clock.textContent = '0:00';
    status.textContent = '點麥克風開始錄'; render();
  }
  reset();
  function wait() { return null; }
  return { reset: reset, steps: [function () { return cd; }, function () { return A.$(cdMenu, '[data-count="3"]'); }, function () { return met; },
    function () { return btn; }, wait, wait, function () { return btn; },
    function () { return A.$(list, '[data-star="0"]'); }, function () { return segs[1]; }, wait, function () { return segs[0]; }] };
};

// 編曲：走帶播放（播放頭跑過主錄音長度）、每軌靜音／S、加一軌（免費 2 軌、Pro 6 軌）
CMApp.ctl.arrange = function (pane, ph, song) {
  var A = CMApp, pro = ph.dataset.pro === '1', FREE = 2, MAX = 6;
  var box = A.$(pane, '[data-lanes]'), head = A.$(pane, '.playhead'), time = A.$(pane, '[data-time]');
  var play = A.$(pane, '[data-act="play"]'), add = A.$(pane, '[data-act="add"]'), proPill = A.$(pane, '[data-pro]');
  var count = A.$(pane, '[data-count]'), hint = A.$(pane, '[data-add-hint]'), dur = song.takeSeconds || 0;
  var lanes, pos = 0, timer = null, last = 0, mixer = A.arrangeMixer(ph), heard = false;
  function draw() {
    var solo = lanes.some(function (l) { return l.solo; });
    A.$$(box, '.lane').forEach(function (n) { n.remove(); });
    box.insertAdjacentHTML('beforeend', lanes.map(function (l, i) {
      var dim = l.mute || (solo && !l.solo);
      return '<div class="lane' + (dim ? ' dim' : '') + '"><div class="lane-head"><strong>' + A.esc(l.name) + (i === 0 ? A.ic('lock.fill') : '') + '</strong>' +
        '<div class="lane-btns"><button type="button" class="mute' + (l.mute ? ' on' : '') + '" data-mute="' + i + '" aria-label="' + (l.mute ? '取消靜音 ' : '靜音 ') + A.esc(l.name) + '">' +
        A.ic(l.mute ? 'speaker.slash.fill' : 'speaker.wave.2.fill') + '</button>' +
        '<button type="button" class="solo' + (l.solo ? ' on' : '') + '" data-solo="' + i + '">S</button><span class="lmore">' + A.ic('ellipsis') + '</span></div></div>' +
        '<div class="lane-clip' + (l.empty ? ' empty' : '') + '"></div></div>';
    }).join(''));
    var n = lanes.length, state = n < (pro ? MAX : FREE) ? 'ok' : (pro ? 'full' : 'upgrade');
    count.textContent = n + '/' + MAX + ' 軌';
    proPill.hidden = state !== 'upgrade';
    A.$(add, '[data-add-label]').textContent = state === 'full' ? MAX + ' 軌都用上了' : '加一軌'; add.disabled = state === 'full';
    add.classList.toggle('full', state === 'full'); A.$(pane, '.add-import').hidden = state === 'full';
    hint.textContent = state === 'full' ? '想再錄，可以重錄現有的軌，或先刪掉用不到的那一軌' : '新增的是空白軌：選定後按上方的錄音鈕錄進去。';
    head.style.top = '0'; box.appendChild(head); moveHead(); mixer.mix(lanes);
  }
  function moveHead() {
    var w = box.clientWidth - 92 - 8; head.style.left = (92 + w * (dur ? pos / dur : 0)) + 'px';
    time.textContent = A.time(pos) + ' / ' + A.time(dur);
  }
  function stop() { clearInterval(timer); timer = null; play.classList.remove('playing'); mixer.stop(); }
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    if (pos >= dur) pos = 0;
    last = Date.now(); play.classList.add('playing'); heard = !window.CMAudio.isQuiet(); mixer.start(lanes, pos);
    timer = setInterval(function () { var now = Date.now(); pos = Math.min(dur, pos + (now - last) / 1000); last = now; moveHead(); if (pos >= dur) stop(); }, 100);
  });
  A.$(pane, '[data-act="rewind"]').addEventListener('click', function () { pos = 0; moveHead(); if (timer) mixer.start(lanes, 0); });
  document.addEventListener('cmsound', function (e) { if (e.detail.on && timer && heard) mixer.start(lanes, pos); });
  box.addEventListener('click', function (e) {
    var m = e.target.closest('[data-mute]'), s = e.target.closest('[data-solo]');
    if (m) lanes[+m.dataset.mute].mute = !lanes[+m.dataset.mute].mute;
    if (s) lanes[+s.dataset.solo].solo = !lanes[+s.dataset.solo].solo;
    if (m || s) draw();
  });
  add.addEventListener('click', function () {
    var n = lanes.length;
    if (n < (pro ? MAX : FREE)) { lanes = lanes.concat([{ name: '第 ' + (n + 1) + ' 層', empty: true }]); draw(); }
    else if (!pro) A.toast(ph, '免費版可以錄前 2 軌，第 3 軌以後要 Pro');
  });
  function reset() {
    stop(); pos = 0;
    lanes = (song.lanes || []).map(function (name) { return { name: name, mute: false, solo: false, empty: false }; }); draw();
  }
  reset();
  function wait() { return null; }
  return { reset: reset, steps: [function () { return play; }, wait, function () { return A.$(box, '[data-mute="1"]'); }, wait,
    function () { return A.$(box, '[data-mute="1"]'); }, function () { return A.$(box, '[data-solo="0"]'); }, wait,
    function () { return A.$(box, '[data-solo="0"]'); }, function () { return play; }, function () { return add; }, wait] };
};
</script>"""
