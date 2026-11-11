"""範本庫樣式。尺寸照 App：精選大卡封面圓角 14、橫排封面圓角 10、詳情封面最大 360 圓角 12、左右邊距 20
（ArtistTemplateShelfLayout.swift、ArtistTemplateArtwork.swift）；沒封面＝灰底中間 music.note。
網頁版用網站色票，示範手機版（.ts-app）換成 App 色票。
"""

BASE_CSS = """
.ts-wall { --ts-card:var(--card); --ts-sub:var(--sub); --ts-ink:var(--ink); --ts-acc:var(--accent); --ts-line:var(--line); }
.ts-app { --ts-card:var(--a-card); --ts-sub:var(--a-sub); --ts-ink:var(--a-label); --ts-acc:var(--a-accent); --ts-line:var(--a-fill);
  padding:4px 14px 16px; }
.ts-app-title { font-size:26px; font-weight:800; padding-top:6px; }
.ts-sub { color:var(--ts-sub); margin:0.3rem 0 1rem; line-height:1.6; }
.ts-app .ts-sub { font-size:12.5px; margin:2px 0 10px; }
.ts-feat, .ts-card { border:0; background:none; padding:0; font:inherit; color:var(--ts-ink); text-align:left; cursor:pointer; }
.ts-feat { position:relative; display:block; width:100%; max-width:520px; border-radius:14px; overflow:hidden; }
.ts-feat .ts-cv { width:100%; aspect-ratio:1; display:block; object-fit:cover; }
.ts-glass { position:absolute; left:0; right:0; bottom:0; padding:0.9rem 1rem; display:grid; gap:0.15rem; justify-items:start;
  background:rgba(30,30,30,.55); -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px); color:#fff; }
/* 精選輪播：一次只顯示一張（ts-feat.on），底下圓點切換 */
.ts-carousel .ts-feat { display:none; } .ts-carousel .ts-feat.on { display:block; }
@media (min-width:640px) { .ts-wall .ts-carousel .ts-feat.on { display:grid; } }
.ts-dots { display:flex; justify-content:center; gap:8px; margin-top:0.7rem; }
.ts-dots button { width:8px; height:8px; padding:0; border:0; border-radius:50%; background:var(--fill); cursor:pointer; }
.ts-dots button[aria-current] { background:var(--ink); }
/* 站長 2026-11-12：網頁版精選卡比其他範本大太多 → 寬螢幕改成橫的：左邊封面跟一般卡同級、右邊文字 */
@media (min-width:640px) {
  .ts-wall .ts-feat { display:grid; grid-template-columns:200px minmax(0,1fr); max-width:none; background:var(--card); border-radius:20px; }
  .ts-wall .ts-feat .ts-cv { width:200px; height:200px; }
  .ts-wall .ts-glass { position:static; background:none; color:var(--ink); -webkit-backdrop-filter:none; backdrop-filter:none;
    padding:1.4rem 1.6rem; align-content:center; }
  .ts-wall .ts-glass small { color:var(--sub); opacity:1; }
  .ts-wall .ts-glass .ts-badge { color:var(--accent-ink); background:var(--accent-soft); }
}
.ts-glass small { font-size:0.75rem; opacity:.8; } .ts-glass strong { font-size:1.35rem; line-height:1.25; }
.ts-glass > span:not(.ts-badge) { opacity:.85; font-size:0.9rem; }
.ts-app .ts-glass { padding:8px 10px; } .ts-app .ts-glass strong { font-size:16px; } .ts-app .ts-glass > span:not(.ts-badge) { font-size:11.5px; }
.ts-badge { display:inline-block; font-size:0.7rem; font-weight:600; padding:0.1rem 0.5rem; border-radius:999px; margin-top:0.2rem;
  color:var(--ts-acc); background:color-mix(in srgb, var(--ts-acc) 16%, transparent); }
.ts-glass .ts-badge { color:#fff; background:rgba(255,255,255,.2); }
.ts-more h3 { font-size:1.35rem; font-weight:800; margin:1.4rem 0 0.6rem; }
.ts-app .ts-more h3 { font-size:17px; margin:14px 0 8px; }
.ts-row { display:flex; gap:0.9rem; overflow-x:auto; scroll-snap-type:x mandatory; padding-bottom:0.6rem; }
.ts-card { flex:none; width:176px; display:grid; gap:0.1rem; justify-items:start; scroll-snap-align:start; }
.ts-app .ts-card { width:118px; }
.ts-card .ts-cv { width:100%; aspect-ratio:1; border-radius:10px; object-fit:cover; margin-bottom:0.35rem; }
.ts-card strong { font-size:0.92rem; font-weight:600; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ts-card > span:not(.ts-badge) { font-size:0.8rem; color:var(--ts-sub); }
.ts-app .ts-card strong { font-size:12.5px; } .ts-app .ts-card > span:not(.ts-badge) { font-size:11px; }
.ts-slot { text-decoration:none; } .ts-slot:hover { text-decoration:none; } .ts-slot > span:last-child { color:var(--accent-ink) !important; }
.ts-ph { display:flex; align-items:center; justify-content:center; background:var(--ts-card); color:var(--ts-sub); font-size:2rem;
  box-shadow:inset 0 0 0 0.5px var(--ts-line); }
.ts-feat .ts-ph { font-size:3.5rem; } .ts-card > span.ts-ph { font-size:2.6rem; color:var(--ts-sub); }
.ts-app .ts-card > span.ts-ph { font-size:1.8rem; }
.ts-dlg { margin:auto; border:0; padding:0 20px 1.6rem; width:min(560px, 100vw); max-height:92vh; border-radius:20px;
  background:var(--card); color:var(--ink); }
.ts-dlg::backdrop { background:rgba(0,0,0,.55); }
.ts-close { flex:none; border:0; background:var(--fill); color:var(--ink); width:2rem; height:2rem; border-radius:50%;
  display:flex; align-items:center; justify-content:center; font-size:1.1rem; cursor:pointer; }
.ts-detail { display:grid; gap:0.35rem; } .ts-detail[hidden], .ts-err[hidden] { display:none; }
.ts-big { width:min(360px, 78%); aspect-ratio:1; border-radius:12px; object-fit:cover; box-shadow:0 10px 30px rgba(0,0,0,.35);
  margin:0.4rem 0 0.8rem; font-size:4rem; --ts-card:var(--fill); --ts-sub:var(--sub); --ts-line:var(--line); }
.ts-detail h3 { font-size:1.5rem; font-weight:800; line-height:1.3; }
.ts-artist { color:var(--accent); font-size:1.15rem; font-weight:600; }
.ts-fine { color:var(--sub); font-size:0.82rem; line-height:1.6; } .ts-dim { opacity:.7; }
.ts-btns { display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; margin:0.7rem 0 0.2rem; }
.ts-play, .ts-dl { display:flex; align-items:center; justify-content:center; gap:0.4rem; border-radius:12px; padding:0.7rem 0.5rem;
  font:inherit; font-weight:700; font-size:0.95rem; cursor:pointer; text-decoration:none; }
.ts-play { border:1px solid var(--line); background:var(--fill); color:var(--accent); }
.ts-play:disabled { opacity:.45; cursor:default; }
.ts-dl { border:0; background:var(--accent); color:var(--on-accent); }
.ts-err { color:#FF453A; font-size:0.82rem; }
.ts-blk { margin-top:1rem; } .ts-blk h4 { font-size:1.1rem; font-weight:800; margin-bottom:0.5rem; }
.ts-tags { display:flex; flex-wrap:wrap; gap:0.4rem; }
.ts-tags span { font-size:0.8rem; padding:0.25rem 0.7rem; border-radius:999px; background:var(--fill); color:var(--ink); }
.ts-link { display:flex; justify-content:space-between; align-items:center; padding:0.7rem 0; border-bottom:1px solid var(--line);
  color:var(--ink); text-decoration:none; font-weight:600; } .ts-link .ic { color:var(--sub); }
.ts-blk .ts-fine { margin-top:0.5rem; }
@media (max-width:600px) { .ts-dlg { width:100vw; max-width:100vw; max-height:94vh; margin:auto 0 0; border-radius:20px 20px 0 0; }
  .ts-card { width:150px; } }
"""
