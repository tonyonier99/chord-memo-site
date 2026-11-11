"""全站往 Apple 官網風格收斂（站長 2026-11-12）：最後載入，覆蓋各頁樣式。

1. 首頁不再固定深色（改在 site_home_style.py）。
2. 只用系統字：等寬字只留在指板品格數字，其他（歌曲資訊、重點條列、標籤、和弦名）改回系統字＋等寬數字。
3. 標題放大、行距收緊、段落留白加大，段落之間不畫分隔線。
4. 卡片不畫邊框，只靠底色深淺區分。
5. 按鈕字改細、拿掉外框與上浮；次要按鈕改成藍字加「›」。
"""

_BORDERLESS = (".tile, .st-chords, .st-tool, .card, .sc-final, .ph-card, .cr-form, .cr-steps li, .tp-cta, .jump a, "
               ".price-row div, .tw-welcome")

APPLE_CSS = f"""
h1, h2, h3 {{ letter-spacing:-0.015em; }}
.st-copy h1, .sc-copy h1 {{ font-size:clamp(2.6rem,7vw,4.6rem); line-height:1.08; font-weight:700; }}
.st-copy h2, .st-head h2, .sc-copy h2, .sc-sec-head h2 {{ font-size:clamp(2rem,5vw,3.2rem); line-height:1.15; font-weight:700; }}
.st-copy h2 {{ font-size:clamp(1.8rem,3.6vw,2.6rem); }}
h1, h2 {{ text-wrap:balance; }}
.st-lead, .sc-lead {{ font-size:clamp(1.05rem,1.6vw,1.25rem); line-height:1.65; }}
.st-band, .sc-band {{ padding:clamp(4rem,9vw,7rem) 0; border-top:0; }}
.studio .sc-band {{ border-top:0; }}
.st-hero {{ padding:clamp(3rem,8vw,6rem) 0; border-bottom:0; }}
.st-steps {{ padding-top:clamp(3rem,8vw,6rem); }}
.st-step {{ border-top:0; padding:clamp(2.6rem,6vw,4.5rem) 0; }}
{_BORDERLESS} {{ border-color:transparent; }}
a.tile:hover {{ transform:none; box-shadow:none; border-color:transparent; }}
.st-mono, .st-points li, .st-tags, .st-chord-row button, .st-guess .fg-chips span {{ font-family:inherit; font-variant-numeric:tabular-nums; }}
.st-eyebrow, .sc-eyebrow, .tile .t-eyebrow {{ font-weight:600; letter-spacing:0; }}
.site-nav a {{ font-weight:400; font-size:0.88rem; }}
.logo {{ font-weight:600; }}
.nav-cta {{ font-weight:500; font-size:0.82rem; padding:0.32rem 0.9rem; }}
.btn {{ font-weight:500; font-size:1.02rem; min-height:44px; padding:0 1.4rem; border:0; }}
.btn:hover {{ transform:none; filter:brightness(1.08); }}
.btn.ghost {{ min-height:44px; padding:0 0.4rem; background:none; }}
.btn.ghost::after {{ content:"\\00a0›"; }}
.btn.ghost:hover {{ text-decoration:underline; filter:none; }}
.tile li {{ font-weight:500; }}
.tile .t-more {{ font-weight:500; }}
"""
