"""網頁重畫的 App 畫面樣式（手機外框、導覽列、分頁列、各分頁元件）。

色彩照 App Theme.swift（純 Apple 系統色）：強調色 systemBlue、錄音紅 systemRed、頁底 systemGroupedBackground、
卡片 secondarySystemGroupedBackground、小填色 tertiarySystemFill、文字 label／secondaryLabel、分隔線 separator。
跟著網頁的淺色／深色切換（App 本身也是系統色自動適配）。
圖示：SF Symbols 換成 Phosphor Icons（site_icons.py 對照表；擺法與大小在 site_app_css_icons.py）。
"""

APP_CSS = """
.ph { --a-bg:#F2F2F7; --a-card:#FFFFFF; --a-elevated:#FFFFFF; --a-scrim:rgba(0,0,0,0.25); --a-fill:rgba(118,118,128,0.12); --a-label:#000; --a-sub:rgba(60,60,67,0.6);
  --a-accent:#007AFF; --a-accent-fill:rgba(0,122,255,0.15); --a-red:#FF3B30; --a-green:#34C759; --a-hair:rgba(60,60,67,0.29);
  position:relative; z-index:1; width:min(300px,84vw); height:600px; border-radius:46px; background:#1C1C1E; padding:10px;
  box-shadow:0 24px 50px rgba(0,30,80,0.22), inset 0 0 0 2px #3A3A3C; flex:none; }
@media (prefers-color-scheme:dark) {
  .ph { --a-bg:#000; --a-card:#1C1C1E; --a-elevated:#2C2C2E; --a-scrim:rgba(0,0,0,0.55); --a-fill:rgba(118,118,128,0.24); --a-label:#FFF; --a-sub:rgba(235,235,245,0.6);
    --a-accent:#0A84FF; --a-accent-fill:rgba(10,132,255,0.2); --a-red:#FF453A; --a-green:#30D158; --a-hair:rgba(84,84,88,0.6); }
}
.ph-screen { position:relative; width:100%; height:100%; border-radius:37px; background:var(--a-bg); overflow:hidden; overflow:clip;
  display:flex; flex-direction:column; color:var(--a-label); font-size:14px; line-height:1.4; text-align:left; }
:where(.ph) button { font-family:inherit; color:inherit; }
.ph-status { height:34px; flex:none; padding:11px 26px 0; font-size:12px; font-weight:700; }
.ph-stack { position:relative; flex:1; overflow:hidden; overflow:clip; }
.ph-view { position:absolute; inset:0; display:flex; flex-direction:column; background:var(--a-bg);
  transform:translateX(105%); transition:transform .45s cubic-bezier(.2,.8,.2,1); }
.ph-view.on { transform:none; } .ph-view.on.under { transform:translateX(-28%); }
.ph-scroll { flex:1; overflow-y:auto; overflow-x:hidden; padding:4px 14px 14px; scrollbar-width:none; position:relative; }
.ph-scroll::-webkit-scrollbar { display:none; }
.ph-nav { flex:none; display:flex; align-items:center; gap:8px; padding:2px 12px 6px; }
.ph-nav b { flex:1; text-align:center; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ph-circle { width:32px; height:32px; border-radius:50%; border:0; background:var(--a-card); font-size:18px; line-height:32px;
  padding:0; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.08); flex:none; }
.ph-large { font-size:26px; font-weight:800; margin:2px 2px 8px; }
.ph-tabs { flex:none; display:grid; grid-template-columns:repeat(4,1fr); gap:2px; margin:0 12px 14px; padding:4px;
  border-radius:999px; background:var(--a-card); box-shadow:0 2px 10px rgba(0,0,0,0.1); }
.ph-tabs button { border:0; background:none; border-radius:999px; padding:9px 0; font-size:11.5px; font-weight:700; color:var(--a-sub); cursor:pointer; }
.ph-tabs button.on { background:var(--a-fill); color:var(--a-accent); }
.ph-pane { display:none; flex:1; min-height:0; flex-direction:column; } .ph-pane.on { display:flex; }
.a-card { background:var(--a-card); border-radius:16px; }
.a-sec { font-size:11px; font-weight:700; color:var(--a-sub); letter-spacing:1px; margin:12px 4px 6px; }
.a-search { display:block; width:100%; border:0; border-radius:10px; background:var(--a-fill); color:var(--a-sub); padding:8px 10px; font-size:13px; margin-bottom:10px; text-align:left; }
.a-row { display:flex; align-items:center; gap:10px; width:100%; border:0; padding:10px; text-align:left; cursor:pointer; }
.a-row .ico { width:36px; height:36px; border-radius:10px; background:var(--a-fill); flex:none; }
.a-row .ico.fill { background:var(--a-accent); }
.a-row small { display:block; font-size:11px; color:var(--a-sub); }
.a-row span { display:block; font-size:13.5px; }
.a-row .muted { color:var(--a-sub); }
.a-row .chev { margin-left:auto; color:var(--a-sub); font-size:16px; }
.a-stack { display:grid; gap:8px; }
.a-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.a-songcard { border:0; padding:0; text-align:left; cursor:pointer; background:none; }
.a-songcard .cover { aspect-ratio:1; border-radius:14px; background:var(--a-fill); }
.a-songcard strong { display:block; font-size:13px; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.a-songcard em { font-style:normal; font-size:10.5px; color:var(--a-sub); font-weight:700; }
.a-pill { display:inline-block; font-size:10.5px; font-weight:700; padding:1px 7px; border-radius:999px; background:var(--a-fill); color:var(--a-sub); }
.a-pro { display:inline-block; font-size:10px; font-weight:800; padding:1px 6px; border-radius:999px; background:var(--a-accent); color:#fff; }
.a-seg { display:grid; grid-template-columns:1fr 1fr; background:var(--a-fill); border-radius:9px; padding:2px; margin:8px 0; }
.a-seg button { border:0; background:none; border-radius:7px; padding:5px 0; font-size:12px; font-weight:600; cursor:pointer; }
.a-seg button.on { background:var(--a-card); box-shadow:0 1px 3px rgba(0,0,0,0.12); }
.a-chip { border:0; border-radius:999px; background:var(--a-fill); color:var(--a-sub); font-size:11.5px; font-weight:700; padding:4px 10px; cursor:pointer; }
.a-btn { border:0; border-radius:999px; background:var(--a-accent); color:#fff; font-weight:700; font-size:14px; padding:12px 0; width:100%; cursor:pointer; }
.a-btn.soft { background:var(--a-accent-fill); color:var(--a-accent); }
.a-link { border:0; background:none; color:var(--a-accent); font-weight:700; font-size:13px; padding:0; cursor:pointer; }
.a-toast { position:absolute; left:50%; bottom:76px; transform:translate(-50%,10px); background:rgba(40,40,40,0.92); color:#fff;
  font-size:12px; font-weight:700; padding:7px 14px; border-radius:999px; opacity:0; transition:opacity .3s, transform .3s; pointer-events:none; white-space:nowrap; z-index:6; }
.a-toast.on { opacity:1; transform:translate(-50%,0); }
.a-menu { position:absolute; z-index:7; min-width:160px; background:var(--a-card); border-radius:14px; padding:4px 0;
  box-shadow:0 10px 30px rgba(0,0,0,0.22); display:none; }
.a-menu.on { display:block; animation:popIn .2s ease-out; }
.a-menu button { display:block; width:100%; border:0; background:none; text-align:left; padding:9px 14px; font-size:13.5px; cursor:pointer; }
.a-menu button + button { border-top:0.5px solid var(--a-hair); }
.a-menu .danger { color:var(--a-red); }
.a-menu .off { color:var(--a-sub); cursor:default; }
.a-sheet { position:absolute; inset:46px 0 0; z-index:8; background:var(--a-bg); border-radius:16px 16px 0 0; display:flex; flex-direction:column;
  transform:translateY(110%); visibility:hidden; transition:transform .4s cubic-bezier(.2,.8,.2,1), visibility 0s linear .4s;
  box-shadow:0 -6px 24px rgba(0,0,0,0.2); }
.a-sheet.on { transform:none; visibility:visible; transition:transform .4s cubic-bezier(.2,.8,.2,1), visibility 0s; }
.a-sheet-bar { display:flex; align-items:center; padding:12px 14px 6px; }
.a-sheet-bar b { flex:1; text-align:center; font-size:14px; }
.a-sheet-bar .a-link { width:44px; text-align:left; } .a-sheet-bar .a-link + b + .a-link { text-align:right; }
.tap { position:absolute; z-index:9; width:38px; height:38px; margin:-19px 0 0 -19px; border-radius:50%;
  background:rgba(0,122,255,.28); border:2px solid rgba(0,122,255,.85); pointer-events:none; animation:tap .65s ease-out forwards; }
@keyframes tap { from { transform:scale(.4); opacity:1; } to { transform:scale(1.5); opacity:0; } }
@keyframes popIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
.ph-stage { display:flex; flex-direction:column; align-items:center; }
.ph-card { background:var(--hero), var(--card); border:1px solid var(--line); border-radius:28px; padding:2rem 1rem 1.2rem; width:100%;
  display:flex; flex-direction:column; align-items:center; }
.ph-note { font-size:0.8rem; color:var(--sub); margin-top:0.8rem; text-align:center; }
@media (max-width:360px) { .ph { height:560px; } }
@media (prefers-reduced-motion:reduce) { .ph-view, .a-sheet, .a-toast { transition:none; } .tap { animation:none; display:none; } }
"""
