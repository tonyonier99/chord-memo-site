"""法務三頁（隱私政策、使用條款、支援）：讀 chord-memo-site 現有的 .md，內文一字不改，只換版型。

只支援這三份檔案用到的 Markdown：front matter、## 標題、段落、- 清單、| 表格 |、**粗體**、[文字](連結)、<網址>。
段落內的單一換行（支援頁問答）轉成 <br>，字不變。
"""
import re
from pathlib import Path

from site_theme import esc

LEGAL_CSS = """
.legal-head { padding:2.8rem 0 1rem; background:var(--hero); }
.legal-head h1 { font-size:clamp(1.8rem,4vw,2.4rem); font-weight:800; }
.legal { max-width:760px; margin:0 auto; padding:1.6rem 16px 0; }
.legal-body { padding:1.6rem 1.4rem; }
@media (min-width:700px) { .legal-body { padding:2.2rem 2.4rem; } }
.legal-body h2 { font-size:1.25rem; margin:2rem 0 0.6rem; line-height:1.45; }
.legal-body h2:first-child { margin-top:0; }
.legal-body p { margin:0.7rem 0; }
.legal-body ul { margin:0.6rem 0 1rem 1.3rem; }
.legal-body li { margin:0.35rem 0; padding-left:0.2rem; }
.legal-body li::marker { color:var(--accent); }
.legal-body a { overflow-wrap:anywhere; }
.table-wrap { overflow-x:auto; margin:1rem 0; -webkit-overflow-scrolling:touch; }
.legal-body table { border-collapse:collapse; width:100%; min-width:520px; font-size:0.94rem; }
.legal-body th, .legal-body td { border:1px solid var(--line); padding:0.6rem 0.7rem; text-align:left; vertical-align:top; }
.legal-body th { background:var(--fill); }
.legal-body th:first-child, .legal-body td:first-child { white-space:nowrap; }
"""

INLINE_PATTERNS = [
    (re.compile(r"\*\*(.+?)\*\*"), lambda m: f"<strong>{m.group(1)}</strong>"),
    (re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)"), lambda m: f'<a href="{m.group(2)}">{m.group(1)}</a>'),
    (re.compile(r"&lt;(https?://[^\s&]+)&gt;"), lambda m: f'<a href="{m.group(1)}" rel="noopener">{m.group(1)}</a>'),
]


def read_markdown(path: Path) -> tuple[dict, str]:
    """回傳 (front matter, 內文)。檔案不存在或格式不對就丟出清楚的錯誤。"""
    if not path.is_file():
        raise FileNotFoundError(f"找不到法務原稿：{path}")
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not match:
        raise ValueError(f"{path.name} 缺少 front matter")
    meta = dict(line.split(": ", 1) for line in match.group(1).splitlines() if ": " in line)
    return meta, text[match.end():]


def inline(text: str) -> str:
    html = esc(text)
    for pattern, repl in INLINE_PATTERNS:
        html = pattern.sub(repl, html)
    return html


def table_html(rows: list[str]) -> str:
    cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
    body_rows = [r for r in cells[1:] if not all(set(c) <= set("-: ") for c in r)]
    head = "".join(f"<th>{inline(c)}</th>" for c in cells[0])
    body = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body_rows)
    return f'<div class="table-wrap"><table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'


def block_html(lines: list[str]) -> str:
    first = lines[0]
    if first.startswith("## "):
        return f"<h2>{inline(first[3:])}</h2>"
    if first.startswith("|"):
        return table_html(lines)
    if first.startswith("- "):
        return "<ul>" + "".join(f"<li>{inline(item[2:])}</li>" for item in lines) + "</ul>"
    return "<p>" + "<br>".join(inline(line) for line in lines) + "</p>"


def split_blocks(body: str) -> list[list[str]]:
    """以空行分段；標題一定自成一段。"""
    blocks: list[list[str]] = []
    current: list[str] = []
    for line in body.splitlines():
        if not line.strip() or line.startswith("## "):
            if current:
                blocks.append(current)
            current = [line] if line.startswith("## ") else []
            if line.startswith("## "):
                blocks.append(current)
                current = []
            continue
        current = [*current, line]
    if current:
        blocks.append(current)
    return blocks


def markdown_to_html(body: str) -> str:
    return "\n".join(block_html(b) for b in split_blocks(body))


def legal_body(meta: dict, body: str) -> str:
    title = meta.get("title", "")
    return (f'<section class="legal-head"><div class="sc-in"><h1>{esc(title)}</h1></div></section>'
            f'<div class="legal"><article class="card legal-body" data-legal>\n{markdown_to_html(body)}\n</article></div>')
