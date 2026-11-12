"""動畫：捲動淡入（App 示範手機的互動在 site_app_js*.py）。

系統開啟「減少動態效果」時不淡入。MOTION_CSS 裡的跑馬燈樣式仍會輸出（產生跑馬燈 HTML 的函式已拿掉）。
"""

MOTION_CSS = """
html.js [data-reveal] { opacity:0; transform:translateY(18px); transition:opacity .6s ease, transform .6s ease; }
html.js [data-reveal].in { opacity:1; transform:none; }
.marquee { overflow:hidden; border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:var(--card);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent); }
.marquee-track { display:flex; width:max-content; animation:marquee 38s linear infinite; }
.marquee-track span { padding:0.95rem 1.4rem; font-weight:700; color:var(--sub); white-space:nowrap; position:relative; }
.marquee-track span::after { content:""; position:absolute; right:-3px; top:50%; width:6px; height:6px; margin-top:-3px;
  border-radius:50%; background:var(--accent); opacity:.55; }
@keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
@media (prefers-reduced-motion:reduce) {
  html.js [data-reveal] { opacity:1; transform:none; transition:none; }
  .marquee-track { animation:none; flex-wrap:wrap; width:auto; }
  .marquee-track span[aria-hidden] { display:none; }
}
"""

MOTION_JS = """<script>
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();
</script>"""
