"""「藝人範本」頁（站長 2026-11-11：範本庫獨立一頁，導到申請成為創作者）。給一般使用者看。

文案照 docs/52-artist-template-plan.md（只讀），不自己編：
- 打開就看得到靈感、錄音、編曲、和弦譜的全過程：§1 目標
- 免費版也能播放範本裡的疊錄與專業效果器（能聽、不能改 Pro 設定）：§1
- 免費版也能下載、不算進 6 首：§2 第 2、3 列
- 下載前試聽 Demo 版；正式發行後放發行版：§2 第 6 列、§8
- 範本庫還沒推出（docs/52 狀態：等跟藝人談完才開發）→ 頁面寫「即將推出」，示範手機標示意
範本庫（站長 2026-11-11「App 內假的跟我的都先做進去」）＝site_store.py：照 App 範本支線的範本庫，
站長的〈there's nothing...〉＋10 組示意範本；示範手機也換成同一份清單。
"""
from site_store import STORE_CSS, store_dialog, store_phone, store_wall
from site_theme import esc

TEMPLATES_CSS = STORE_CSS + """
.tp-cta { margin:2.6rem 0 0.5rem; padding:1.6rem 1.3rem; border-radius:20px; background:var(--card); border:1px solid var(--line); text-align:center; }
.tp-cta h2 { font-size:clamp(1.3rem,3vw,1.6rem); font-weight:800; }
.tp-cta p { color:var(--sub); margin:0.5rem auto 1.1rem; max-width:32rem; line-height:1.8; }
"""

POINTS = [
    "打開就看得到一首歌的全過程：靈感、錄音、編曲、和弦譜。",
    "免費下載，而且不算進免費版的 6 首。",
    "免費版也能播放範本裡的疊錄與效果器：能聽，不能改 Pro 的設定。",
    "下載前可以先試聽藝人用和弦備忘錄做的 demo；歌正式發行後，也會放上發行版。",
]


def templates_body(root: str) -> str:
    head = ('<section class="pg-head"><div class="sc-in"><h1>藝人範本</h1>'
            "<p>合作藝人用和弦備忘錄做的歌，下載下來就是一份完整的範本。範本庫即將推出。</p></div></section>")
    points = '<ul class="points">' + "".join(f"<li>{esc(p)}</li>" for p in POINTS) + "</ul>"
    main = (f'<section class="cr-sec" data-reveal><h2>範本裡有什麼</h2>'
            f'<div class="cr-split"><div>{points}</div>{store_phone(root)}</div></section>')
    cta = ('<section class="tp-cta" data-reveal><h2>你是音樂人？</h2>'
           "<p>用和弦備忘錄做一首完整的歌，放上範本庫，給所有使用者下載當範本。</p>"
           f'<a class="btn" href="{root}creator/">申請成為創作者</a></section>')
    return head + f'<div class="cr-wrap">{store_wall(root)}{main}{cta}</div>' + store_dialog(root)
