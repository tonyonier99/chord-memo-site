"""範本庫的動態效果，照 App 範本支線：

1. 試聽 CD（ArtistTemplateDetailView.swift 詳情頂端、ArtistTemplateArtwork.swift ArtistTemplateDiscView、
   ArtistTemplateShelfLayout.swift ArtistTemplateDisc／detailCover）：
   - CD＝同一張封面裁成圓，直徑＝封面 0.9 倍，平常整個藏在封面後；整組（封面＋滑出空間）置中，封面就略偏左。
   - 按試聽立刻滑出 0.42 個 CD（0.55 秒）；載入中不轉、出聲才轉，8 秒一圈；停止、播完、失敗、關掉詳情＝收回。
   - 停住凍在當下角度、再轉從那裡接（CSS animation-play-state 暫停就是這個行為）。
   - 中心孔 13%、內圈 34%（白線 0.35）、外框細線；角度漸層光澤不跟著轉；陰影 0.18／6／3。
   - 系統「減少動態效果」：只滑出、不轉。
   CD 只是把藝人封面裁圓（跟 App 一樣），不另外畫圖。
2. 頂端歌名淡入（DetailView titleRevealFraction 0.6、easeInOut）：捲過封面約 6 成，頂端列才淡入歌名。
"""

COVER_RATIO = 1.328  # 整組寬／封面寬＝0.5 + 0.9/2 + 0.9×0.42（ArtistTemplateLayout.detailCover 的 spanRatio）


def disc_header(cover_img: str, cover_url: str) -> str:
    """有封面才有 CD（App 沒封面時 CD 是空白底，網頁的示意範本又不能試聽 → 不放）。"""
    return (f'<div class="ts-hd" data-ts-disc="tucked"><div class="ts-disc" aria-hidden="true">'
            f'<div class="ts-disc-spin" style="background-image:url(\'{cover_url}\')"></div></div>{cover_img}</div>')


_HOLE = "radial-gradient(circle closest-side, transparent 13%, #000 calc(13% + 0.5px))"
_RIM = "rgba(255,255,255,.35)"

MOTION_CSS = f"""
.ts-hd {{ --cv:min(360px, calc((min(560px, 100vw) - 40px) / {COVER_RATIO})); position:relative; width:calc(var(--cv) * {COVER_RATIO});
  max-width:100%; height:var(--cv); margin:0.4rem auto 0.9rem; }}
.ts-hd .ts-big {{ position:absolute; left:0; top:0; width:var(--cv); height:var(--cv); margin:0; box-shadow:0 10px 18px rgba(0,0,0,.2); }}
.ts-disc {{ position:absolute; left:calc(var(--cv) * .05); top:calc(var(--cv) * .05); width:calc(var(--cv) * .9); height:calc(var(--cv) * .9);
  border-radius:50%; filter:drop-shadow(0 3px 6px rgba(0,0,0,.18)); transition:transform .55s cubic-bezier(.25,.8,.25,1); }}
[data-ts-disc="out"] .ts-disc, [data-ts-disc="spin"] .ts-disc {{ transform:translateX(calc(var(--cv) * .9 * .42)); }}
.ts-disc-spin, .ts-disc::before, .ts-disc::after {{ position:absolute; inset:0; border-radius:50%; -webkit-mask:{_HOLE}; mask:{_HOLE}; }}
.ts-disc-spin {{ background-size:cover; background-position:center; animation:ts-spin 8s linear infinite; animation-play-state:paused; }}
[data-ts-disc="spin"] .ts-disc-spin {{ animation-play-state:running; }}
.ts-disc::before {{ content:""; mix-blend-mode:plus-lighter; pointer-events:none;
  background:conic-gradient(rgba(255,255,255,0), rgba(255,255,255,.22), rgba(255,255,255,0), rgba(255,255,255,.14), rgba(255,255,255,0)); }}
.ts-disc::after {{ content:""; pointer-events:none; box-shadow:inset 0 0 0 0.5px rgba(128,128,128,.3);
  background:radial-gradient(circle closest-side, transparent calc(34% - 0.6px), {_RIM} calc(34% - 0.6px), {_RIM} 34%, transparent 34%),
    radial-gradient(circle closest-side, transparent 13.4%, {_RIM} 13.4%, {_RIM} calc(13.4% + 0.6px), transparent calc(13.4% + 0.6px)); }}
@keyframes ts-spin {{ to {{ transform:rotate(360deg); }} }}
@media (prefers-reduced-motion: reduce) {{ .ts-disc-spin {{ animation:none; }} }}
.ts-top {{ position:sticky; top:0; z-index:5; display:flex; align-items:center; justify-content:space-between; gap:0.6rem;
  margin:0 -20px; padding:0.7rem 20px; background:var(--card); }}
.ts-toptitle {{ font-weight:700; opacity:0; transition:opacity .35s ease-in-out; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }}
.ts-toptitle.on {{ opacity:1; }}
"""

# 接在 site_store.py 的 STORE_JS_BODY 後面：CD 狀態跟著試聽鈕、頂端歌名跟著捲動
MOTION_JS = r"""
  function disc(btn, state) {
    var hd = btn.closest('[data-ts-detail]').querySelector('[data-ts-disc]'); if (!hd) return;
    hd.dataset.tsDisc = state === 'play' ? 'tucked' : (state === 'loading' ? 'out' : 'spin');
  }
  var topTitle = dlg.querySelector('[data-ts-toptitle]'), top = dlg.querySelector('.ts-top');
  function reveal() {
    var d = dlg.querySelector('[data-ts-detail]:not([hidden])'); if (!d) return;
    var cover = d.querySelector('.ts-big').getBoundingClientRect();
    topTitle.classList.toggle('on', cover.top + cover.height * 0.6 < top.getBoundingClientRect().bottom);
  }
  dlg.addEventListener('scroll', reveal, { passive: true });
"""
