"""「申請成為創作者」頁（站長 2026-11-12 照一般推薦計畫頁重排：開頭＋申請鈕→怎麼開始→你會拿到→兩種合作→適合誰→常見問題→申請表）。

分潤成數、粉絲折扣、結算、規則、範本標準都不公開，收到申請信後用 Email 說明（站長 2026-11-11、11-12）。
永久版 Pro 代碼（docs/33 §10.2）不寫在網站上（站長 11-12：怕有人來亂拿）。一週內回覆、沒有粉絲數門檻：站長 11-12。

出處（只放在程式註解，頁面不顯示）：
- 計畫概要：docs/33-monetization-plan.md §10.1、§10.2（專屬折扣碼、用碼成交才分潤）
- 藝人範本概要：docs/52-artist-template-plan.md §1（給所有使用者下載當範本）、§2（做範本成數較高、免費下載）
- 誰可以申請：docs/33 §10.1；網站不寫「台灣」（站長 11-12）；從官網申請、寄到 CONTACT_EMAIL：站長 2026-11-11
- 代碼規則：docs/33 §10.2（自訂碼、英數 ≤10 字元；兌換連結，沒裝 App 會先引導下載）；揭露合作：§10.6
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
.cr-cta { justify-content:center; }
.cr-cards { list-style:none; display:grid; grid-template-columns:minmax(0,1fr); gap:0.8rem; margin-top:0.9rem; }
@media (min-width:700px) { .cr-cards { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:860px) { .cr-cards.three { grid-template-columns:repeat(3,minmax(0,1fr)); } }
.cr-cards li { background:var(--card); border-radius:22px; padding:1.3rem 1.3rem; display:grid; gap:0.3rem; align-content:start; }
.cr-cards strong { font-size:1.1rem; } .cr-cards span { color:var(--sub); line-height:1.7; }
.cr-cards a { display:block; margin-top:0.4rem; }
.cr-faq { display:grid; gap:0.5rem; margin-top:0.9rem; }
.cr-faq details { background:var(--card); border-radius:16px; padding:0.9rem 1.1rem; }
.cr-faq summary { font-weight:600; cursor:pointer; }
.cr-faq details p { margin-top:0.4rem; }
"""


def _sec(anchor: str, title: str, inner: str) -> str:
    return f'<section class="cr-sec" id="{anchor}" data-reveal><h2>{esc(title)}</h2>{inner}</section>'


def _cards(items: list[tuple[str, str]], three: bool = False) -> str:
    return f'<ul class="cr-cards{" three" if three else ""}">' + "".join(f"<li><strong>{esc(t)}</strong><span>{d}</span></li>" for t, d in items) + "</ul>"


def how() -> str:
    """三個步驟（站長 2026-11-12：一週內用 Email 回覆；LINE 只是方便）。"""
    steps = [f'填下面的申請表，寄到 <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>。',
             "一週內用 Email 回信，說明合作方式。",
             "談定後拿到你的專屬折扣碼，開始推薦。"]
    return _sec("how", "怎麼開始", '<ol class="cr-steps">' + "".join(f"<li>{x}</li>" for x in steps) + "</ol>")


def get() -> str:
    """docs/33 §10.2：自訂折扣碼（≤10 字元、英數）＋兌換連結。永久版 Pro 代碼不公開（站長 11-12：怕有人來亂拿）。"""
    return _sec("get", "你會拿到", _cards([
        ("專屬折扣碼", "代碼可以自訂，例如用你藝名的英文，粉絲在 App 裡輸入就能用。"),
        ("兌換連結", "粉絲點一下就能用你的碼購買，沒裝 App 的人會先被帶去下載。"),
    ]))


def ways(root: str) -> str:
    """合作方式：推薦、推薦＋做範本、只做範本（沒有分潤；站長 11-12）（docs/33 §10.3 做範本成數較高、docs/52 §1 範本給所有使用者下載）。成數不公開。"""
    # 站長 2026-11-12：推薦（有分潤）／推薦＋做範本（分潤更高）／只做範本也可以，但沒有分潤
    return _sec("plan", "合作方式", _cards([
        ("推薦", "用你喜歡的方式推薦和弦備忘錄，有人用你的碼購買 Pro，你就能分潤。"),
        ("推薦＋做一份藝人範本", "除了推薦，再挑一首你已經發行的歌，用和弦備忘錄做成範本，放上範本庫給大家下載。分潤更高。"  # 站長 11-13：範本只收已發行的歌
                              
                              f'<a href="{root}templates/">看看藝人範本長什麼樣子</a>'),
        ("只投稿範本", "不加入分潤計畫也可以，單純投稿用和弦備忘錄做的範本。範本一樣放上範本庫，只是沒有分潤。"),  # 站長 11-13
    ], three=True) + "<p>分潤比例、粉絲拿到的折扣和結算方式，都會在收到申請後用 Email 跟你說明。</p>")


def who() -> str:
    return _sec("who", "適合誰", "<p>獨立音樂人、會寫歌的人都可以申請，沒有粉絲數門檻。</p>")


FAQ = [
    ("要付錢嗎？", "不用。申請和合作都不收費。"),
    ("要有很多粉絲嗎？", "不用，沒有粉絲數門檻。"),
    ("多久會回覆？", "收到申請後一週內，用 Email 回信。"),
    ("怎麼算是我推薦的？", "粉絲用你的專屬折扣碼或兌換連結購買 Pro，就算你的。"),
    ("推薦時要註明是合作嗎？", "要。怎麼推薦由你決定，但請讓看的人知道這是合作。"),  # docs/33 §10.6
    ("不加入分潤計畫，可以只投稿範本嗎？", "可以，範本一樣會放上範本庫，只是沒有分潤。"),  # 站長 11-13
    ("範本要用哪一首歌？", "用你已經正式發行的歌。大家會先聽到正式版，再看這首歌一開始的樣子。"),  # 站長 11-13：只收已發行
]


def faq() -> str:
    items = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in FAQ)
    return _sec("faq", "常見問題", f'<div class="cr-faq">{items}</div>')


def apply_form() -> str:
    return _sec("apply", "申請", application_form())


def creator_body(root: str) -> str:
    """站長 2026-11-12：照一般推薦計畫頁的順序重排（研究見對話紀錄）；成數、折扣、結算都不公開，申請後 Email 說明。"""
    jump = "".join(f'<a href="#{a}">{t}</a>' for a, t in
                   [("how", "怎麼開始"), ("get", "你會拿到"), ("plan", "合作方式"), ("faq", "常見問題"), ("apply", "申請")])
    head = ('<section class="pg-head"><div class="sc-in"><h1>申請成為創作者</h1>'
            "<p>推薦和弦備忘錄，用你的專屬折扣碼。有人用碼買 Pro，你就有分潤。</p>"
            '<div class="sc-actions cr-cta"><a class="btn" href="#apply">申請成為創作者</a></div>'
            f'<nav class="jump" aria-label="跳到段落">{jump}</nav></div></section>')
    return head + f'<div class="cr-wrap">{how() + get() + ways(root) + who() + faq() + apply_form()}</div>'


def CREATOR_JS(root: str) -> str:  # noqa: N802（沿用 build_site 的常數式命名）
    return CREATOR_PHONE_JS(root) + FORM_JS
