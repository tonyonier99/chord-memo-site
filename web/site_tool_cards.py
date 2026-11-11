"""首頁「寫歌時順手的工具」改成資訊卡，不再是三支手機（站長 2026-11-12：不一定全都要是手機，參考初級大人手冊官網的卡片）。

- 分享整份譜（寬卡）：把示範歌 there's nothing…（site_song.py）排成一張和弦譜（調、速度、拍號、8 小節和弦；純音樂不放歌詞），
  旁邊三個分享方式照 App OthersView.swift 分享子選單；「複製為 ChordPro」真的會複製（格式照 site_app_js_chart.py 的 chordPro）。
- 調音器：大字音名＋偏差條＋六條弦（標準 EADGBE），點弦播參考音（CMAudio.tone，ReferenceTone.swift）。
- 節拍器：大字 BPM（示範歌速度）＋四拍燈，按「播放」照速度閃燈並響 click（CMAudio.click，RecordClickTrack.swift）。
文字照 site_content.TOOL_BANDS 與 App 字串；只排版、不畫圖。
"""
import json

from site_icons import icon
from site_song import SONG, song_meta
from site_theme import esc

STRINGS = ["E", "A", "D", "G", "B", "e"]  # 標準 EADGBE（低→高）
SHARE = ["分享整份譜（圖片）", "分享 ChordPro 文字", "複製為 ChordPro"]  # OthersView.swift 分享子選單


def _chord_pro() -> str:
    key = SONG["key"] + ("m" if SONG["mode"] == "minor" else "")
    head = [f"{{key: {key}}}", f"{{time: {SONG['meter']}}}", f"{{tempo: {SONG['bpm']}}}"]
    bars = SONG["bars"]
    rows = [" ".join(f"[{c}]" for c in bars[i:i + 4]) for i in range(0, len(bars), 4)]
    return "\n".join(head + [""] + rows) + "\n"


def _chart_card(item: dict) -> str:
    bars = "".join(f"<span>{esc(c)}</span>" for c in SONG["bars"])
    rows = "".join(f'<li{" data-tc-copy" if i == 2 else ""}>{esc(s)}</li>' for i, s in enumerate(SHARE))
    pro = esc(json.dumps(_chord_pro(), ensure_ascii=False))
    return (f'<article class="tc tc-wide" id="{item["anchor"]}" data-reveal><div class="tc-copy">'
            f'<h3>{esc(item["title"])}</h3><ul class="tc-share" data-tc-pro="{pro}">{rows}</ul>'
            f'<p class="tc-done" data-tc-done hidden>已複製</p></div>'
            f'<div class="tc-sheet"><p class="tc-sheet-m">{esc(song_meta())}</p><div class="tc-bars">{bars}</div></div></article>')


def _tuner_card(item: dict) -> str:
    strings = "".join(f'<button type="button" data-tc-string="{i}"{" class=on" if i == 1 else ""}>{s}</button>'
                      for i, s in enumerate(STRINGS))
    return (f'<article class="tc" id="{item["anchor"]}" data-reveal>'
            f'<h3>{esc(item["title"])}</h3><p class="tc-lead">{esc(item["lead"])}</p>'
            f'<div class="tc-note" data-tc-note>A<sub>2</sub></div><div class="tc-meter"><i></i></div>'
            f'<div class="tc-strings">{strings}</div><p class="tc-fine">點弦聽參考音（A4 = 440 Hz）</p></article>')


def _metronome_card(item: dict, bpm: int) -> str:
    return (f'<article class="tc" id="{item["anchor"]}" data-reveal data-tc-metro="{bpm}">'
            f'<h3>{esc(item["title"])}</h3><p class="tc-lead">{esc(item["lead"])}</p>'
            f'<div class="tc-bpm"><strong>{bpm}</strong><span>BPM</span></div><div class="tc-beats"><i></i><i></i><i></i><i></i></div>'
            f'<button type="button" class="tc-play" data-tc-play>{icon("play.fill")}<span>播放</span></button></article>')


def tool_cards(bands: list[dict]) -> str:
    by = {b["anchor"]: b for b in bands}
    return (f'<div class="tc-grid">{_chart_card(by["export"])}{_tuner_card(by["tuner"])}'
            f'{_metronome_card(by["metronome"], SONG["bpm"])}</div>')


TOOL_CARDS_CSS = """
.tc-grid { display:grid; grid-template-columns:minmax(0,1fr); gap:1rem; margin-top:2.4rem; }
@media (min-width:860px) { .tc-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .tc-wide { grid-column:1 / -1; } }
.tc { background:var(--card); border-radius:28px; padding:2rem 1.8rem; display:flex; flex-direction:column; }
.tc-eye { font-size:0.9rem; font-weight:600; color:var(--record); }
.tc h3 { font-size:clamp(1.4rem,2.6vw,1.9rem); line-height:1.25; margin-top:0.3rem; }
.tc-lead { color:var(--sub); margin-top:0.5rem; line-height:1.65; }
.tc-fine { color:var(--sub); font-size:0.82rem; margin-top:0.8rem; text-align:center; }
.tc-wide { display:grid; gap:1.6rem; align-items:center; }
@media (min-width:860px) { .tc-wide { grid-template-columns:minmax(0,0.8fr) minmax(0,1.2fr); gap:2.4rem; } }
.tc-share { list-style:none; display:grid; gap:0.5rem; margin-top:1.2rem; }
.tc-share li { background:var(--bg); border-radius:14px; padding:0.8rem 1rem; font-weight:500; }
.tc-share li[data-tc-copy] { color:var(--accent-ink); cursor:pointer; }
.tc-share li[data-tc-copy]:hover { background:var(--accent-soft); }
.tc-done { color:var(--accent-ink); font-size:0.85rem; margin-top:0.5rem; }
.tc-done[hidden] { display:none; }
.tc-sheet { background:var(--bg); border-radius:20px; padding:1.6rem 1.5rem; box-shadow:0 10px 30px rgba(0,0,0,.06); }
.tc-sheet-t { font-size:1.4rem; font-weight:700; }
.tc-sheet-m { color:var(--sub); font-size:0.9rem; font-variant-numeric:tabular-nums; }
.tc-bars { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:0.4rem; margin-top:0.5rem; }
.tc-bars span { border-left:2px solid var(--line); padding:0.45rem 0.6rem; font-weight:700; font-size:1.1rem; }
.tc-note { text-align:center; font-size:5.5rem; font-weight:700; line-height:1; margin-top:1.4rem; }
.tc-note sub { font-size:2rem; color:var(--sub); vertical-align:baseline; }
.tc-meter { position:relative; height:6px; border-radius:3px; background:var(--fill); margin:1.2rem 10% 0; }
.tc-meter i { position:absolute; left:calc(50% - 2px); top:-7px; width:4px; height:20px; border-radius:2px; background:#34C759; }
.tc-strings { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:0.4rem; margin-top:1.4rem; }
.tc-strings button { min-height:46px; border:0; border-radius:12px; background:var(--bg); font-family:inherit; font-size:1.05rem; font-weight:600; color:var(--ink); cursor:pointer; }
.tc-strings button.on { background:var(--accent); color:#fff; }
.tc-bpm { text-align:center; margin-top:1.4rem; }
.tc-bpm strong { font-size:5.5rem; font-weight:700; line-height:1; font-variant-numeric:tabular-nums; }
.tc-bpm span { color:var(--sub); font-size:1.1rem; margin-left:0.3rem; }
.tc-beats { display:flex; justify-content:center; gap:0.8rem; margin-top:1.2rem; }
.tc-beats i { width:16px; height:16px; border-radius:50%; background:var(--fill); transition:background .08s; }
.tc-beats i.hit { background:var(--accent); }
.tc-beats i.hit:first-child { background:var(--record); }
.tc-play { align-self:center; margin-top:auto; display:inline-flex; align-items:center; gap:0.4rem; border:0; border-radius:999px;
  background:var(--accent); color:#fff; font-family:inherit; font-size:1rem; font-weight:500; padding:0.8rem 1.6rem; cursor:pointer; }
.tc-beats + .tc-play { margin-top:1.4rem; }
"""

TOOL_CARDS_JS = r"""<script>(function () {
  var S = window.CMAudio;
  document.querySelectorAll('[data-tc-string]').forEach(function (b, i, all) {
    b.addEventListener('click', function () {
      all.forEach(function (x) { x.classList.toggle('on', x === b); });
      var note = document.querySelector('[data-tc-note]'), names = ['E', 'A', 'D', 'G', 'B', 'E'], oct = [2, 2, 3, 3, 3, 4];
      note.innerHTML = names[i] + '<sub>' + oct[i] + '</sub>';
      if (S && S.allowed()) S.tone(S.hz(S.open(i)));
    });
  });
  var card = document.querySelector('[data-tc-metro]');
  if (card) {
    var bpm = +card.dataset.tcMetro || 100, dots = card.querySelectorAll('.tc-beats i'), btn = card.querySelector('[data-tc-play]'), timer = null, beat = 0, label = btn.querySelector('span');
    function tick() { dots.forEach(function (d, k) { d.classList.toggle('hit', k === beat); }); if (S && S.live()) S.click(beat === 0 ? 'strong' : 'medium'); beat = (beat + 1) % dots.length; }
    function halt() { clearInterval(timer); timer = null; label.textContent = '播放'; dots.forEach(function (d) { d.classList.remove('hit'); }); }
    btn.addEventListener('click', function () { if (timer) { halt(); return; } beat = 0; tick(); timer = setInterval(tick, 60000 / bpm); label.textContent = '停止'; });
    document.addEventListener('cmsound', function (e) { if (!e.detail.on) halt(); });
  }
  var list = document.querySelector('[data-tc-pro]'), copy = document.querySelector('[data-tc-copy]'), done = document.querySelector('[data-tc-done]');
  if (copy && navigator.clipboard) copy.addEventListener('click', function () {
    navigator.clipboard.writeText(JSON.parse(list.dataset.tcPro)).then(function () { done.hidden = false; setTimeout(function () { done.hidden = true; }, 2000); }, function () { done.hidden = true; });
  });
})();</script>"""
