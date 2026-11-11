"""靈感分頁的互動：四個起點（聲音、文字、照片、塗鴉）都能真的操作，照 InspirationView.swift 的流程。

- 塗鴉（SketchCanvasView.swift）：訪客用手指或滑鼠在 canvas 上畫；鋼筆、麥克筆、鉛筆、橡皮擦（整筆擦掉，同 PencilKit 向量橡皮擦）、
  復原／重做；有畫才能儲存；有沒存的筆跡按取消會先問「放棄這次的塗鴉?」。儲存後靈感頁出現塗鴉卡，縮圖就是剛畫的。
  深色畫紙是黑紙、墨水顯示成白色（App 註解：PencilKit 自動把黑墨水顯示成白色）。
- 文字：「起點文字」輸入後儲存＝換掉文字卡內容；清空儲存＝回到「加一句話」。
- 照片：示意色塊（標「功能示意」）。聲音：「哼一段」→「聲音起點」錄音示意（不收音、不出聲）→「用這段」。
- 自動示範：點「畫一筆」→ 模擬手指畫三筆 → 儲存；再點聲音看選單。全部只在記憶體，重新整理就清空。
"""

APP_INSPIRE_JS = """<script>
(function () {
  var A = CMApp;
  function curvePoints(w, h, k) {  // 自動示範的手指軌跡：三段簡單曲線
    var pts = [];
    for (var i = 0; i <= 40; i++) {
      var t = i / 40;
      if (k === 0) pts.push([w * (0.12 + 0.76 * t), h * (0.35 + 0.12 * Math.sin(t * Math.PI * 2))]);
      else if (k === 1) pts.push([w * (0.5 + 0.22 * Math.cos(t * Math.PI * 2)), h * (0.6 + 0.12 * Math.sin(t * Math.PI * 2))]);
      else pts.push([w * (0.15 + 0.7 * t), h * (0.82 - 0.06 * Math.sin(t * Math.PI))]);
    }
    return pts;
  }
  function sketchPad(sheet, ph) {
    var canvas = A.$(sheet, 'canvas'), paper = A.$(sheet, '.sk-paper'), ctx = canvas.getContext('2d');
    var strokes = [], saved = [], undo = [], redo = [], tool = 'pen', live = null, timer = null;
    var STYLE = { pen: [3, 1], pencil: [1.6, 0.85], marker: [14, 0.45] };
    function ink() { var bg = getComputedStyle(paper).backgroundColor; return /\\(0, 0, 0/.test(bg) ? '#FFFFFF' : '#000000'; }
    function size() { var r = paper.getBoundingClientRect(), d = window.devicePixelRatio || 1; canvas.width = r.width * d; canvas.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); draw(); }
    function line(s) {
      var st = STYLE[s.tool]; ctx.globalAlpha = st[1]; ctx.lineWidth = st[0]; ctx.strokeStyle = s.tool === 'marker' ? '#FFCC00' : ink();
      ctx.lineCap = ctx.lineJoin = 'round'; ctx.beginPath();
      s.pts.forEach(function (p, i) { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); });
      if (s.pts.length === 1) ctx.lineTo(s.pts[0][0] + 0.1, s.pts[0][1]);
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    function draw() {
      var r = paper.getBoundingClientRect(); ctx.fillStyle = getComputedStyle(paper).backgroundColor; ctx.fillRect(0, 0, r.width, r.height);
      strokes.forEach(line); if (live) line(live); buttons();
    }
    function buttons() {
      A.$(sheet, '[data-act="undo"]').disabled = !undo.length; A.$(sheet, '[data-act="redo"]').disabled = !redo.length;
      A.$(sheet, '[data-act="save-sketch"]').disabled = !strokes.length;
    }
    function commit(next) { undo.push(strokes); redo = []; strokes = next; draw(); }
    function at(e) { var r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function erase(p) {
      var keep = strokes.filter(function (s) { return !s.pts.some(function (q) { return Math.abs(q[0] - p[0]) < 10 && Math.abs(q[1] - p[1]) < 10; }); });
      if (keep.length !== strokes.length) commit(keep);
    }
    canvas.addEventListener('pointerdown', function (e) {
      e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      if (tool === 'eraser') { erase(at(e)); live = { erasing: true }; return; }
      live = { tool: tool, pts: [at(e)] }; draw();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!live) return;
      if (live.erasing) { erase(at(e)); return; }
      live.pts.push(at(e)); draw();
    });
    function end() { if (live && !live.erasing) { var s = live; live = null; commit(strokes.concat([s])); } live = null; }
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    A.$$(sheet, '[data-tool]').forEach(function (b) { b.addEventListener('click', function () {
      tool = b.dataset.tool; A.$$(sheet, '[data-tool]').forEach(function (x) { x.classList.toggle('on', x === b); }); }); });
    A.$(sheet, '[data-act="undo"]').addEventListener('click', function () { if (undo.length) { redo.push(strokes); strokes = undo.pop(); draw(); } });
    A.$(sheet, '[data-act="redo"]').addEventListener('click', function () { if (redo.length) { undo.push(strokes); strokes = redo.pop(); draw(); } });
    return {
      open: function () { strokes = saved.slice(); undo = []; redo = []; A.sheet(sheet, true); setTimeout(size, 30); },
      dirty: function () { return strokes !== saved && (strokes.length !== saved.length || undo.length > 0); },
      save: function () { saved = strokes.slice(); undo = []; redo = []; return canvas.toDataURL('image/png'); },
      clear: function () { clearInterval(timer); strokes = []; saved = []; undo = []; redo = []; live = null; },
      autoDraw: function () {  // 自動示範：一點一點畫出三筆
        var r = paper.getBoundingClientRect(), k = 0, i = 0, pts = curvePoints(r.width, r.height, 0);
        clearInterval(timer);
        timer = setInterval(function () {
          if (!live) live = { tool: 'pen', pts: [] };
          live.pts.push(pts[i++]); draw();
          if (i < pts.length) return;
          end(); k++; i = 0; if (k > 2) { clearInterval(timer); return; } pts = curvePoints(r.width, r.height, k);
        }, 16);
      }
    };
  }
  A.ctl.inspiration = function (pane, ph, song) {
    var view = pane.closest('.ph-view') || pane, dialog = A.$(pane, '[data-dialog="voice"]');
    var sheets = {}; ['sketch', 'text', 'photo', 'voice'].forEach(function (k) { sheets[k] = A.$(pane, '[data-sheet="' + k + '"]'); view.appendChild(sheets[k]); });
    view.appendChild(dialog);  // 疊在分頁列上面（confirmationDialog／sheet 都蓋過 Tab Bar）
    var seeds = {}, initial = {}; A.$$(pane, '[data-seed]').forEach(function (n) { seeds[n.dataset.seed] = n; initial[n.dataset.seed] = n.innerHTML; });
    var discard = null, pad = sketchPad(sheets.sketch, ph), area = A.$(sheets.text, 'textarea'), vTimer = null, vStart = 0, vSecs = 0;
    function head(title) { return '<div class="seed-head"><small>' + title + '</small><span class="more">' + A.ic('ellipsis') + '</span></div>'; }
    function card(act, title, body) { return '<div class="a-card seed-media" role="button" tabindex="0" data-act="' + act + '">' + head(title) + body + '</div>'; }
    function textNow() { var p = A.$(seeds.text, '[data-seed-text]'); return p ? p.textContent : ''; }
    function closeAll() { Object.keys(sheets).forEach(function (k) { A.sheet(sheets[k], false); }); dialog.classList.remove('on'); if (discard) discard.classList.remove('on'); }
    var open = {
      voice: function () { dialog.classList.add('on'); },
      text: function () { area.value = textNow(); A.sheet(sheets.text, true); },
      photo: function () { A.sheet(sheets.photo, true); },
      sketch: function () { pad.open(); }
    };
    pane.addEventListener('click', function (e) { var t = e.target.closest('[data-act]'); if (t && open[t.dataset.act] && seeds[t.closest('[data-seed]') ? t.closest('[data-seed]').dataset.seed : '']) open[t.dataset.act](); });
    pane.addEventListener('keydown', function (e) { var t = e.target.closest('[role="button"][data-act]'); if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.click(); } });
    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-act="hum"]')) { dialog.classList.remove('on'); openVoice(); return; }
      if (e.target === dialog || e.target.closest('[data-close]')) dialog.classList.remove('on');
    });
    // SketchCanvasView：有沒存的筆跡按取消 → confirmationDialog「放棄這次的塗鴉?」（放棄變更／繼續畫）
    discard = document.createElement('div'); discard.className = 'a-dialog'; view.appendChild(discard);
    discard.innerHTML = '<div class="a-dialog-box"><div class="a-dialog-group"><p class="a-dialog-title"><b>放棄這次的塗鴉?</b>還沒儲存的筆跡會消失。</p>' +
      '<button type="button" class="danger" data-act="discard">放棄變更</button></div><button type="button" class="a-dialog-cancel" data-close>繼續畫</button></div>';
    discard.addEventListener('click', function (e) {
      if (e.target.closest('[data-act="discard"]')) { discard.classList.remove('on'); A.sheet(sheets.sketch, false); return; }
      if (e.target === discard || e.target.closest('[data-close]')) discard.classList.remove('on');
    });
    Object.keys(sheets).forEach(function (k) { A.$$(sheets[k], '[data-close]').forEach(function (b) { b.addEventListener('click', function () {
      if (k === 'sketch' && pad.dirty()) { discard.classList.add('on'); return; }
      if (k === 'voice') stopVoice(false);
      A.sheet(sheets[k], false);
    }); }); });
    A.$(sheets.sketch, '[data-act="save-sketch"]').addEventListener('click', function () {
      var url = pad.save(); seeds.sketch.innerHTML = card('sketch', '塗鴉', '<img alt="剛剛畫的塗鴉" src="' + url + '">'); A.sheet(sheets.sketch, false);
    });
    A.$(sheets.text, '[data-act="save-text"]').addEventListener('click', function () {
      var v = area.value.trim();
      seeds.text.innerHTML = v ? '<div class="a-card seed-text" role="button" tabindex="0" data-act="text">' + head('文字') + '<p data-seed-text>' + A.esc(v) + '</p></div>' : initial.text.indexOf('data-seed-text') < 0 ? initial.text :
        '<button type="button" class="a-card a-row" data-act="text"><span class="ico">' + A.ic('text.quote') + '</span><div><small>文字</small><span class="muted">加一句話</span></div><span class="chev">' + A.ic('chevron.right') + '</span></button>';
      A.sheet(sheets.text, false);
    });
    A.$$(sheets.photo, '[data-color]').forEach(function (b) { b.addEventListener('click', function () {
      seeds.photo.innerHTML = card('photo', '照片', '<div class="seed-photo" style="background:' + b.dataset.color + '"><em>功能示意</em></div>'); A.sheet(sheets.photo, false);
    }); });
    // 聲音起點：錄音鈕計時（不收音）→ 重錄／用這段
    var vBtn = A.$(sheets.voice, '[data-act="v-rec"]'), vTime = A.$(sheets.voice, '[data-v-time]'), vStatus = A.$(sheets.voice, '[data-v-status]'), vActs = A.$(sheets.voice, '.vs-actions');
    function stopVoice(keep) { clearInterval(vTimer); vTimer = null; vBtn.classList.remove('on'); vTime.classList.remove('rec-time-on'); vStatus.textContent = '點麥克風開始錄'; vActs.hidden = !keep; if (!keep) { vTime.textContent = '0:00'; } }
    function openVoice() { stopVoice(false); A.sheet(sheets.voice, true); }
    vBtn.addEventListener('click', function () {
      if (vTimer) { vSecs = (Date.now() - vStart) / 1000; stopVoice(true); return; }
      vActs.hidden = true; vStart = Date.now(); vBtn.classList.add('on'); vStatus.textContent = '錄音中…自彈自唱或哼旋律';
      vTimer = setInterval(function () { vTime.textContent = A.time((Date.now() - vStart) / 1000); }, 250);
    });
    A.$(sheets.voice, '[data-act="v-redo"]').addEventListener('click', function () { stopVoice(false); });
    A.$(sheets.voice, '[data-act="v-use"]').addEventListener('click', function () {
      seeds.voice.innerHTML = '<button type="button" class="a-card a-row seed-voice" data-act="voice"><span class="ico">' + A.ic('play.circle.fill') +
        '</span><div><small>聲音</small><span>' + A.time(vSecs) + '</span></div><span class="chev">' + A.ic('ellipsis') + '</span></button>';
      A.sheet(sheets.voice, false);
    });
    function reset() { closeAll(); pad.clear(); stopVoice(false); Object.keys(seeds).forEach(function (k) { seeds[k].innerHTML = initial[k]; }); }
    function wait() { return null; }
    return { reset: reset, steps: [function () { return A.$(seeds.sketch, '[data-act]'); }, wait, function () { pad.autoDraw(); return null; }, wait,
      function () { return A.$(sheets.sketch, '[data-act="save-sketch"]'); }, wait,
      function () { return A.$(seeds.voice, '[data-act]'); }, wait, function () { return A.$(dialog, '.a-dialog-cancel'); }] };
  };
})();
</script>"""
