"""和弦（和弦譜）分頁的互動：照 ChartTabView／ChartTabView+Sections／ChartTabView+Editing／FretboardEditorView／ChordProExport。

- 段落與和弦：示範歌的羅馬級數用 App 和弦引擎（extendChord）換成和弦名；每列 4 小節（BarChartModel.rows：min(beatsPerBar, 4)）。
- 點小節 → 選單（從這裡播放／改按法／自訂按法…／清空小節）；改按法 → 「編輯按法」表單，指板按法由引擎算（MusicEngine.startingFingering）。
- 段落「⋯」→ 上移／下移／刪除段落；底部「加入段落」→ 選段名、4 小節（SectionOps.defaultBars）。
- 右上「⋯」→ 分享整份譜（圖片）／分享 ChordPro 文字／複製為 ChordPro／整理段落＋工具（OthersView.swift）。
"""

APP_CHART_JS = """<script>
(function () {
  var A = CMApp;
  var KIND = { '主歌': 'verse', '副歌': 'chorus', '橋段': 'bridge', '前奏': 'intro', '尾奏': 'outro', '間奏': 'solo', '導歌': 'prechorus' };
  var ZH = { verse: '主歌', chorus: '副歌', bridge: '橋段', intro: '前奏', outro: '尾奏', solo: '間奏', prechorus: '導歌' };
  // ChordProExport：檔頭、段落指令、一列一行（有歌詞就把和弦依拍位比例插進歌詞）
  A.chordPro = function (song, sections) {
    var out = ['{title: ' + song.name + '}', '{key: ' + song.key + (song.mode === 'minor' ? 'm' : '') + '}', '{time: 4/4}', '{tempo: ' + song.bpm + '}'];
    sections.forEach(function (s) {
      var lines = [];
      for (var r = 0; r * 4 < s.bars.length; r++) {
        var cells = s.bars.slice(r * 4, r * 4 + 4), lyric = (s.lyrics[r] || '').trim(), chars = Array.from(lyric), ins = {};
        if (!lyric) { var only = cells.filter(Boolean).map(function (c) { return '[' + c + ']'; }).join(' '); if (only) lines.push(only); continue; }
        cells.forEach(function (c, b) { if (!c) return; var at = Math.min(chars.length - 1, Math.floor(b * chars.length / cells.length)); ins[at] = (ins[at] || '') + '[' + c + ']'; });
        lines.push(chars.map(function (ch, i) { return (ins[i] || '') + ch; }).join(''));
      }
      if (!lines.length) return;
      var k = KIND[s.name] || s.kind || 'verse', env = k === 'verse' || k === 'chorus' || k === 'bridge';
      out.push('');
      out.push(env ? '{start_of_' + k + ': ' + s.name + '}' : '{comment: ' + s.name + '}');
      out = out.concat(lines);
      if (env) out.push('{end_of_' + k + '}');
    });
    return out.join('\\n') + '\\n';
  };
  function fretboard(box, frets, base) {
    var labels = ['E', 'A', 'D', 'G', 'B', 'e'], rows = [];
    for (var s = 5; s >= 0; s--) {
      var one = function (f, text) { return '<button type="button" class="fc' + (frets[s] === f ? ' on' : '') + '" data-s="' + s + '" data-f="' + f + '" aria-pressed="' + (frets[s] === f) + '" aria-label="' + A.fretLabel(labels[s], f) + '">' + text + '</button>'; };
      var cells = one(-1, '✕') + one(0, '○') + '<i></i>';
      for (var f = base; f < base + 5; f++) cells += one(f, f);
      rows.push('<div class="fret-row"><b>' + labels[s] + '</b>' + cells + '</div>');
    }
    box.innerHTML = '<div class="fret-pos"><button type="button" data-pos="-1"' + (base <= 1 ? ' disabled' : '') + ' aria-label="往低把位">' + A.ic('chevron.left') + '</button><div><b>第 ' + base + ' 品</b><span>' + base + '–' + (base + 4) +
      ' 品</span></div><button type="button" data-pos="1"' + (base >= 15 ? ' disabled' : '') + ' aria-label="往高把位">' + A.ic('chevron.right') + '</button></div>' + rows.join('') +
      '<div class="fret-pills"><button type="button" class="a-chip" data-act="audition" style="color:var(--a-accent);background:var(--a-accent-fill)">' + A.ic('play.circle.fill') + '試聽整個和弦</button>' +
      '<button type="button" class="a-chip" data-act="strum-each" style="color:var(--a-accent);background:var(--a-accent-fill)">' + A.ic('arrow.down.to.line') + '一弦一弦彈</button></div>';
  }
  A.ctl.chart = function (pane, ph, song) {
    var list = A.$(pane, '[data-sections]'), barMenu = A.$(pane, '[data-menu="bar"]'), secMenu = A.$(pane, '[data-menu="section"]');
    var fretSheet = A.$(pane, '[data-sheet="fret"]'), addSheet = A.$(pane, '[data-sheet="add"]'), board = A.$(pane, '[data-fretboard]');
    var sections, cursor = null, secAt = -1, frets = [], base = 1, preset = '主歌', custom = {}, editing = '';
    var S = window.CMAudio, player = A.chartPlayer(pane, function () { return sections; }, function (sym) { return custom[sym] || A.frets(sym, song); }, song);
    var guess = A.$(fretSheet, '[data-fret-guess]'), saveBtn = A.$(fretSheet, '[data-act="save-fret"]');
    function refreshGuess() { guess.innerHTML = A.guessHTML(frets); var g = A.$(guess, '.fg-actions'); if (g) g.remove(); saveBtn.disabled = !A.hasSound(frets); }
    function initial() {
      return song.sections.map(function (s) {
        return { name: s.name || ZH[s.kind] || '主歌', kind: s.kind, bars: s.romans.map(function (r) { return A.symbol(r, song); }), lyrics: s.lyrics.slice() };
      });
    }
    function render() {
      list.innerHTML = sections.map(function (s, si) {
        var rows = '';
        for (var r = 0; r * 4 < Math.max(s.bars.length, 1); r++) {
          var cells = '';
          for (var b = r * 4; b < r * 4 + 4; b++) {
            if (b >= s.bars.length) { cells += '<span></span>'; continue; }
            var c = s.bars[b], sel = cursor && cursor[0] === si && cursor[1] === b;
            cells += '<button type="button" class="bar' + (c ? '' : ' empty') + (sel ? ' sel' : '') + '" data-bar="' + si + ':' + b + '">' + (c ? A.esc(c) : A.ic('plus')) + '</button>';
          }
          var ly = s.lyrics[r];
          rows += '<div class="bars">' + cells + '</div><div class="lyric' + (ly ? '' : ' ph-empty') + '">' + A.esc(ly || '點一下寫詞…') + '</div>';
        }
        return '<div class="sec"><div class="sec-head"><b>' + A.esc(s.name) + '</b><span class="chev">' + A.ic('chevron.down') + '</span>' +
          '<button type="button" class="a-link">' + A.ic('text.quote') + '歌詞</button>' +
          '<button type="button" class="more" data-sec="' + si + '" aria-label="' + A.esc(s.name) + '段落選項">' + A.ic('ellipsis') + '</button></div>' + rows +
          '<div class="sec-chips"><button type="button" class="a-chip" data-addbar="' + si + '">' + A.ic('plus') + '小節</button>' +
          '<button type="button" class="a-chip">' + A.ic('plus') + '歌詞</button></div></div>';
      }).join('');
    }
    function openFret() {
      var sym = sections[cursor[0]].bars[cursor[1]];
      A.$(fretSheet, '[data-fret-title]').textContent = '自訂「' + sym + '」的按法';
      editing = sym; frets = (custom[sym] || A.frets(sym, song)).slice(); base = 1; fretboard(board, frets, base); refreshGuess();
      A.closeMenus(ph); A.sheet(fretSheet, true);
    }
    list.addEventListener('click', function (e) {
      var bar = e.target.closest('[data-bar]'), more = e.target.closest('[data-sec]'), plus = e.target.closest('[data-addbar]');
      if (bar) {
        cursor = bar.dataset.bar.split(':').map(Number); render();
        var has = !!sections[cursor[0]].bars[cursor[1]];
        A.$(barMenu, '[data-act="fingering"]').style.display = has ? '' : 'none';
        A.$(barMenu, '[data-act="clear-bar"]').style.display = has ? '' : 'none';
        A.openMenu(barMenu, A.$(list, '[data-bar="' + cursor.join(':') + '"]'));
      } else if (more) {
        secAt = +more.dataset.sec;
        A.$(secMenu, '[data-act="up"]').classList.toggle('off', secAt === 0);
        A.$(secMenu, '[data-act="down"]').classList.toggle('off', secAt === sections.length - 1);
        A.$(secMenu, '[data-act="delete"]').classList.toggle('off', sections.length === 1);
        A.openMenu(secMenu, more);
      } else if (plus) { sections[+plus.dataset.addbar].bars.push(null); render(); }
    });
    barMenu.addEventListener('click', function (e) {
      var act = e.target.closest('button'); if (!act) return;
      if (act.dataset.act === 'fingering') { openFret(); return; }
      if (act.dataset.act === 'play-from') player.start(cursor.join(':'));
      if (act.dataset.act === 'clear-bar') { sections[cursor[0]].bars[cursor[1]] = null; render(); }
      A.closeMenus(ph);
    });
    secMenu.addEventListener('click', function (e) {
      var act = e.target.closest('button'); if (!act || act.classList.contains('off')) return;
      var to = act.dataset.act === 'up' ? secAt - 1 : secAt + 1;
      if (act.dataset.act === 'delete') sections.splice(secAt, 1);
      else { var moved = sections.splice(secAt, 1)[0]; sections.splice(to, 0, moved); }
      cursor = null; A.closeMenus(ph); render();
    });
    board.addEventListener('click', function (e) {
      var cell = e.target.closest('[data-s]'), pos = e.target.closest('[data-pos]'), pill = e.target.closest('[data-act]');
      if (cell) { frets[+cell.dataset.s] = +cell.dataset.f; fretboard(board, frets, base); refreshGuess(); }
      // 點格子＝單音；「試聽整個和弦」＝整彈；「一弦一弦彈」＝低→高每弦隔 0.04 秒（FretboardEditorView.swift）
      if (cell && +cell.dataset.f >= 0 && S.allowed()) S.strum([S.open(+cell.dataset.s) + +cell.dataset.f]);
      if (pill && S.allowed()) S.frets(frets, pill.dataset.act === 'audition' ? { stagger: 0 } : {});
      if (pos && !pos.disabled) { base = Math.min(15, Math.max(1, base + +pos.dataset.pos)); fretboard(board, frets, base); }
    });
    A.$$(fretSheet, '[data-close]').forEach(function (b) { b.addEventListener('click', function () { A.sheet(fretSheet, false); }); });
    // 儲存＝記成這首歌這顆和弦的自訂按法（下次打開沿用）；清除自訂＝改回引擎算的預設按法（FretboardEditorView onSave／onClear）
    saveBtn.addEventListener('click', function () { if (!A.hasSound(frets)) return; custom[editing] = frets.slice(); A.sheet(fretSheet, false); });
    A.$(fretSheet, '[data-act="clear-fret"]').addEventListener('click', function () { delete custom[editing]; A.sheet(fretSheet, false); });
    A.$(pane, '[data-act="add-section"]').addEventListener('click', function () { preset = '主歌'; markPreset(); A.sheet(addSheet, true); });
    function markPreset() { A.$$(addSheet, '[data-preset]').forEach(function (b) { b.classList.toggle('on', b.dataset.preset === preset); }); }
    A.$$(addSheet, '[data-preset]').forEach(function (b) { b.addEventListener('click', function () { preset = b.dataset.preset; markPreset(); }); });
    A.$(addSheet, '[data-close]').addEventListener('click', function () { A.sheet(addSheet, false); });
    A.$(addSheet, '[data-act="add-confirm"]').addEventListener('click', function () {
      sections.push({ name: preset, kind: KIND[preset], bars: [null, null, null, null], lyrics: [] });
      A.sheet(addSheet, false); render();
      var view = pane.querySelector('.ph-scroll'); setTimeout(function () { view.scrollTo({ top: view.scrollHeight, behavior: 'smooth' }); }, 50);
    });
    A.$(pane, '[data-act="play-all"]').addEventListener('click', function () { player.toggle(); });
    function reset() {
      player.stop(); sections = initial(); cursor = null; custom = {}; A.sheet(fretSheet, false); A.sheet(addSheet, false); A.closeMenus(ph); render();
      A.$(pane, '.ph-scroll').scrollTop = 0;
    }
    reset();
    pane._chart = { sections: function () { return sections; } };
    function wait() { return null; }
    function barAt(i) { return function () { return A.$(list, '[data-bar="0:' + i + '"]'); }; }
    return { reset: reset, steps: [barAt(1), function () { return A.$(barMenu, '[data-act="fingering"]'); }, wait, wait,
      function () { return A.$(fretSheet, '[data-close]'); }, barAt(3), function () { return A.$(barMenu, '[data-act="fingering"]'); }, wait,
      function () { return A.$(fretSheet, '[data-close]'); }, function () { return A.$(pane, '[data-act="add-section"]'); },
      function () { return A.$(addSheet, '[data-preset="副歌"]'); }, function () { return A.$(addSheet, '[data-act="add-confirm"]'); }, wait,
      function () { return A.$(list, '[data-sec="1"]'); }, function () { return A.$(secMenu, '[data-act="up"]'); }, wait] };
  };
  // 右上「⋯」：和弦分頁有分享與整理段落，各分頁都有工具（OthersView.swift）
  A.moreMenu = function (ph, view, getTab) {
    var btn = A.$(view, '[data-act="more"]'); if (!btn) return null;
    var menu = document.createElement('div'); menu.className = 'a-menu'; menu.dataset.menu = 'more'; view.appendChild(menu);
    var sheet = document.createElement('div'); sheet.className = 'a-sheet'; view.appendChild(sheet);
    sheet.innerHTML = '<div class="a-sheet-bar"><span style="width:44px"></span><b>分享 ChordPro 文字</b><button type="button" class="a-link" data-close>完成</button></div>' +
      '<div class="ph-scroll"><pre class="a-card" style="padding:12px;font-size:11.5px;white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace" data-pro-text></pre></div>';
    A.$(sheet, '[data-close]').addEventListener('click', function () { A.sheet(sheet, false); });
    function text() { var pane = A.$(view, '[data-pane="和弦"]'); return A.chordPro(A.song(ph), pane._chart.sections()); }
    btn.addEventListener('click', function () {
      var chart = getTab() === '和弦';
      function item(label, sf, attrs) { return '<button type="button" ' + (attrs || 'data-close') + '><span>' + label + '</span>' + A.ic(sf) + '</button>'; }
      // 「分享」子選單（OthersView.swift）攤平成三列；調音器的 tuningfork 沒有 Phosphor 對應，不放圖示
      menu.innerHTML = (chart ? item('分享整份譜（圖片）', 'photo') + item('分享 ChordPro 文字', 'doc.plaintext', 'data-do="share"') +
        item('複製為 ChordPro', 'doc.on.doc', 'data-do="copy"') + item('整理段落', 'list.bullet.indent') + item('這首歌的和弦', 'music.quarternote.3') : '') +
        '<button type="button" class="off">工具</button>' + item('和弦櫃', 'books.vertical') + item('節拍器', 'metronome') + item('調音器', '');
      A.openMenu(menu, btn);
    });
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.classList.contains('off')) return;
      A.closeMenus(ph);
      if (b.dataset.do === 'copy') A.toast(ph, '已複製為 ChordPro');
      if (b.dataset.do === 'share') { A.$(sheet, '[data-pro-text]').textContent = text(); A.sheet(sheet, true); }
    });
    return { menu: menu, sheet: sheet, button: btn };
  };
})();
</script>"""
