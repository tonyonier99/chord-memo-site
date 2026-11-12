"""工具示範手機（調音器、節拍器）的樣式；隨 BANDS_CSS 輸出（手機 HTML 已拿掉）。"""

TOOLS_CSS = """
.tn-head { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.tn-inst .ic { font-size:10px; }
.tn-listen, .mt-play { display:flex; align-items:center; justify-content:center; gap:8px; }
.mt-top .ic { vertical-align:-2px; }
.mt-bpm button { display:flex; align-items:center; justify-content:center; }
.tn-inst { font-size:12.5px; font-weight:700; color:var(--a-accent); background:var(--a-accent-fill); border-radius:10px; padding:6px 10px; }
.tn-a4 { margin-left:auto; font-size:11px; font-weight:700; color:var(--a-sub); background:var(--a-fill); border-radius:999px; padding:5px 9px; }
.tn-note { text-align:center; height:82px; font:700 64px/82px ui-rounded,-apple-system,sans-serif; transition:color .2s; }
.tn-note sub { font-size:22px; color:var(--a-sub); vertical-align:baseline; margin-left:2px; }
.tn-note.ok { color:var(--a-green); }
.tn-meter { position:relative; height:26px; margin:6px 4px; }
.tn-meter::before { content:""; position:absolute; left:0; right:0; top:8px; height:10px; border-radius:999px; background:var(--a-fill); }
.tn-meter::after { content:""; position:absolute; left:50%; top:2px; width:2px; height:22px; margin-left:-1px; background:var(--a-sub); }
.tn-needle { position:absolute; top:0; width:5px; height:26px; margin-left:-2.5px; border-radius:999px; background:var(--a-accent); transition:left .3s ease-out; display:none; }
.tn-needle.ok { background:var(--a-green); }
.tn-cap { display:flex; justify-content:space-between; font-size:11px; color:var(--a-sub); margin:4px 2px 12px; }
.tn-cap span:nth-child(2) { font-variant-numeric:tabular-nums; }
.tn-strings { display:grid; grid-template-columns:repeat(6,1fr); gap:5px; margin-bottom:12px; }
.tn-strings button { border:2px solid transparent; border-radius:10px; background:var(--a-card); min-height:40px; font-weight:700; font-size:15px; cursor:pointer; }
.tn-strings button.lock { border-color:var(--a-accent); } .tn-strings button.hit { color:var(--a-accent); } .tn-strings button.hit.ok { color:var(--a-green); }
.tn-seg { grid-template-columns:repeat(3,1fr); }
.tn-foot { padding:12px 14px; margin-top:12px; } .tn-foot small { font-size:10.5px; font-weight:700; color:var(--a-sub); letter-spacing:1px; }
.tn-foot b { display:block; font-size:16px; margin-top:4px; } .tn-foot span { font-size:11px; color:var(--a-sub); }
.mt-card { padding:14px; }
.mt-top { display:flex; align-items:center; justify-content:space-between; font-size:13px; color:var(--a-sub); }
.mt-bpm { display:flex; align-items:center; justify-content:space-between; margin:10px 0; }
.mt-bpm button { width:42px; height:42px; border-radius:50%; border:0; background:var(--a-accent-fill); color:var(--a-accent); font-size:20px; font-weight:700; cursor:pointer; }
.mt-bpm div { font:700 46px/1 ui-rounded,-apple-system,sans-serif; font-variant-numeric:tabular-nums; }
.mt-bpm small { font-size:14px; color:var(--a-sub); margin-left:4px; font-weight:600; }
.mt-slider { width:100%; accent-color:var(--a-accent); margin:4px 0 12px; }
.mt-beats { display:flex; justify-content:center; gap:10px; margin-bottom:12px; }
.mt-beats i { width:16px; height:16px; border-radius:50%; background:var(--a-fill); transition:background .08s, transform .08s; }
.mt-beats i.accent { width:22px; height:22px; } .mt-beats i.hit { background:var(--a-accent); transform:scale(1.15); }
.mt-tap { border:0; width:100%; border-radius:999px; background:var(--a-accent-fill); color:var(--a-accent); font-weight:700; font-size:15px; padding:11px 0; margin-bottom:8px; cursor:pointer; }
.mt-tap.pulse { background:var(--a-accent); color:#fff; }
.mt-play { display:flex; align-items:center; justify-content:center; gap:8px; font-size:16px; padding:14px 0; }
.mt-opts { padding:2px 14px; margin-top:12px; }
.mt-opts div { display:flex; justify-content:space-between; align-items:center; padding:10px 0; font-size:13.5px; }
.mt-opts div + div { border-top:0.5px solid var(--a-hair); } .mt-opts small { display:block; font-size:11px; color:var(--a-sub); }
"""
