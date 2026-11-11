"""自動示範與導覽（做法照初級大人手冊 site_v2_tour.py／site_v2_demos.py）。

- 導覽手機（data-tour）：所有歌曲 → 點進示範歌 → 靈感、錄音、編曲、和弦四個分頁依序示範 → 返回，繞一圈重來。
- 功能區塊的小手機（data-demo）：捲到時自動演一輪那個功能。
- 每一步先在要點的地方出現手指提示再點；訪客一碰手機就停，換他自己操作（分頁、按鈕都真的能用）。
- 系統開「減少動態效果」時不自動播放；選單打開時，點選單外面只會關選單（跟 iOS 一樣）。
"""

APP_RUN_JS = """<script>
(function () {
  var A = CMApp, PANE_CTL = { '靈感': 'inspiration', '錄音': 'record', '編曲': 'arrange', '和弦': 'chart' };
  function wait() { return null; }
  function guardMenus(ph) {
    ph.addEventListener('click', function (e) {
      var open = A.$(ph, '.a-menu.on'); if (!open || e.target.closest('.a-menu')) return;
      e.stopPropagation(); e.preventDefault(); A.closeMenus(ph);
    }, true);
  }
  function mountPanes(ph, view, song) {
    var ctls = {};
    A.$$(view, '.ph-pane').forEach(function (pane) { ctls[pane.dataset.pane] = A.ctl[PANE_CTL[pane.dataset.pane]](pane, ph, song); });
    return ctls;
  }
  function mountTour(ph) {
    var song = A.song(ph), gallery = A.$(ph, '[data-view="gallery"]'), view = A.$(ph, '[data-view="song"]'), tab = '靈感';
    var ctls = mountPanes(ph, view, song), more = A.moreMenu(ph, view, function () { return tab; });
    function showTab(name) {
      tab = name; A.closeMenus(ph);
      A.$$(view, '[data-tab]').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === name); b.setAttribute('aria-selected', b.dataset.tab === name); });
      A.$$(view, '.ph-pane').forEach(function (p) { p.classList.toggle('on', p.dataset.pane === name); });
    }
    function open() { gallery.classList.add('under'); view.classList.add('on'); }
    function back() { view.classList.remove('on'); gallery.classList.remove('under'); A.closeMenus(ph); }
    A.$(gallery, '[data-push="song"]').addEventListener('click', open);
    A.$(view, '[data-back]').addEventListener('click', back);
    A.$$(view, '[data-tab]').forEach(function (b) { b.addEventListener('click', function () { showTab(b.dataset.tab); }); });
    function reset() { back(); showTab('靈感'); A.sheet(more.sheet, false); Object.keys(ctls).forEach(function (k) { ctls[k].reset(); }); }
    function tabStep(name) { return function () { return A.$(view, '[data-tab="' + name + '"]'); }; }
    var steps = [function () { return A.$(gallery, '[data-push="song"]'); }, wait].concat(ctls['靈感'].steps);
    ['錄音', '編曲', '和弦'].forEach(function (name) { steps = steps.concat([tabStep(name)], ctls[name].steps); });
    steps = steps.concat([function () { return A.$(view, '[data-back]'); }, wait]);
    return { reset: reset, steps: steps };
  }
  function mountDemo(ph) {
    var kind = ph.dataset.demo;
    if (kind === 'tuner' || kind === 'metronome') return A.ctl[kind](ph);
    var song = A.song(ph), view = A.$(ph, '.ph-view'), pane = A.$(view, '.ph-pane.on'), name = pane.dataset.pane;
    var ctl = A.ctl[PANE_CTL[name]](pane, ph, song), more = A.moreMenu(ph, view, function () { return name; });
    if (kind !== 'export') return ctl;
    function item(sel) { return function () { return A.$(more.menu, sel); }; }
    return { reset: function () { ctl.reset(); A.sheet(more.sheet, false); },
      steps: [function () { return more.button; }, item('[data-do="share"]'), wait, wait, function () { return A.$(more.sheet, '[data-close]'); },
        function () { return more.button; }, item('[data-do="copy"]'), wait] };
  }
  function reveal(t) {
    var v = t.closest('.ph-scroll'); if (!v) return false;
    var r = t.getBoundingClientRect(), vr = v.getBoundingClientRect();
    if (r.top >= vr.top + 8 && r.bottom <= vr.bottom - 8) return false;
    v.scrollTo({ top: v.scrollTop + r.top - vr.top - vr.height / 2 + r.height / 2, behavior: 'smooth' }); return true;
  }
  function autoplay(ph, api) {
    var stopped = false, k = 0, timer = null;
    ph.addEventListener('pointerdown', function () { stopped = true; clearTimeout(timer); }, { once: true });
    if (A.reduce || !('IntersectionObserver' in window)) return;
    function run() {
      if (stopped) return;
      if (k === api.steps.length) { api.reset(); k = 0; timer = setTimeout(run, 1600); return; }
      var t = api.steps[k](); k++;
      if (t) setTimeout(function () { if (stopped) return; A.tap(t); setTimeout(function () { if (!stopped) window.CMAudio.quietly(function () { t.click(); }); }, 220); }, reveal(t) ? 480 : 0);
      timer = setTimeout(run, t ? 1500 : 1300);
    }
    var seen = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting && !stopped && !timer) timer = setTimeout(run, 900); });
    }, { threshold: 0.5 });
    seen.observe(ph);
  }
  function pinFrame(ph) {  // 手機外框不該捲動；被焦點或 scrollIntoView 帶動時拉回原位，sheet 才會對齊螢幕
    [A.$(ph, '.ph-screen'), A.$(ph, '.ph-stack')].concat(A.$$(ph, '.ph-view')).forEach(function (el) {
      if (el) el.addEventListener('scroll', function () { if (el.scrollTop || el.scrollLeft) { el.scrollTop = 0; el.scrollLeft = 0; } });
    });
  }
  function boot() {
    A.$$(document, '.ph[data-tour], .ph[data-demo]').forEach(function (ph) {
      guardMenus(ph); pinFrame(ph);
      var api = ph.hasAttribute('data-tour') ? mountTour(ph) : mountDemo(ph);
      if (api) autoplay(ph, api);
    });
  }
  if (!window.ChordEngine) { document.documentElement.setAttribute('data-engine', 'missing'); }
  boot();
})();
</script>"""
