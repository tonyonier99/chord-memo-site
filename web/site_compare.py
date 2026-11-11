"""功能頁「免費版 vs 和弦備忘錄 Pro」對照表（站長 2026-11-11 要做）。

每列照 App 原始碼（和弦大師/native/ChordMaster，只讀）與 docs/33 2026-10-10、10-13 裁決，不自己編：
- 歌曲 6 首、範例歌不算：SettingsView.swift FreeTier.demoLimit；PaywallView.swift「免費版可以寫 6 首」
- 靈感匣不限：PaywallView.swift「靈感匣不限數量」
- 編曲 2 軌／6 軌：OverdubGate.swift、ArrangeLaneLock.swift（App 兩種說法「層」「軌」，網站統一用「軌」）
- 每首編曲 1 份／多份：PaywallView.swift multipleArrangements 說明
- 效果器：OverdubGate.swift（免費＝預設風格、強度、音量、Pan；Pro＝單獨調整六種效果與專業模式、整首 Limiter）
- 分享混音、和弦譜圖片與 ChordPro 免費：OverdubGate exportMix、OthersView.swift（沒有權益檢查）
- 匯出分軌：StemExportSheet.swift「每軌一個 WAV，打包成 ZIP」
- 傳送副本：SongSendCopy.swift（傳送要 Pro；收到、匯入免費但算進 6 首）
- 重點範圍循環、進階搜尋、安靜回訪：PaywallView.swift 對應理由的說明、SongGalleryView.swift 進階搜尋三種篩選
不列：版本上限／收藏版本（付費牆文案還在，但程式沒有任何地方會叫出來）、回到起點／版本比較／標籤（10-10 裁決撤下）。
"""
from site_theme import esc

NO = "—"

COMPARE = [
    ("歌曲", "6 首（範例歌不算）", "不限"),
    ("靈感匣", "不限", "不限"),
    ("編曲軌數", "2 軌（原始錄音＋1 軌）", "6 軌（原始錄音＋5 軌）"),
    ("每首歌的編曲", "保留 1 份", "可保留不同錄音的編曲"),
    ("效果器", "所有預設風格、效果強度、音量、Pan", "再加上單獨調整 Noise Gate、EQ、Compressor、Overdrive、Delay、Reverb 與專業模式，整首 Limiter 自己決定"),
    ("分享混音", "可以", "可以"),
    ("和弦譜（圖片、ChordPro）", "可以", "可以"),
    ("匯出分軌", NO, "每軌一個 WAV，打包成 ZIP"),
    ("整首歌的副本", "可以收、可以匯入（算進 6 首）", "也能傳送給別人"),
    ("重點範圍循環", NO, "標記一段範圍並循環播放"),
    ("搜尋", "基本搜尋與篩選", "再加上依階段、重點、回訪狀態篩選"),
    ("安靜回訪", NO, "每週在首頁挑一首暫放、回來聽或很久沒打開的歌"),
]

COMPARE_CSS = """
.cmp { width:100%; border-collapse:collapse; margin-top:0.8rem; font-size:0.93rem; table-layout:fixed; }
.cmp th, .cmp td { text-align:left; padding:0.62rem 0.5rem; border-bottom:1px solid var(--line); vertical-align:top; line-height:1.6; }
.cmp thead th { color:var(--sub); font-size:0.82rem; font-weight:700; }
.cmp thead th:last-child { color:var(--accent); }
.cmp tbody th { font-weight:700; width:28%; }
.cmp td { color:var(--sub); } .cmp td:last-child { color:var(--ink); }
@media (max-width:560px) { .cmp { font-size:0.84rem; } .cmp th, .cmp td { padding:0.55rem 0.3rem; } }
"""


def compare_table(pro_name: str) -> str:
    rows = "".join(f"<tr><th scope=\"row\">{esc(item)}</th><td>{esc(free)}</td><td>{esc(pro)}</td></tr>"
                   for item, free, pro in COMPARE)
    return (f'<table class="cmp"><thead><tr><th scope="col">功能</th><th scope="col">免費版</th>'
            f'<th scope="col">{esc(pro_name)}</th></tr></thead><tbody>{rows}</tbody></table>')
