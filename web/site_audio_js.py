"""全站共用的聲音（window.CMAudio）＋頁首喇叭開關。參數一律照 App 原始碼（和弦大師/native/ChordMaster，只讀）：

- 吉他：App 用 instrument.sf2（MuseScore_General，約 117 MB）取樣，網頁搬不動，改用 Karplus-Strong 撥弦合成；
  音高照 App：空弦 MIDI [40,45,50,55,59,64]（InstrumentDefinition.swift openMidi，低→高）＋品格；悶弦（-1）不發聲。
  整彈 velocity 92、音長 1.1 秒；一弦一弦（下刷，低→高）每弦隔 0.04 秒（AudioEngine.swift playChord／playStrum）；
  主混音 0.6（AudioEngine.swift mainMixerNode.outputVolume）。
- 節拍聲：RecordClickTrack.swift 的合成 click，30 ms，振幅 × sin(2πft) × e^(−140t)；強 1760 Hz／0.7、中 1320／0.45、弱 1320／0.28。
- 調音器參考音：ReferenceTone.swift 正弦波，2 秒、振幅 0.3、淡入 20 ms、淡出 250 ms；低於 200 Hz 疊第 1–3 泛音（1、0.6、0.4）。
- 規則：AudioContext 等訪客第一次真的點擊（isTrusted）才建立；自動示範的點擊包在 quietly() 裡，不出聲。
  喇叭開關預設開，記在 localStorage（讀不到就當開）；關掉立刻停掉所有正在響的聲音。
- CMAudio.played 記最近觸發的音（MIDI 與 Hz），給驗收核對音高用。
"""
from site_icons import icon

SOUND_KEY = "cm-sound"

SOUND_CSS = """
.snd-toggle { border:0; background:none; color:var(--sub); font-size:1.3rem; line-height:0; padding:0.35rem; margin-left:0.6rem;
  border-radius:999px; cursor:pointer; display:inline-flex; }
.snd-toggle:hover { color:var(--ink); } .snd-toggle .snd-off, .snd-toggle[aria-pressed="false"] .snd-on { display:none; }
.snd-toggle[aria-pressed="false"] .snd-off { display:inline-flex; }
@media (max-width:700px) { .snd-toggle { order:1; margin-left:auto; } .snd-toggle + .nav-cta { margin-left:0.4rem; } }
"""


def sound_toggle() -> str:
    return ('<button type="button" class="snd-toggle" data-sound aria-pressed="true" aria-label="聲音" title="聲音開關">'
            f'<span class="snd-on">{icon("speaker.wave.2.fill")}</span><span class="snd-off">{icon("speaker.slash.fill")}</span></button>')


AUDIO_JS = """<script>
window.CMAudio = (function () {
  var M = { played: [] }, ctx = null, master = null, on = true, quiet = 0, cache = {}, buffers = {}, live = [];
  var OPEN = [40, 45, 50, 55, 59, 64], MIX = 0.6, CHORD = { vel: 92, dur: 1.1 }, STAGGER = 0.04;
  var CLICK = { strong: [1760, 0.7], medium: [1320, 0.45], weak: [1320, 0.28] };
  try { on = localStorage.getItem('""" + SOUND_KEY + """') !== 'off'; } catch (e) { on = true; }
  function unlock(e) {
    if (!e.isTrusted) return;
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      try { ctx = new C(); } catch (err) { ctx = null; return; }
      // 主音量照 App 0.6；後面接一顆壓縮器，六弦同時響或多軌疊加時不爆音
      var limit = ctx.createDynamicsCompressor(); limit.threshold.value = -6; limit.ratio.value = 12; limit.connect(ctx.destination);
      master = ctx.createGain(); master.gain.value = on ? MIX : 0; master.connect(limit);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(function () { return null; });
  }
  // iOS Safari 要在 touchend／click 裡才解鎖聲音，所以四種手勢都接（重複呼叫無妨）
  ['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (t) { document.addEventListener(t, unlock, true); });
  M.allowed = function () { return !!ctx && on && quiet === 0; };   // 這一下點擊可以出聲（不是自動示範）
  M.live = function () { return !!ctx && on; };                       // 已開始的播放（節拍器、從頭播）繼續出聲
  M.isQuiet = function () { return quiet > 0; };
  M.quietly = function (fn) { quiet++; try { fn(); } finally { quiet--; } };
  M.now = function () { return ctx ? ctx.currentTime : 0; };
  M.hz = function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); };
  M.midis = function (frets) { var out = []; frets.forEach(function (f, s) { if (f >= 0) out.push(OPEN[s] + f); }); return out; };
  function track(src) { live.push(src); src.onended = function () { live = live.filter(function (x) { return x !== src; }); }; return src; }
  M.stopAll = function () { live.forEach(function (s) { try { s.stop(); } catch (e) { return; } }); live = []; };
  function pluck(midi) {  // Karplus-Strong：一個週期的雜訊在延遲線裡反覆低通平均；用 playbackRate 補小數延遲，音高準到 Hz
    if (cache[midi]) return cache[midi];
    var sr = ctx.sampleRate, f = M.hz(midi), n = Math.max(2, Math.floor(sr / f)), len = Math.ceil(sr * 2.2);
    var buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0), prev = 0, i;
    for (i = 0; i < n; i++) { prev = 0.5 * (prev + Math.random() * 2 - 1); d[i] = prev; }
    d[n] = 0.996 * 0.5 * d[0];
    for (i = n + 1; i < len; i++) d[i] = 0.996 * 0.5 * (d[i - n] + d[i - n - 1]);
    cache[midi] = { buf: buf, rate: f * (n + 0.5) / sr }; return cache[midi];
  }
  M.note = function (midi, at, vel, dur) {
    if (!M.live()) return;
    var p = pluck(midi), src = ctx.createBufferSource(), g = ctx.createGain(), t = Math.max(at || 0, ctx.currentTime);
    src.buffer = p.buf; src.playbackRate.value = p.rate;
    g.gain.setValueAtTime(Math.pow((vel || CHORD.vel) / 127, 2), t); g.gain.setTargetAtTime(0, t + (dur || CHORD.dur), 0.06);
    src.connect(g); g.connect(master); track(src).start(t); src.stop(t + (dur || CHORD.dur) + 0.4);
    M.played = M.played.concat([{ midi: midi, hz: +M.hz(midi).toFixed(2) }]).slice(-60);
  };
  // 整彈（stagger 0）或一弦一弦往下刷；midis 低→高，反過來傳就是上刷
  M.strum = function (midis, o) {
    var opt = o || {}, t = opt.at || M.now(), gap = opt.stagger == null ? STAGGER : opt.stagger;
    midis.forEach(function (m, i) { M.note(m, t + i * gap, opt.vel, opt.dur); });
  };
  M.frets = function (frets, o) { M.strum(M.midis(frets), o); };
  M.open = function (s) { return OPEN[s]; };
  M.click = function (level, at) {
    if (!M.live()) return;
    var v = CLICK[level] || CLICK.medium, o = ctx.createOscillator(), g = ctx.createGain(), t = Math.max(at || 0, ctx.currentTime);
    o.frequency.value = v[0]; g.gain.setValueAtTime(v[1], t); g.gain.setTargetAtTime(0, t, 1 / 140);
    o.connect(g); g.connect(master); track(o).start(t); o.stop(t + 0.03);
  };
  M.tone = function (hz) {  // 調音器參考音
    if (!M.allowed()) return;
    var t = ctx.currentTime, harm = hz < 200 ? [1, 0.6, 0.4] : [1], sum = harm.reduce(function (a, b) { return a + b; }, 0);
    var g = ctx.createGain(); g.connect(master);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t + 0.02); g.gain.setValueAtTime(0.3, t + 1.75); g.gain.linearRampToValueAtTime(0, t + 2);
    harm.forEach(function (a, k) {
      var o = ctx.createOscillator(), h = ctx.createGain(); o.frequency.value = hz * (k + 1); h.gain.value = a / sum;
      o.connect(h); h.connect(g); track(o).start(t); o.stop(t + 2.05);
    });
    M.played = M.played.concat([{ tone: +hz.toFixed(2) }]).slice(-60);
  };
  M.load = function (url) {  // 示範歌的真實錄音（m4a），解碼一次就留著
    if (!buffers[url]) buffers[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); })
      .then(function (raw) { return new Promise(function (ok, bad) { ctx.decodeAudioData(raw, ok, bad); }); })
      .catch(function (err) { delete buffers[url]; throw err; });  // 失敗不快取，下次點還會重試
    return buffers[url];
  };
  M.play = function (buffer, offset, gainNode) {
    var src = ctx.createBufferSource(); src.buffer = buffer; src.connect(gainNode || master);
    track(src).start(ctx.currentTime + 0.02, Math.max(0, Math.min(offset || 0, buffer.duration))); return src;
  };
  M.gain = function (value) { var g = ctx.createGain(); g.gain.value = value; g.connect(master); return g; };
  M.url = function (rel) { return (window.CMAudioBase || '') + rel; };
  function paint(btn) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? '聲音：開' : '聲音：關'); }
  M.setOn = function (v) {
    on = !!v; try { localStorage.setItem('""" + SOUND_KEY + """', on ? 'on' : 'off'); } catch (e) { on = !!v; }
    if (master) master.gain.setValueAtTime(on ? MIX : 0, ctx.currentTime);
    if (!on) M.stopAll();
    document.querySelectorAll('[data-sound]').forEach(paint);
    document.dispatchEvent(new CustomEvent('cmsound', { detail: { on: on } }));
  };
  document.querySelectorAll('[data-sound]').forEach(function (btn) { paint(btn); btn.addEventListener('click', function () { M.setOn(!on); }); });
  return M;
})();
</script>"""
