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
# 站長 2026-11-12：App 裡的說明文字不適合當網站文案 → 以下標「站長 11-12 改寫」的句子是改寫版（事實照 App 與隱私政策）
HERO_EYEBROW = "寫歌的人，口袋裡的錄音室"  # 站長 11-12 改寫（首屏小標；TAGLINE 仍給網頁描述用）
INTRO = "靈感用什麼形式都能先記下來。彈到奇怪的和弦，它幫你認出名字、存成你的按法，再錄成一段簡單的 demo。"  # 站長 11-13 定位改寫（靈感快記 → 怪和弦 → 簡易 demo）

# App Store 連結：App 原始碼、文件與官網都找不到 → 留空，頁面顯示占位字
APP_STORE_URL = os.environ.get("CHORD_APP_STORE_URL", "")
# 站長 2026-11-11：App 還沒上架，下載鈕先寫這句（上架後設環境變數 CHORD_APP_STORE_URL 就會換成下載鈕）
STORE_PLACEHOLDER = "即將在 App Store 推出"
CONFIRM = "【待站長確認】"

# support.md、privacy.md、terms.md 的聯絡信箱
CONTACT_EMAIL = "tonyonier99@gmail.com"
# 網站正式網址的根（sitemap、robots、canonical 都用這個；換網域只改這一行）。
# App Info.plist 的 PrivacyPolicyURL 是 https://tonyonier99.github.io/chord-memo-site/privacy/
SITE_URL = "https://tonyonier99.github.io/chord-memo-site/"
SITE_BASE = "/" + SITE_URL.split("://", 1)[1].split("/", 1)[1]  # 網站絕對路徑（404 頁的連結用）＝ /chord-memo-site/

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
        "lead": "一句歌詞、一段哼唱、一張照片、一筆塗鴉，先丟進來，不用想怎麼整理。",  # 站長 11-12 改寫
        "points": [],  # 站長 11-12：說明已講四種靈感，不再重複條列（App 選項名稱見 HomeCaptureChoice.swift）
    },
    {
        "anchor": "record", "eyebrow": "錄音", "demo": "record",
        "title": "立刻錄音",  # AppShortcuts.swift shortTitle
        "lead": "按一下就開始錄。鎖住螢幕、切到別的 App，錄音都不會斷。",  # 站長 11-12 改寫（privacy.md 麥克風列）
        "points": ["錄音只存在你的手機和你自己的 iCloud"],  # 站長 11-12 改寫（麥克風權限說明、privacy.md）
    },
    {
        "anchor": "arrange", "eyebrow": "編曲", "demo": "arrange",
        "title": "一軌一軌疊上去",  # 站長 11-12 改寫（WorkspaceTab「編曲」）
        "lead": "主錄音是編曲的第一軌。錄好之後回到這裡，就能一軌一軌疊上去。",  # ArrangeTabView.swift
        "points": [],  # 站長 11-13：不寫匯入電腦檔（跟「進錄音室前」的初衷打架）
    },
    {
        "anchor": "chart", "eyebrow": "和弦", "demo": "chart",
        "title": "和弦譜，照著就彈得出來",  # 站長 11-12 改寫
        # 站長 11-12 草稿：示範歌是純音樂 → 拿掉「點歌詞列寫詞」；和弦譜元件本身就是展示，不再條列
        "lead": "點小節填和弦，主歌副歌一段一段排好，整份譜一眼看完。",  # 站長 11-12 改寫（ChartTabView.swift 操作）
        "points": [],
    },
]

# 工具與匯出（各配一支示範手機）
TOOL_BANDS = [
    {"anchor": "export", "eyebrow": "分享", "demo": "export",  # OthersView.swift「分享」子選單
     "title": "分享整份譜",  # OthersView.swift（和弦分頁「⋯」）
     "lead": "整份譜存成一張圖片分享。",  # OthersView.swift「分享整份譜（圖片）」
     "points": ["分享整份譜（圖片）"]},  # 站長 11-13：ChordPro 拿掉（沒意義）
    {"anchor": "tuner", "eyebrow": "工具", "demo": "tuner", "title": "調音器",  # OthersView.swift 工具
     "lead": "彈一下就知道準不準。只聽、不錄、不上傳。",  # 站長 11-12 改寫（SettingsDetailViews.swift：不錄音、不上傳）
     "points": ["自動", "手動", "半音"]},  # TunerLogic.swift TunerMode
    {"anchor": "metronome", "eyebrow": "工具", "demo": "metronome", "title": "節拍器",  # OthersView.swift 工具
     "lead": "錄音時跟著歌的速度打拍子，先響 1 小節預備拍",  # RecordClickViews.swift
     "points": ["點拍子抓速度", "錄音前先數一小節"]},  # 站長 11-12 改寫（RhythmView.swift Tap、預備拍）
]

# 其他功能卡（首頁 bento、功能頁「還有這些」）：(標題, 說明, 出處)
EXTRAS = [
    ("回來聽聽你的歌", "挑一首暫放的靈感，回來聽 30 秒就好。", "SettingsView.swift 本機提醒文案"),
    ("最近刪除", "不小心刪掉作品怎麼辦？到首頁右上角的「…」選單 >「最近刪除」可以復原。", "support.md 常見問題"),
    ("iCloud 同步（可選）", "你的作品只同步到你自己的 iCloud 私人空間，由 Apple 保管，開發者無法讀取。", "privacy.md"),
    ("靈感匣", "靈感不限數量，想到就存，之後再挑來寫成歌。", "站長 11-12 改寫（PaywallView.swift）"),
]

# 跑馬燈：App 內的功能名稱（HomeCaptureChoice、WorkspaceTab、OthersView、ChartTabView 分享選單、PaywallView、SettingsView）
MARQUEE = ["錄一段聲音", "寫一句話", "加一張照片", "畫一筆", "靈感匣", "錄音", "編曲", "和弦", "調音器", "節拍器",
           "最近刪除", "分享整份譜（圖片）", "匯出每一軌", "圈出整段重點", "回來聽聽你的歌"]

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
