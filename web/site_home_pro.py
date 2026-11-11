"""首頁「免費版與 Pro」（站長 2026-11-12：要有圖表對比）。

由上到下：三條長條對比（差最多的三項）→ 完整對照表（site_compare.COMPARE，每列已註明 App 出處）→ 三個方案價格卡。
長條的數字全取自 COMPARE 那幾列：編曲軌數 2／6、歌曲 6 首／不限、每首編曲 1 份／多份；「不限」「多份」畫滿格並寫字，不編數字。
"""
from site_compare import COMPARE_CSS, compare_table
from site_content import PRO_NAME, PRO_PLANS, PRO_PRICES
from site_theme import esc

# (項目, 免費版長度 0–1, 免費版文字, Pro 長度, Pro 文字)
BARS = [
    ("編曲軌數", 2 / 6, "2 軌", 1.0, "6 軌"),
    ("歌曲", 0.35, "6 首", 1.0, "不限"),
    ("每首歌的編曲", 0.2, "1 份", 1.0, "多份"),
]


def _bar(name: str, free_w: float, free_t: str, pro_w: float, pro_t: str) -> str:
    return (f'<div class="pb-item"><p class="pb-name">{esc(name)}</p>'
            f'<div class="pb-row"><span class="pb-who">免費版</span><span class="pb-track"><i style="width:{free_w * 100:.0f}%"></i></span>'
            f'<b>{esc(free_t)}</b></div>'
            f'<div class="pb-row pro"><span class="pb-who">Pro</span><span class="pb-track"><i style="width:{pro_w * 100:.0f}%"></i></span>'
            f'<b>{esc(pro_t)}</b></div></div>')


def _prices() -> str:
    cells = "".join(f'<div class="pb-plan"><span>{esc(n.removeprefix(PRO_NAME).strip())}</span><strong>{esc(p)}</strong>'
                    f'<small>{esc(note)}</small></div>' for n, p, note in PRO_PRICES)
    return f'<div class="pb-plans">{cells}</div>'


def pro_section() -> str:
    bars = "".join(_bar(*b) for b in BARS)
    return (f'<section class="st-band"><div class="sc-in"><div class="st-head" data-reveal><h2>免費版與 {esc(PRO_NAME)}</h2>'
            f'<p class="st-lead">{esc(PRO_PLANS)}</p></div>'
            f'<div class="pb-bars" data-reveal>{bars}</div>'
            f'<div class="pb-table" data-reveal>{compare_table(PRO_NAME)}</div>'
            f'{_prices()}</div></section>')


HOME_PRO_CSS = COMPARE_CSS + """
.pb-bars { display:grid; grid-template-columns:minmax(0,1fr); gap:1rem; margin-top:2rem; }
@media (min-width:860px) { .pb-bars { grid-template-columns:repeat(3,minmax(0,1fr)); } }
.pb-item { background:var(--card); border-radius:24px; padding:1.4rem 1.3rem; display:grid; gap:0.6rem; }
.pb-name { font-weight:700; font-size:1.1rem; }
.pb-row { display:grid; grid-template-columns:3.4rem 1fr 3rem; align-items:center; gap:0.6rem; }
.pb-who { color:var(--sub); font-size:0.85rem; }
.pb-track { height:12px; border-radius:6px; background:var(--fill); overflow:hidden; }
.pb-track i { display:block; height:100%; border-radius:6px; background:#AEAEB2; }
.pb-row.pro .pb-track i { background:var(--accent); }
.pb-row b { font-variant-numeric:tabular-nums; text-align:right; }
.pb-row.pro b { color:var(--accent-ink); }
.pb-table { background:var(--card); border-radius:28px; padding:1.2rem 1.4rem 0.6rem; margin-top:1rem; overflow-x:auto; }
.pb-plans { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:0.8rem; margin-top:1rem; }
.pb-plan { background:var(--card); border-radius:22px; padding:1.2rem 1rem; text-align:center; display:grid; gap:0.2rem; }
.pb-plan span { color:var(--sub); font-size:0.9rem; } .pb-plan strong { font-size:1.5rem; font-variant-numeric:tabular-nums; }
.pb-plan small { color:var(--accent-ink); font-size:0.82rem; min-height:1.2em; }
@media (max-width:520px) { .pb-plans { grid-template-columns:minmax(0,1fr); } .pb-plan { grid-template-columns:auto 1fr; text-align:left; align-items:baseline; }
  .pb-plan strong { text-align:right; } .pb-plan small { grid-column:1 / -1; } }
"""
