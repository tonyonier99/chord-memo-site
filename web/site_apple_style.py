"""全站往 Apple 官網風格收斂（站長 2026-11-12）：最後載入，覆蓋各頁樣式。

1. 首頁不再固定深色（改在 site_home_style.py）。
2. 只用系統字：等寬字只留在指板品格數字，其他（歌曲資訊、重點條列、標籤、和弦名）改回系統字＋等寬數字。
3. 標題放大、行距收緊、段落留白加大，段落之間不畫分隔線。
4. 卡片不畫邊框，只靠底色深淺區分。
5. 按鈕字改細、拿掉外框與上浮；次要按鈕改成藍字加「›」。
"""

_BORDERLESS = (".tile, .st-chords, .st-tool, .card, .sc-final, .ph-card, .cr-form, .cr-steps li, .tp-cta, "
               ".price-row div, .tw-welcome")

APPLE_CSS = f"""
h1, h2, h3 {{ letter-spacing:-0.015em; }}
.st-copy h1, .sc-copy h1 {{ font-size:clamp(2.4rem,5.2vw,3.6rem); line-height:1.1; font-weight:700; }}
.st-copy .st-lead {{ font-size:1.12rem; max-width:30rem; }}
.st-flow {{ font-size:clamp(1.6rem,3.4vw,2.4rem) !important; }}
.st-flow span {{ white-space:nowrap; }}
/* 首屏和弦卡：拿掉卡中卡的灰底、縮小，「看起來像／儲存」那排（App 編輯器的存檔控制）不放，整張一屏看得完 */
.st-chords {{ padding:1.2rem 1.2rem 1rem; box-shadow:0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06); }}
.st-board {{ background:none; padding:0.4rem 0 0; }}
.st-chord-row button {{ min-height:46px; font-size:1.15rem; font-weight:600; }}
/* 站長 11-12「頭重腳輕」：和弦鈕改成小的分段選擇、指板放大、整張置中 */
.st-chords {{ text-align:center; }}
.st-chord-row {{ display:inline-grid; grid-template-columns:repeat(4,minmax(56px,72px)); gap:4px; padding:4px; margin:0.9rem auto 0.6rem;
  background:var(--fill); border-radius:14px; }}
.st-chord-row button {{ min-height:38px; font-size:1rem; border-radius:10px; background:none; }}
.st-chord-row button[aria-selected="true"] {{ background:#fff; color:var(--accent-ink); box-shadow:0 1px 3px rgba(0,0,0,.12); }}
.st-board-title {{ text-align:center; margin:0.4rem 0 0.8rem; }}
.st-cell {{ width:34px; height:34px; font-size:0.85rem; }}
.st-row {{ gap:6px; }} .st-board-grid {{ gap:6px; }}
@media (max-width:420px) {{ .st-cell {{ width:28px; height:28px; }} .st-row {{ gap:4px; }} }}
/* 站長 11-13：「看起來像」＋儲存要露出來（這就是記下獨特和弦的賣點），置中排在指板下面 */
.st-try {{ font-size:1.25rem; font-weight:700; text-align:center; }}
.st-chords > .st-cap {{ text-align:center; max-width:24rem; margin:0.3rem auto 0.9rem; }}
.st-chords .st-board-title {{ display:none; }}
.st-chords .st-board {{ padding:1rem 0.8rem 0.9rem; }}
.st-result {{ display:flex; align-items:center; justify-content:space-between; gap:0.8rem; margin-top:0.9rem; padding:0.85rem 0.3rem 0;
  border-top:1px solid var(--line); }}
.st-result .st-guess {{ display:grid; gap:0.05rem; margin:0; min-width:0; text-align:left; align-content:start;
  min-height:6rem; }}  /* 站長 11-13：結果列高度固定，換和弦時卡片不變高，左邊主標題才不會跟著飄 */
@media (max-width:520px) {{ .st-result .st-guess {{ min-height:8.2rem; }} }}
.st-guess small {{ color:var(--sub); font-size:0.8rem; }}
.st-guess b {{ font-size:1.7rem; line-height:1.15; color:var(--accent-ink); font-variant-numeric:tabular-nums; }}
.st-guess .st-alt {{ color:var(--sub); font-size:0.8rem; line-height:1.4; }}
.st-guess .st-reset {{ justify-self:start; border:0; background:none; padding:0; margin-top:0.15rem; color:var(--accent-ink); font-size:0.8rem; cursor:pointer; }}
.st-acts {{ display:flex; align-items:center; gap:8px; flex:none; }}
.st-acts button[data-hero-play] {{ width:40px; height:40px; border-radius:50%; border:0; background:var(--accent-soft); color:var(--accent);
  display:flex; align-items:center; justify-content:center; font-size:1.05rem; cursor:pointer; }}
.st-save {{ height:40px; padding:0 18px; border:0; border-radius:999px; background:var(--accent); color:#fff; font-weight:600; cursor:pointer; }}
.st-save:disabled {{ background:var(--fill); color:var(--sub); cursor:default; }}
.st-copy .st-eyebrow {{ display:flex; align-items:baseline; gap:0.6rem; font-size:1rem; color:var(--sub); }}
.st-copy .st-num {{ font-size:1rem; font-weight:600; color:var(--record); font-variant-numeric:tabular-nums; }}
.st-tool {{ padding:1.8rem 1.2rem 1.2rem; }}
.st-tool .st-cap {{ font-size:0.95rem; min-height:3.2em; margin:0.4rem auto 0; max-width:22rem; }}
.st-tools .ph-card {{ padding-top:0.6rem; }}
.st-copy h2, .st-head h2, .sc-copy h2, .sc-sec-head h2 {{ font-size:clamp(2rem,5vw,3.2rem); line-height:1.15; font-weight:700; }}
.st-copy h2 {{ font-size:clamp(1.8rem,3.6vw,2.6rem); }}
h1, h2 {{ text-wrap:balance; }}
.st-lead, .sc-lead {{ font-size:clamp(1.05rem,1.6vw,1.25rem); line-height:1.65; }}
.st-band, .sc-band {{ padding:clamp(4rem,9vw,7rem) 0; border-top:0; }}
.studio .sc-band {{ border-top:0; }}
.st-hero {{ padding:clamp(3rem,8vw,6rem) 0; border-bottom:0; }}
.st-steps {{ padding-top:clamp(3rem,8vw,6rem); }}
.st-step {{ border-top:0; padding:clamp(2.6rem,6vw,4.5rem) 0; }}
{_BORDERLESS} {{ border-color:transparent; }}
a.tile:hover {{ transform:none; box-shadow:none; border-color:transparent; }}
.st-mono, .st-points li, .st-tags, .st-chord-row button {{ font-family:inherit; font-variant-numeric:tabular-nums; }}
.st-eyebrow, .sc-eyebrow, .tile .t-eyebrow {{ font-weight:600; letter-spacing:0; }}
.site-nav a {{ font-weight:400; font-size:0.88rem; }}
.logo {{ font-weight:600; }}
.nav-cta {{ font-weight:500; font-size:0.82rem; padding:0.32rem 0.9rem; }}
.btn {{ font-weight:500; font-size:1.02rem; min-height:44px; padding:0 1.4rem; border:0; }}
.btn:hover {{ transform:none; filter:brightness(1.08); }}
.btn.ghost {{ min-height:44px; padding:0 0.4rem; background:none; }}
.btn.ghost::after {{ content:"\\00a0›"; }}
.btn.ghost:hover {{ text-decoration:underline; filter:none; }}
.tile li {{ font-weight:500; }}
.tile .t-more {{ font-weight:500; }}
"""
