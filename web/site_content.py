"""官網文案與素材清單。

每一段字都照抄自 App 原始碼、現有官網或專案設定，註解寫明出處；不自己編寫。
App 原始碼位置：$CHORD_APP_DIR（預設 ~/Claude/和弦大師，只讀）。
找不到依據的字標【待站長確認】，App Store 連結還沒有就用【待補 App Store 連結】。
"""
import os
from pathlib import Path

CHORD_APP_DIR = Path(os.environ.get("CHORD_APP_DIR", str(Path.home() / "Claude" / "和弦大師")))

# 名稱：native/project.yml INFOPLIST_KEY_CFBundleDisplayName；Pro 名稱：PaywallView.swift
APP_NAME = "和弦備忘錄"
PRO_NAME = "和弦備忘錄 Pro"
# chord-memo-site/_config.yml 的 description
TAGLINE = "寫歌用的吉他和弦備忘錄"
# chord-memo-site/index.md 首段
INTRO = ("和弦備忘錄是一款 iPhone 上的寫歌備忘錄：靈感來了一鍵錄下哼唱，用文字、照片、塗鴉記下起點，"
         "再整理成有錄音、歌詞與吉他和弦譜的 demo。")

# App Store 連結：App 原始碼、文件與官網都找不到 → 留空，頁面顯示占位字
APP_STORE_URL = os.environ.get("CHORD_APP_STORE_URL", "")
# 站長 2026-11-11：App 還沒上架，下載鈕先寫這句（上架後設環境變數 CHORD_APP_STORE_URL 就會換成下載鈕）
STORE_PLACEHOLDER = "即將在 App Store 推出"
CONFIRM = "【待站長確認】"

# support.md、privacy.md、terms.md 的聯絡信箱
CONTACT_EMAIL = "tonyonier99@gmail.com"
# GitHub Pages 專案路徑：App Info.plist 的 PrivacyPolicyURL 是 https://tonyonier99.github.io/chord-memo-site/privacy/
SITE_BASE = "/chord-memo-site/"

# 系統需求：native/project.yml（deploymentTarget iOS 18.0、TARGETED_DEVICE_FAMILY "1,2" = iPhone＋iPad）
REQUIREMENT = "iPhone、iPad（iOS 18.0 以上）"

APP_ICON = ("native/ChordMaster/Assets.xcassets/AppIcon.appiconset/AppIcon.png", "app-icon.png")
# 手機下方的標示（照初級大人手冊官網）
DEMO_NOTE = "功能示意・會自己播放・點一下就換你操作"

# 工作區四分頁：WorkspaceChrome.swift WorkspaceTab.label（顯示順序 靈感／錄音／編曲／和弦）
FEATURES = [
    {
        "anchor": "inspiration", "eyebrow": "靈感", "demo": "inspiration",
        "title": "加一則靈感",  # HomeCaptureChoice.swift buttonLabel
        "lead": "想到一句話、錄一段、拍一張或畫一筆，先放這裡。",  # InspirationInboxView.swift 靈感匣空狀態
        "points": ["錄一段聲音", "寫一句話", "加一張照片", "畫一筆"],  # HomeCaptureChoice.swift
    },
    {
        "anchor": "record", "eyebrow": "錄音", "demo": "record",
        "title": "立刻錄音",  # AppShortcuts.swift shortTitle
        # native/project.yml NSMicrophoneUsageDescription
        "lead": "用於哼唱錄音與調音器音高偵測；錄音保存在你的裝置，並在啟用 iCloud 時同步到你的私人 iCloud 空間。",
        "points": ["鎖定螢幕或切到背景時可以繼續錄音"],  # privacy.md 系統權限表「麥克風」列
    },
    {
        "anchor": "arrange", "eyebrow": "編曲", "demo": "arrange",
        "title": "編曲",  # WorkspaceTab.label
        "lead": "主錄音是編曲的第一軌。錄好之後回到這裡，就能一軌一軌疊上去。",  # ArrangeTabView.swift
        "points": ["可以匯入 m4a、wav、mp3。"],  # ArrangeTabView.swift 匯入失敗說明
    },
    {
        "anchor": "chart", "eyebrow": "和弦", "demo": "chart",
        "title": "這首歌的獨特和弦 · 照著按就彈得出來",  # ChartExport.swift／ChordPickerSheet.swift
        "lead": "點一下小節 → 下方點和弦連續填 · 點一下歌詞列寫詞 · 段名旁「歌詞」整段貼上 · 底部「加入段落」開主歌副歌",  # ChartTabView.swift
        "points": ["彈到喜歡的聲音，按出來存進這首歌",  # ChordsTabView.swift
                   "猜不出名字也沒關係，一樣存得起來"],  # FretboardEditorView.swift
    },
]

# 工具與匯出（各配一支示範手機）
TOOL_BANDS = [
    {"anchor": "export", "eyebrow": "分享", "demo": "export",  # OthersView.swift「分享」子選單
     "title": "分享整份譜",  # OthersView.swift（和弦分頁「⋯」）
     "lead": "",
     "points": ["分享整份譜（圖片）", "分享 ChordPro 文字", "複製為 ChordPro"]},  # OthersView.swift 分享子選單
    {"anchor": "tuner", "eyebrow": "工具", "demo": "tuner", "title": "調音器",  # OthersView.swift 工具
     "lead": "音準偵測（調音器）使用裝置麥克風，以自相關估算音高，不會錄音或上傳。",  # SettingsDetailViews.swift
     "points": ["自動", "手動", "半音"]},  # TunerLogic.swift TunerMode
    {"anchor": "metronome", "eyebrow": "工具", "demo": "metronome", "title": "節拍器",  # OthersView.swift 工具
     "lead": "錄音時跟著歌的速度打拍子，先響 1 小節預備拍",  # RecordClickViews.swift
     "points": ["Tap", "預備拍", "按播放先數一小節"]},  # RhythmView.swift
]

# 其他功能卡（首頁 bento、功能頁「還有這些」）：(標題, 說明, 出處)
EXTRAS = [
    ("回來聽聽你的歌", "挑一首暫放的靈感，回來聽 30 秒就好。", "SettingsView.swift 本機提醒文案"),
    ("最近刪除", "不小心刪掉作品怎麼辦？到首頁右上角的「…」選單 >「最近刪除」可以復原。", "support.md 常見問題"),
    ("iCloud 同步（可選）", "你的作品只同步到你自己的 iCloud 私人空間，由 Apple 保管，開發者無法讀取。", "privacy.md"),
    ("靈感匣", "靈感匣不限數量，之後升級或空出位置再整理成歌", "PaywallView.swift"),
]

# 跑馬燈：App 內的功能名稱（HomeCaptureChoice、WorkspaceTab、OthersView、ChartTabView 分享選單、PaywallView、SettingsView）
MARQUEE = ["錄一段聲音", "寫一句話", "加一張照片", "畫一筆", "靈感匣", "錄音", "編曲", "和弦", "調音器", "節拍器",
           "最近刪除", "複製為 ChordPro", "分享整份譜（圖片）", "匯出每一軌", "圈出整段重點", "回來聽聽你的歌"]

# 隱私承諾：privacy.md 首段
PRIVACY_PROMISE = "本 App 沒有帳號系統、沒有廣告、沒有第三方追蹤或分析工具，開發者也沒有自己的伺服器。"

# Pro：PaywallView.swift 好處清單與方案說明；terms.md 付費方案
PRO_BENEFITS = ["免費能用的，升級前後都一樣", "更多歌曲，每首可保留多份編曲", "分軌匯出，帶到電腦繼續製作", "重點範圍循環與安靜回訪"]
# 方案名稱與價格：DemoPro.storekit displayName／displayPrice（= docs/33 2026-11-04 改價，站長 2026-11-11 確認）；
# 第三欄是付費牆方案列下方那行（PlanSavings.swift yearlyNote／lifetimeNote）
PRO_PRICES = [("和弦備忘錄 Pro 月訂", "NT$90", ""), ("和弦備忘錄 Pro 年訂", "NT$990", "比月訂省 1 個月"),
              ("和弦備忘錄 Pro 永久版", "NT$1,990", "不到兩年的月費")]
PRO_PLANS = "和弦備忘錄 Pro 提供月訂閱、年訂閱與一次買斷三種方案，解鎖的功能相同。"  # terms.md
FREE_TIER = "免費版可以完成一張 EP：建立並編輯 6 首作品。"  # terms.md（數字隨 FreeTier.demoLimit，改額度時要跟著改）
