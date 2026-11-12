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
from site_store import STORE_CSS, store_dialog, store_wall
from site_icons import ICON_CSS, icon
from site_theme import esc

TEMPLATES_CSS = STORE_CSS + ICON_CSS + """
.tp-points { list-style:none; display:grid; grid-template-columns:minmax(0,1fr); gap:0.8rem; margin-top:1.2rem; }
@media (min-width:760px) { .tp-points { grid-template-columns:repeat(2,minmax(0,1fr)); } }
.tp-points li { background:var(--card); border-radius:20px; padding:1.3rem 1.4rem; display:flex; flex-direction:column; gap:0.3rem; }
.tp-ic { color:var(--accent); font-size:1.6rem; line-height:1; display:flex; margin-bottom:0.4rem; }
.tp-points strong { font-size:1.08rem; }
.tp-points li > span:last-child { color:var(--sub); font-size:0.94rem; line-height:1.65; }
.tp-cta { margin:2.6rem 0 0.5rem; padding:1.6rem 1.3rem; border-radius:20px; background:var(--card); border:1px solid var(--line); text-align:center; }
.tp-cta h2 { font-size:clamp(1.3rem,3vw,1.6rem); font-weight:800; }
.tp-cta p { color:var(--sub); margin:0.5rem auto 1.1rem; max-width:32rem; line-height:1.8; }
"""

# 站長 11-13：「免費下載」單獨一句沒意義 → 拆成「範本裡有什麼」（四個分頁各有什麼）＋「下載前後」。
# 內容照 docs/52 §5.1 範本驗收標準（必備項）、§0 R8（唯讀、四分頁都能播、可移除下載）、§2 第 3、6 列（免費下載、先試聽）。
# 站長 11-13：別寫得像在跟開發者說話（不講軌數、分頁、驗收條件），用聽歌的人的角度寫。
INSIDE = [
    ("lightbulb", "靈感", "這首歌最早哼的那一段、寫下的第一句話，還有當時的照片和塗鴉。"),
    ("mic.fill", "錄音", "藝人錄的完整版本，還有邊聽邊留下的重點筆記。"),
    ("slider.vertical.3", "編曲", "看藝人怎麼一軌一軌疊出整首歌，連效果器的聲音都聽得到。"),
    ("music.note.list", "和弦", "整首歌的和弦和歌詞，拿起吉他就能跟著彈。"),
]
DOWNLOAD = [
    ("play.circle.fill", "先聽正式作品", "下載前先聽正式發行的版本；下載後，看這首歌的靈感、錄音、編曲和和弦。"),
    ("arrow.down.to.line", "免費下載", "不用升級 Pro，整首歌的過程從頭看到尾。"),
    ("lock.fill", "藝人的原版", "範本是藝人的作品，可以看、可以聽，但不能修改。"),
    ("trash", "隨時刪掉", "不想留了就刪掉，想看的時候再下載回來。"),
]


def _cards(items: list[tuple[str, str, str]]) -> str:
    return '<ul class="tp-points">' + "".join(
        f'<li><span class="tp-ic">{icon(ic)}</span><strong>{esc(t)}</strong><span>{esc(d)}</span></li>' for ic, t, d in items) + "</ul>"


def templates_body(root: str) -> str:
    head = ('<section class="pg-head"><div class="sc-in"><h1>藝人範本</h1>'
            "<p>合作藝人用和弦備忘錄做的歌，下載下來就是一份完整的範本。</p></div></section>")  # 站長 11-12：網站當 App 已上架
    # 站長 2026-11-12：上面已經是真的範本庫，下面不再放一支一樣內容的示範手機 → 四點改成卡片
    main = (f'<section class="cr-sec" data-reveal><h2>範本裡有什麼</h2>{_cards(INSIDE)}</section>'
            f'<section class="cr-sec" data-reveal><h2>下載前後</h2>{_cards(DOWNLOAD)}</section>')
    cta = ('<section class="tp-cta" data-reveal><h2>你是音樂人？</h2>'
           "<p>把你的歌做成範本，放上範本庫，讓大家看見一首歌從靈感到編曲的樣子。</p>"  # 站長 11-13：不寫「挑已發行的歌來做」（像反著做）
           f'<a class="btn" href="{root}creator/">申請成為創作者</a></section>')
    return head + f'<div class="cr-wrap">{store_wall(root)}{main}{cta}</div>' + store_dialog(root)
