"""各分頁元件樣式（錄音、編曲、和弦譜、按法表單、選單）；色彩變數定義在 site_app_css.py。"""

PANE_CSS = """
.rec-panel { text-align:center; padding:6px 0 4px; }
.rec-status { font-size:12.5px; color:var(--a-sub); min-height:18px; }
.rec-row { display:flex; align-items:center; justify-content:center; gap:14px; margin:8px 0 4px; }
.rec-side { width:50px; height:50px; border-radius:50%; border:0; background:var(--a-fill); color:var(--a-sub); font-size:10.5px; font-weight:700; cursor:pointer; }
.rec-side.on { background:var(--a-accent); color:#fff; } .rec-side.blank { background:none; cursor:default; }
.rec-btn { position:relative; width:104px; height:104px; border-radius:50%; border:0; cursor:pointer; background:color-mix(in srgb, var(--a-red) 16%, transparent); }
.rec-btn i { position:absolute; left:50%; top:50%; width:26px; height:26px; margin:-13px; border-radius:50%; background:var(--a-red); transition:all .25s; }
.rec-btn.on { background:var(--a-red); animation:halo 1.1s ease-in-out infinite; }
.rec-btn.on i { width:24px; height:24px; margin:-12px; border-radius:5px; background:#fff; }
@keyframes halo { 50% { box-shadow:0 0 0 10px color-mix(in srgb, var(--a-red) 18%, transparent); } }
.rec-time { font:600 26px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace; color:var(--a-sub); }
.rec-time.on { color:var(--a-red); }
.rec-cap { font-size:11.5px; color:var(--a-sub); min-height:16px; }
.take { display:flex; align-items:center; gap:8px; padding:9px 10px; }
.take + .take { border-top:0.5px solid var(--a-hair); }
.take.new { animation:popIn .4s ease-out; }
.take .play { width:30px; height:30px; border-radius:50%; border:0; background:var(--a-accent); color:#fff; display:flex; align-items:center; justify-content:center; padding-left:2px; flex:none; }
.take div { flex:1; min-width:0; } .take strong { display:block; font-size:13.5px; } .take small { font-size:11px; color:var(--a-sub); }
.take .star { border:0; background:none; padding:4px; cursor:pointer; line-height:0; }
.take .more { color:var(--a-sub); font-size:16px; padding:0 2px; }
.ar-transport { display:flex; align-items:center; gap:10px; padding:8px 10px; margin-bottom:8px; }
.ar-play { width:34px; height:34px; border-radius:50%; border:0; background:var(--a-accent); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; flex:none; }
.ar-time { font:600 13px ui-monospace,SFMono-Regular,Menlo,monospace; }
.lanes { position:relative; overflow:hidden; }
.lane { display:grid; grid-template-columns:92px 1fr; align-items:center; min-height:52px; }
.lane + .lane { border-top:0.5px solid var(--a-hair); }
.lane-head { padding:6px 8px; } .lane-head strong { display:block; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lane-head small { font-size:9.5px; color:var(--a-sub); }
.lane-btns { display:flex; gap:4px; margin-top:3px; }
.lane-btns button { border:0; border-radius:6px; background:var(--a-fill); font-size:10px; font-weight:800; padding:2px 6px; cursor:pointer; color:var(--a-sub); }
.lane-btns button.on { background:var(--a-accent); color:#fff; } .lane-btns button.mute.on { background:var(--a-red); }
.lane-clip { height:34px; margin-right:8px; border-radius:6px; background:color-mix(in srgb, var(--a-accent) 30%, transparent); transition:opacity .25s; }
.lane-clip.empty { background:none; border:1px dashed var(--a-hair); }
.lane.dim .lane-clip { opacity:.25; }
.playhead { position:absolute; top:0; bottom:0; left:92px; width:2px; background:var(--a-accent); pointer-events:none; }
.add-card { padding:11px 12px; margin-top:8px; }
.add-head { display:flex; align-items:center; gap:6px; } .add-head small { margin-left:auto; font-size:11px; color:var(--a-sub); }
.add-card p { font-size:11.5px; color:var(--a-sub); margin-top:6px; }
.sec { margin-bottom:12px; }
.sec-head { display:flex; align-items:center; gap:6px; padding:2px 4px 6px; }
.sec-head b { font-size:13px; color:var(--a-sub); } .sec-head .a-link { margin-left:auto; font-size:12px; }
.sec-head .more { border:0; background:none; color:var(--a-accent); font-size:16px; padding:0 4px; cursor:pointer; }
.bars { display:grid; grid-template-columns:repeat(4,1fr); }
.bar { border:0; background:none; height:38px; font-weight:800; font-size:15px; cursor:pointer; position:relative; }
.bar + .bar::before { content:""; position:absolute; left:0; top:9px; height:20px; width:1px; background:var(--a-hair); }
.bar.empty { color:var(--a-sub); font-weight:700; font-size:13px; }
.bar.sel { background:var(--a-accent-fill); border-radius:6px; }
.bar.now { color:var(--a-accent); box-shadow:inset 0 -3px 0 var(--a-accent); }
.pb-play { border:0; background:none; padding:0; cursor:pointer; }
.lyric { font-size:12.5px; padding:2px 6px 8px; border-bottom:0.5px solid var(--a-hair); margin-bottom:6px; }
.lyric.ph-empty { color:var(--a-sub); }
.sec-chips { display:flex; gap:6px; padding:0 4px; }
.chart-add { margin:6px 0 10px; }
.playbar { flex:none; display:flex; align-items:center; gap:8px; margin:0 12px 8px; padding:6px 10px; border-radius:14px; background:var(--a-card); font-size:11.5px; color:var(--a-sub); }
.playbar .ar-play { width:28px; height:28px; }
.fret-card { padding:12px; margin-bottom:10px; }
.fret-card small { font-size:11px; color:var(--a-sub); } .fret-card p { font-size:12.5px; margin-top:4px; }
.fret-pos { display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:8px; }
.fret-pos button { width:28px; height:28px; border-radius:50%; border:0; background:var(--a-accent-fill); color:var(--a-accent); font-weight:800; cursor:pointer; }
.fret-pos button:disabled { background:var(--a-fill); color:var(--a-sub); cursor:default; }
.fret-pos div { text-align:center; min-width:62px; } .fret-pos b { display:block; font-size:12.5px; } .fret-pos span { font-size:9.5px; color:var(--a-sub); }
.fret-row { display:flex; align-items:center; gap:4px; margin:3px 0; }
.fret-row > b { width:14px; font-size:11px; color:var(--a-sub); text-align:center; }
.fret-row i { width:1px; height:22px; background:var(--a-hair); }
.fc { width:26px; height:26px; border-radius:50%; border:0; background:var(--a-fill); color:var(--a-sub); font-size:11.5px; cursor:pointer; padding:0; }
.fc.on { background:var(--a-accent); color:#fff; font-weight:800; }
.fret-pills { display:flex; gap:6px; justify-content:center; margin-top:8px; }
.preset-chips { display:flex; flex-wrap:wrap; gap:6px; padding:4px 2px 10px; }
.preset-chips button.on { background:var(--a-accent); color:#fff; }
"""
