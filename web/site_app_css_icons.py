"""圖示的擺法與大小（照 App 的 .font 設定換算：caption2≈11、footnote≈13、body≈17、title3≈20、title≈28、largeTitle≈34；
手機外框約是實機 0.77 倍寬，所以數值略縮）＋靈感頁 confirmationDialog 樣式。顏色用 currentColor 跟著 App 的語意色。"""

ICON_PANE_CSS = """
.ph-circle { display:inline-flex; align-items:center; justify-content:center; color:var(--a-label); font-size:18px; }
.ph-tabs button { display:flex; flex-direction:column; align-items:center; gap:1px; padding:5px 0 4px; }
.ph-tabs button .ic { font-size:19px; }
.a-search { display:flex; align-items:center; gap:6px; } .a-search .ic { font-size:14px; }
.a-row .tint, .name-row .tint { color:var(--a-accent); font-size:17px; line-height:0; }
.a-row .chev { line-height:0; font-size:12px; }
.a-row .ico { display:flex; align-items:center; justify-content:center; color:var(--a-sub); font-size:16px; }
.a-songcard .cover { position:relative; display:flex; align-items:center; justify-content:center; aspect-ratio:auto; height:96px;
  font-size:26px; color:color-mix(in srgb, var(--a-sub) 50%, transparent); }
.card-star { position:absolute; top:6px; right:6px; width:26px; height:26px; border-radius:50%; background:var(--a-card);
  display:flex; align-items:center; justify-content:center; font-size:13px; color:var(--a-sub); }
.a-songcard em.a-pill { margin-top:3px; }
.fab-new { position:absolute; right:16px; bottom:18px; width:44px; height:44px; border-radius:50%; background:var(--a-card);
  display:flex; align-items:center; justify-content:center; font-size:20px; color:var(--a-accent); box-shadow:0 2px 10px rgba(0,0,0,0.12); }
.name-row { display:flex; align-items:center; gap:8px; padding:12px 14px; font-weight:700; }
.name-row .tint { font-size:13px; }
.seed-text { padding:12px 14px; } .seed-head { display:flex; align-items:center; }
.seed-head small { font-size:11px; color:var(--a-sub); } .seed-head .more { margin-left:auto; color:var(--a-sub); font-size:16px; line-height:0; }
.seed-text p { font-size:14.5px; margin-top:4px; }
.a-menu button { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.a-menu button .ic { font-size:15px; }
.a-dialog { position:absolute; inset:0; z-index:20; display:none; flex-direction:column; justify-content:flex-end; padding:0 8px 18px;
  background:var(--a-scrim); }
.a-dialog.on { display:flex; animation:fadeIn .2s ease-out; }
.a-dialog-box { animation:sheetUp .28s cubic-bezier(.2,.8,.2,1); }
.a-dialog-group, .a-dialog-cancel { background:var(--a-elevated); border-radius:14px; box-shadow:0 4px 18px rgba(0,0,0,0.18); }
.a-dialog-group { overflow:hidden; margin-bottom:8px; }
.a-dialog button { display:block; width:100%; border:0; background:var(--a-elevated); color:var(--a-accent); font-size:16px; padding:13px 0; text-align:center; cursor:pointer; }
.a-dialog-group button + button { border-top:0.5px solid var(--a-hair); }
.a-dialog-cancel { font-weight:700; }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes sheetUp { from { transform:translateY(40px); opacity:0; } to { transform:none; opacity:1; } }
.rec-side { display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:20px; color:var(--a-label); background:var(--a-card); }
.rec-side small { font-size:9.5px; font-weight:800; line-height:1; }
.rec-side.on { background:var(--a-accent); color:#fff; }
.rec-btn { display:flex; align-items:center; justify-content:center; }
.rec-btn .rec-ic { font-size:32px; line-height:0; color:var(--a-red); position:relative; z-index:1; }
.rec-btn .busy { display:none; color:#fff; } .rec-btn.on .busy { display:block; } .rec-btn.on .idle { display:none; }
.take .play { background:none; color:var(--a-accent); font-size:28px; padding:0; width:auto; height:auto; line-height:0; }
.take .star { color:var(--a-sub); font-size:17px; } .take .star.on { color:var(--a-accent); }
.take .arr { color:var(--a-accent); font-size:17px; line-height:0; } .take .more { line-height:0; }
.ar-transport { gap:4px; }
.tr-btn { border:0; background:none; color:var(--a-accent); font-size:19px; line-height:0; padding:6px 3px; cursor:pointer; }
.tr-btn.rec { color:var(--a-red); font-size:24px; }
.tr-play { border:0; background:none; color:var(--a-accent); font-size:34px; line-height:0; padding:0; cursor:pointer; }
.tr-play .p-off, .tr-play.playing .p-on { display:none; } .tr-play.playing .p-off { display:inline; }
.ar-time { margin-right:auto; white-space:nowrap; font-size:12px; }
.lane-head strong .ic { font-size:9px; color:var(--a-sub); margin-left:3px; }
.lane-btns { align-items:center; }
.lane-btns .mute { background:none; padding:0 2px; font-size:13px; color:var(--a-accent); line-height:0; }
.lane-btns .mute.on { background:none; color:var(--a-sub); }
.lane-btns .solo { width:20px; height:20px; border-radius:50%; padding:0; }
.lane-btns .lmore { color:var(--a-sub); font-size:13px; line-height:0; margin-left:auto; padding:0 4px; }
.add-main { display:inline-flex; align-items:center; gap:4px; font-size:14px; } .add-main .ic { font-size:16px; }
.add-import { display:inline-flex; align-items:center; gap:3px; font-size:11.5px; margin-left:4px; }
.sec-head .chev { color:var(--a-sub); font-size:9px; line-height:0; }
.sec-head .a-link { display:inline-flex; align-items:center; gap:3px; }
.sec-head .more { line-height:0; }
.bar.empty .ic { font-size:11px; }
.a-chip .ic { font-size:10px; margin-right:2px; }
.chart-add { display:flex; align-items:center; justify-content:center; gap:6px; }
.playbar { gap:6px; } .pb-play { color:var(--a-accent); font-size:28px; line-height:0; }
.pb-dim { color:var(--a-sub); font-size:15px; line-height:0; } .pb-cap { flex:1; }
.fret-card small { display:flex; align-items:center; gap:4px; }
.fret-pos button { display:flex; align-items:center; justify-content:center; font-size:15px; }
.fret-pills .a-chip { display:inline-flex; align-items:center; gap:4px; }
.fret-guess .fg-head { font-size:11px; color:var(--a-sub); display:flex; align-items:center; gap:4px; }
.fret-guess .fg-chips { display:flex; gap:6px; margin-top:6px; }
.fret-guess .fg-chips span { font-weight:700; font-size:13px; color:var(--a-accent); background:var(--a-accent-fill); border-radius:8px; padding:4px 10px; }
.fret-guess .fg-none { font-size:12px; color:var(--a-sub); margin-top:4px; }
.fret-clear { display:inline-flex; align-items:center; gap:4px; margin-top:10px; font-size:12px; color:var(--a-sub); }
.a-sheet-bar .a-link:disabled { color:var(--a-sub); cursor:default; }
"""
