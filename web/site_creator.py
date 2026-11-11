"""「申請成為創作者」頁：只放概要＋申請表（站長 2026-11-11：分潤成數、結算、規則、範本標準等細節，收到申請信後才告訴對方）。

出處（只放在程式註解，頁面不顯示）：
- 計畫概要：docs/33-monetization-plan.md §10.1、§10.2（專屬折扣碼、用碼成交才分潤）
- 藝人範本概要：docs/52-artist-template-plan.md §1（給所有使用者下載當範本）、§2（做範本成數較高、免費下載）
- 誰可以申請：docs/33 §10.1（台灣獨立音樂人）；從官網申請、寄到 CONTACT_EMAIL：站長 2026-11-11
範本庫示意手機在藝人範本頁（site_templates.py）；申請表＝開郵件 App 寄信（site_creator_form.py）。
"""
from site_content import CONTACT_EMAIL
from site_creator_form import FORM_CSS, FORM_JS, application_form
from site_creator_phone import CREATOR_PHONE_CSS, CREATOR_PHONE_JS
from site_theme import esc

CREATOR_CSS = CREATOR_PHONE_CSS + FORM_CSS + """
.cr-wrap { max-width:880px; margin:0 auto; padding:0 16px 2rem; }
.cr-sec { padding:2.4rem 0 0.6rem; }
.cr-sec h2 { font-size:clamp(1.35rem,3vw,1.7rem); font-weight:800; margin-bottom:0.7rem; }
.cr-sec p { color:var(--sub); line-height:1.8; margin-top:0.5rem; }
.cr-steps { list-style:none; counter-reset:s; display:grid; gap:0.7rem; margin-top:0.9rem; }
.cr-steps li { counter-increment:s; padding:0.9rem 1rem 0.9rem 3rem; position:relative; background:var(--card); border:1px solid var(--line); border-radius:14px; line-height:1.7; }
.cr-steps li::before { content:counter(s); position:absolute; left:1rem; top:0.85rem; width:1.4rem; height:1.4rem; border-radius:50%;
  background:var(--accent); color:var(--on-accent); font-weight:800; font-size:0.8rem; display:flex; align-items:center; justify-content:center; }
.cr-split { display:grid; grid-template-columns:minmax(0,1fr); gap:1.6rem; align-items:start; }
@media (min-width:860px) { .cr-split { grid-template-columns:minmax(0,1fr) 320px; } }
"""


def _sec(anchor: str, title: str, inner: str) -> str:
    return f'<section class="cr-sec" id="{anchor}" data-reveal><h2>{esc(title)}</h2>{inner}</section>'


def _points(items: list[str]) -> str:
    return '<ul class="points">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def plan() -> str:
    inner = _points([
        "你會拿到自己的專屬折扣碼，用你喜歡的方式推薦和弦備忘錄。",
        "有人用你的碼購買，你就能分潤。",
        "願意用和弦備忘錄做一份藝人範本，分潤更高。",
        "適合台灣獨立音樂人。",
    ]) + "<p>分潤方式和合作細節，收到你的申請後，會直接寫信告訴你。</p>"
    return _sec("plan", "怎麼合作", inner)


def template(root: str) -> str:
    lead = ("<p>合作藝人用和弦備忘錄做一首完整的歌，放上範本庫給所有使用者免費下載："
            "打開就看得到靈感、錄音、編曲、和弦譜的全過程。</p>"
            f'<p><a href="{root}templates/">看看藝人範本長什麼樣子</a></p>')
    return _sec("template", "藝人範本", lead)


def apply_steps() -> str:
    steps = [f'填下面的申請表，寄到 <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>。',
             "開發者回信，跟你說明合作細節。",
             "談定後拿到你的專屬折扣碼，開始推薦。"]
    inner = '<ol class="cr-steps">' + "".join(f"<li>{s}</li>" for s in steps) + "</ol>"
    return _sec("apply", "申請流程", inner + application_form())


def creator_body(root: str) -> str:
    head = ('<section class="pg-head"><div class="sc-in"><h1>申請成為創作者</h1>'
            "<p>用你的專屬折扣碼推薦和弦備忘錄，有人用你的碼購買就能分潤。</p>"
            '<nav class="jump" aria-label="跳到段落"><a href="#plan">怎麼合作</a>'
            '<a href="#template">藝人範本</a><a href="#apply">申請</a></nav></div></section>')
    return head + f'<div class="cr-wrap">{plan() + template(root) + apply_steps()}</div>'


def CREATOR_JS(root: str) -> str:  # noqa: N802（沿用 build_site 的常數式命名）
    return CREATOR_PHONE_JS(root) + FORM_JS
