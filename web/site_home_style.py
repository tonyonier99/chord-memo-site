"""首頁的深色工作室外觀＋首屏和弦按法。

- 色彩一律用 App 的系統色深色值（Theme.swift：systemBlue #0A84FF、systemRed #FF453A、
  systemGroupedBackground、secondarySystemGroupedBackground）；站長 2026-11-12：全站固定淺色，示範手機與首屏指板也是淺色。
- 和弦名稱、BPM、步驟編號用等寬字（tabular 數字），呈現錄音介面與和弦譜的質感。
- 不放裝飾圖（和弦大師資料夾沒有可用的氛圍素材；建議 AI 生圖的位置列在回報）。
- 首屏指板照 FretboardEditorView.swift 的排法：最高弦在上、✕ 悶弦、○ 空弦、分隔線、視窗 5 格品（第 1 品起）；
  按法用 App 和弦引擎（MusicEngine.startingFingering 同一條路）。
"""

HOME_CSS = """
:root { --mono:ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace; }
.st-mono { font-family:var(--mono); font-variant-numeric:tabular-nums; }
.st-eyebrow { font-size:0.88rem; font-weight:700; color:var(--accent-ink); letter-spacing:0.04em; }
.st-copy h1 { font-size:clamp(2.4rem,6vw,3.8rem); line-height:1.15; font-weight:800; margin-top:0.4rem; }
.st-copy h2, .st-head h2 { font-size:clamp(1.6rem,3.6vw,2.3rem); line-height:1.3; font-weight:800; margin-top:0.3rem; }
.st-lead { color:var(--sub); font-size:1.05rem; line-height:1.85; margin-top:0.9rem; max-width:34rem; }
.st-cap { color:var(--sub); font-size:0.88rem; line-height:1.7; }
.st-hero { padding:3.4rem 0 3.6rem; border-bottom:1px solid var(--line); }
.st-hero-grid { display:grid; grid-template-columns:minmax(0,1fr); gap:2.4rem; align-items:center; }
@media (min-width:960px) { .st-hero-grid { grid-template-columns:minmax(0,1.05fr) minmax(0,1fr); gap:3.5rem; } }
.st-chords { background:var(--card); border:1px solid var(--line); border-radius:22px; padding:1.3rem 1.2rem 1.2rem; }
.st-meta { font-size:0.82rem; color:var(--sub); }
.st-chords > .st-cap { margin-top:0.2rem; }
.st-chord-row { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:0.5rem; margin:1rem 0; }
.st-chord-row button { font:700 1.35rem/1 var(--mono); color:var(--ink); background:var(--fill); border:1px solid transparent; border-radius:14px;
  min-height:56px; cursor:pointer; transition:background .2s, transform .15s; }
.st-chord-row button:hover { border-color:var(--accent); }
.st-chord-row button:active { transform:scale(0.96); }
.st-chord-row button[aria-selected="true"] { background:var(--accent); color:#fff; }
.st-board { background:var(--bg); border-radius:16px; padding:0.9rem 0.6rem 0.8rem; }
.st-board-title { font-size:0.85rem; color:var(--sub); margin:0 0.4rem 0.6rem; }
.st-board-grid { display:grid; gap:5px; justify-content:center; }
.st-row { display:flex; align-items:center; gap:5px; }
.st-row b { width:16px; text-align:center; font:700 0.78rem var(--mono); color:var(--sub); }
.st-row i { width:1px; height:24px; background:var(--line); }
.st-cell { width:30px; height:30px; border-radius:50%; border:0; padding:0; cursor:pointer; background:var(--fill); color:var(--sub);
  display:flex; align-items:center; justify-content:center; font:0.8rem var(--mono); transition:background .2s, color .2s, transform .1s; }
.st-cell:active { transform:scale(0.9); }
.st-guess { margin-top:0.9rem; }
.st-guess .fg-head { font-size:0.82rem; color:var(--sub); display:flex; align-items:center; gap:6px; }
.st-guess .fg-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
.st-guess .fg-chips span { font:700 0.95rem var(--mono); color:var(--accent-ink); background:var(--accent-soft); border-radius:8px; padding:5px 11px; }
.st-guess .fg-none { font-size:0.85rem; color:var(--sub); margin-top:4px; }
.st-guess .fg-actions { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-top:10px; }
.st-guess .fg-save { border:0; border-radius:999px; background:var(--accent); color:#fff; font-weight:700; padding:8px 18px; cursor:pointer; }
.st-guess .fg-save:disabled { background:var(--fill); color:var(--sub); cursor:default; }
.st-guess .fg-clear { border:0; background:none; color:var(--sub); font-size:0.85rem; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px; }
.st-cell.on { background:var(--accent); color:#fff; font-weight:800; }
.st-board > .st-cap { text-align:center; margin-top:0.6rem; font-size:0.78rem; }
.st-play { display:flex; justify-content:center; flex-wrap:wrap; gap:8px; margin-top:0.7rem; }
.st-play button { display:inline-flex; align-items:center; gap:6px; border:0; border-radius:999px; background:var(--accent-soft);
  color:var(--accent-ink); font-weight:700; font-size:0.88rem; padding:8px 14px; cursor:pointer; }
.st-play .ic { font-size:1.15rem; }
.st-steps { padding:3.6rem 0 1rem; }
.st-head { text-align:center; max-width:44rem; margin:0 auto 1rem; }
.st-head .st-lead { margin-left:auto; margin-right:auto; }
.st-step { padding:2.8rem 0; border-top:1px solid var(--line); }
.st-step:first-of-type { border-top:0; }
.st-num { font-size:2.6rem; font-weight:700; color:var(--record); line-height:1; }
.st-points { list-style:none; margin-top:1rem; display:grid; gap:0.45rem; }
.st-points li { font-family:var(--mono); font-size:0.92rem; color:var(--ink); padding-left:1.1rem; position:relative; }
.st-points li::before { content:""; position:absolute; left:0; top:0.62em; width:6px; height:6px; border-radius:50%; background:var(--accent); }
.st-band { padding:3.6rem 0; border-top:1px solid var(--line); }
.st-tour .ph-card, .st-tools .ph-card { background:transparent; border:0; padding:1rem 0 0; }
.studio .ph-card { background:var(--card); }
.st-tools { display:grid; grid-template-columns:minmax(0,1fr); gap:2rem; margin-top:1.4rem; }
@media (min-width:1100px) { .st-tools { grid-template-columns:repeat(3,minmax(0,1fr)); } }
.st-tool { background:var(--card); border:1px solid var(--line); border-radius:22px; padding:1.3rem 1rem 1rem; text-align:center; }
.st-tool h3 { font-size:1.2rem; } .st-tool .st-cap { margin-top:0.3rem; }
.st-tags { font-size:0.8rem; color:var(--accent-ink); margin-top:0.4rem; }
.studio .sc-band { border-top:1px solid var(--line); }
.studio .sc-final { background:var(--card); }
"""

HOME_JS = """<script>
(function () {
  var box = document.querySelector('[data-hero-chords]'); if (!box || !window.CMApp) return;
  var A = CMApp, song = JSON.parse(box.dataset.song), chords = [];
  if (song.chords && song.chords.length) chords = song.chords.slice();
  else song.sections.forEach(function (s) { s.romans.forEach(function (r) { var c = A.symbol(r, song); if (chords.indexOf(c) < 0) chords.push(c); }); });
  var row = A.$(box, '.st-chord-row'), grid = A.$(box, '.st-board-grid'), title = A.$(box, '.st-board-title'), guess = A.$(box, '.st-guess');
  var labels = ['E', 'A', 'D', 'G', 'B', 'e'], saved = {}, sym = '', frets = [];
  row.innerHTML = chords.map(function (c) { return '<button type="button" role="tab" data-chord="' + A.esc(c) + '">' + A.esc(c) + '</button>'; }).join('');
  // FretboardEditorView：每條弦一格（✕ 悶弦、○ 空弦、1–5 品），點了即時換；按「儲存」才記住，沒儲存就切走＝放棄（跟 App 按取消一樣）
  function cell(s, f, text) {
    return '<button type="button" class="st-cell' + (frets[s] === f ? ' on' : '') + '" data-s="' + s + '" data-f="' + f + '" aria-pressed="' + (frets[s] === f) +
      '" aria-label="' + A.fretLabel(labels[s], f) + '">' + text + '</button>';
  }
  function draw() {
    var html = '';
    for (var s = 5; s >= 0; s--) {
      html += '<div class="st-row"><b aria-hidden="true">' + labels[s] + '</b>' + cell(s, -1, '✕') + cell(s, 0, '○') + '<i></i>';
      for (var n = 1; n <= 5; n++) html += cell(s, n, n);
      html += '</div>';
    }
    grid.innerHTML = html; guess.innerHTML = A.guessHTML(frets, !!saved[sym]);
  }
  function show(c) {
    sym = c; frets = (saved[c] || A.frets(c, song)).slice(); title.textContent = '自訂「' + c + '」的按法';
    A.$$(row, 'button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.chord === c ? 'true' : 'false'); });
    draw();
  }
  // 和弦鈕＝App 和弦盤試聽（ChartTabView+Palette：velocity 64、0.45 秒整彈）；點格子＝單音（FretboardEditorView：playChord([note])）
  var S = window.CMAudio;
  row.addEventListener('click', function (e) {
    var b = e.target.closest('[data-chord]'); if (!b) return;
    show(b.dataset.chord); if (S.allowed()) S.frets(frets, { stagger: 0, vel: 64, dur: 0.45 });
  });
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-s]'); if (!b) return;
    var s = +b.dataset.s; frets[s] = +b.dataset.f; draw();
    if (frets[s] >= 0 && S.allowed()) S.strum([S.open(s) + frets[s]]);
    var again = A.$(grid, '[data-s="' + s + '"][data-f="' + frets[s] + '"]'); if (again) again.focus();
  });
  A.$$(box, '[data-hero-play]').forEach(function (b) {
    b.addEventListener('click', function () { if (S.allowed()) S.frets(frets, b.dataset.heroPlay === 'all' ? { stagger: 0 } : {}); });
  });
  guess.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
    if (b.dataset.act === 'save') saved[sym] = frets.slice();
    if (b.dataset.act === 'clear') delete saved[sym];
    show(sym);
  });
  if (chords.length) show(chords[0]);
})();
</script>"""
