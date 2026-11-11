"""工具示範手機：調音器（TunerView.swift、TunerComponents.swift）、節拍器（RhythmView.swift）。

字串照 App：調音器「吉他・標準 EADGBE」「A4 = 440 Hz」「按「開始調音」」「低／高」、模式「自動／手動／半音」（TunerLogic.swift）、
「開始調音／停止」「標準 EADGBE（低→高）」；節拍器「速度」「BPM」「Tap」「播放／停止」「拍號」「預備拍」「按播放先數一小節」。
示範手機沒有收音：調音讀數是示意（標在手機下方）。
"""
from site_app_data import STRINGS as S
from site_app_screens import phone
from site_icons import icon
from site_theme import esc

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

# 速度範圍 30–250：TempoRange.swift metronome
TUNING_NAME = "標準 EADGBE"  # InstrumentDefinition.swift guitarStandardTuning.name
OPEN_NOTES = "E2 · A2 · D3 · G3 · B3 · E4"  # 由 openMidi [40,45,50,55,59,64] 換算（PitchMath.noteNameWithOctave）


def tool_view(title: str, body: str) -> str:
    return (f'<div class="ph-stack"><div class="ph-view on"><div class="ph-nav"><span class="ph-circle" aria-hidden="true">{icon("chevron.left")}</span>'
            f'<b>{esc(title)}</b><span style="width:32px"></span></div><div class="ph-scroll">{body}</div></div></div>')


def tuner_phone() -> str:
    strings = "".join(f'<button type="button" data-string="{i}">{esc(label)}</button>'
                      for i, label in enumerate(S["string_labels"]))
    modes = "".join(f'<button type="button" class="{"on" if m == "自動" else ""}" data-mode="{m}">{m}</button>'
                    for m in ("自動", "手動", "半音"))
    body = (f'<div class="tn-head"><span class="tn-inst">吉他・{TUNING_NAME} {icon("chevron.up.chevron.down")}</span><span class="tn-a4">A4 = 440 Hz</span></div>'
            '<div class="tn-note" data-note>—</div><div class="tn-meter"><span class="tn-needle"></span></div>'
            '<div class="tn-cap"><span>低</span><span data-cap>按「開始調音」</span><span>高</span></div>'
            f'<div class="tn-strings">{strings}</div><div class="a-seg tn-seg">{modes}</div>'
            f'<button type="button" class="a-btn tn-listen" data-act="listen">{icon("mic.fill")}開始調音</button>'
            f'<div class="a-card tn-foot"><small>{TUNING_NAME}（低→高）</small><b>{"  ".join(S["string_labels"])}</b>'
            f'<span>{OPEN_NOTES}</span></div>')
    return phone(tool_view("調音器", body), attrs=' data-demo="tuner"')


def metronome_phone(bpm: int) -> str:
    beats = "".join(f'<i class="{"accent" if i == 0 else ""}"></i>' for i in range(4))
    body = (f'<div class="a-card mt-card"><div class="mt-top"><span>{icon("metronome")} 速度</span></div>'
            f'<div class="mt-bpm"><button type="button" data-step="-1" aria-label="減慢">{icon("minus")}</button>'
            f'<div><span data-bpm>{bpm}</span><small>BPM</small></div><button type="button" data-step="1" aria-label="加快">{icon("plus")}</button></div>'
            f'<input class="mt-slider" type="range" min="30" max="250" step="1" value="{bpm}" aria-label="速度">'
            f'<div class="mt-beats">{beats}</div><button type="button" class="mt-tap" data-act="tap">Tap</button>'
            f'<button type="button" class="a-btn mt-play" data-act="play">{icon("play.fill")}<span>播放</span></button></div>'
            '<div class="a-card mt-opts"><div><span>拍號</span><span style="color:var(--a-sub)">4/4</span></div>'
            '<div><span>預備拍<small>按播放先數一小節</small></span></div></div>')
    return phone(tool_view("節拍器", body), attrs=f' data-demo="metronome" data-bpm="{bpm}"')
