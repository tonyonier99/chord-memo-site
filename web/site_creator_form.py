"""創作者頁的申請表（站長 2026-11-11：官網填表，寄到 CONTACT_EMAIL）。

不串任何後端：按「送出」只在瀏覽器把填的內容組成一封信，打開訪客自己的郵件 App，信由訪客寄出；網站不儲存、不上傳。
欄位：藝名或名字、Email（必填，回覆用）、LINE ID（選填；聯絡以 Email 為主）、作品連結（可多條，一行一條）、
合作方式（三選一，跟 site_creator.ways 三張卡同名；站長 11-13：要能選加不加入分潤）、想說的話。
"""
from site_content import CONTACT_EMAIL
from site_theme import esc

FORM_CSS = """
.cr-form { margin-top:1.2rem; padding:1.4rem 1.2rem; background:var(--card); border:1px solid var(--line); border-radius:18px; display:grid; gap:0.95rem; }
.cr-form h3 { font-size:1.1rem; }
.cr-form label { display:grid; gap:0.35rem; font-weight:700; font-size:0.95rem; }
.cr-form label small { font-weight:400; color:var(--sub); }
.cr-form input[type=text], .cr-form input[type=email], .cr-form input[type=url], .cr-form textarea {
  width:100%; font:inherit; font-weight:400; color:var(--ink); background:var(--bg); border:1px solid var(--line); border-radius:10px; padding:0.6rem 0.75rem; }
.cr-form textarea { min-height:6rem; resize:vertical; }
.cr-form input:focus, .cr-form textarea:focus { outline:2px solid var(--accent); outline-offset:1px; }
.cr-form fieldset { border:0; display:grid; gap:0.45rem; }
.cr-form legend { font-weight:700; font-size:0.95rem; margin-bottom:0.35rem; }
.cr-form .cr-check { display:flex; align-items:baseline; gap:0.55rem; font-weight:600; background:var(--bg); border-radius:12px;
  padding:0.7rem 0.85rem; cursor:pointer; }
.cr-form .cr-check small { display:block; font-weight:400; color:var(--sub); font-size:0.85rem; }
.cr-form .cr-check input { accent-color:var(--accent); transform:translateY(1px); }
.cr-form .cr-err { color:var(--record); font-weight:600; font-size:0.85rem; min-height:1em; }
.cr-form .cr-note { color:var(--sub); font-size:0.85rem; line-height:1.7; }
.cr-form button { justify-self:start; }
"""


# (值, 名稱, 一句說明)；名稱跟創作者頁「合作方式」三張卡一樣
PLAN_CHOICES = [
    ("推薦", "推薦", "有分潤"),
    ("推薦＋做一份藝人範本", "推薦＋做一份藝人範本", "分潤更高"),
    ("只投稿範本", "只投稿範本", "不加入分潤計畫"),
]


def _plans() -> str:
    def opt(i: int, value: str, name: str, note: str) -> str:
        checked = " checked" if i == 0 else ""
        return (f'<label class="cr-check"><input type="radio" name="plan" value="{esc(value)}"{checked}>'
                f'<span>{esc(name)}<small>{esc(note)}</small></span></label>')
    return '<fieldset><legend>合作方式</legend>' + "".join(opt(i, *c) for i, c in enumerate(PLAN_CHOICES)) + "</fieldset>"


def _field(name: str, label: str, kind: str = "text", hint: str = "", required: bool = False, maxlen: int = 80) -> str:
    req = " required" if required else ""
    mark = "（必填）" if required else ""
    small = f"<small>{esc(hint)}</small>" if hint else ""
    if kind == "textarea":
        control = f'<textarea name="{name}" maxlength="{maxlen}"{req}></textarea>'
    else:
        control = f'<input type="{kind}" name="{name}" maxlength="{maxlen}" autocomplete="off"{req}>'
    return f'<label>{esc(label)}{mark}{small}{control}</label>'


def application_form() -> str:
    return ('<form class="cr-form" id="form" data-apply novalidate>'
            '<h3>申請表</h3>'
            + _field("name", "藝名或名字", required=True, maxlen=40)
            + _field("email", "Email", "email", "開發者會用這個回覆你", required=True, maxlen=120)
            + _field("line", "LINE ID（選填）", maxlen=40)  # 站長 2026-11-12：LINE 只是方便，主要用 Email 聯絡
            # 站長 2026-11-12：作品連結可以多份 → 多行文字，一行一條
            + _field("works", "作品連結", "textarea", "一行貼一條，可以貼好幾條：StreetVoice、YouTube、Spotify… 都可以", maxlen=1200)
            + _plans()
            + _field("note", "想說的話", "textarea", maxlen=500)
            + '<p class="cr-err" data-err role="alert"></p>'
            + '<button type="submit" class="btn">送出申請</button>'
            + f'<p class="cr-note" data-done>按「送出申請」會打開你的郵件 App，寄到 <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a>，'
            '信由你自己寄出；網站不會儲存或上傳你填的內容。</p></form>')


FORM_JS = """<script>
(function () {
  var form = document.querySelector('[data-apply]'); if (!form) return;
  var err = form.querySelector('[data-err]'), TO = '""" + CONTACT_EMAIL + """';
  function val(n) { return (form.elements[n].value || '').trim(); }
  function links() { return val('works').split(/\\s*\\n\\s*/).filter(Boolean); }
  function check() {
    if (!val('name')) return { field: 'name', text: '請填藝名或名字' };
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(val('email'))) return { field: 'email', text: '請填正確的 Email' };
    var bad = links().filter(function (l) { return !/^https?:\\/\\/\\S+\\.\\S+$/.test(l); });
    if (bad.length) return { field: 'works', text: '作品連結請一行一條、貼完整網址（https:// 開頭）：' + bad[0] };
    return null;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = check();
    if (bad) { err.textContent = bad.text; form.elements[bad.field].focus(); return; }
    err.textContent = '';
    var lines = ['藝名或名字：' + val('name'), 'Email：' + val('email'), 'LINE ID：' + (val('line') || '（沒填）'),
      '作品連結：' + (links().length ? '\\n' + links().join('\\n') : '（沒填）'), '合作方式：' + ((form.querySelector('input[name=plan]:checked') || {}).value || '（沒選）'), '', '想說的話：', val('note') || '（沒填）'];
    var url = 'mailto:' + TO + '?subject=' + encodeURIComponent('申請成為和弦備忘錄創作者：' + val('name')) + '&body=' + encodeURIComponent(lines.join('\\n'));
    window.location.href = url;
  });
})();
</script>"""
