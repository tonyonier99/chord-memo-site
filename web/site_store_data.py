"""範本庫的資料：照 App 範本支線（和弦大師-範本支線，feat/artist-templates，只讀）的真實範本。

出處：
- 站長的範本：native/ChordMaster/ArtistTemplates/ArtistTemplateDemoVideoSource.swift 16–28 行
  （歌名、藝人、署名、「這首用到」、發行說明、三個平台連結、試聽 30 秒）。
- 站長 2026-11-12：App 裡那 10 組虛構範本不上網站；範本庫空位寫「徵集中」（OPEN_SLOTS 格，點了去創作者頁）。
- 封面：站長的範本用 Apple Music 上那張（Desktop/…/單曲 there's nothing/未命名設計拷貝2.png 縮成 1000px）。
- 試聽：App 那份 preview.m4a 找不到（scratchpad 已清）→ 取 there's nothing.mp3 第 30–60 秒（站長 2026-11-11 指定從 30 秒開始），頭 0.5 秒淡入、尾 2 秒淡出。
"""

MINE = {
    "id": "theres-nothing",
    "title": "there's nothing...",
    "artist": "呀沙係",
    "credits": "詞曲、編曲、演出：呀沙係",
    "features": ["錄音"],
    "seconds": 30,
    "cover": "assets/templates/theres-nothing.jpg",
    "preview": "assets/templates/theres-nothing-preview.m4a",
    "release_note": "2025 年 8 月 11 日發行",
    # App 顯示順序固定：Apple Music、Spotify、YouTube、KKBOX、StreetVoice（ArtistTemplateReleaseSection.swift）
    "links": [("Apple Music", "https://music.apple.com/tw/album/theres-nothing-single/1833314170"),
              ("Spotify", "https://open.spotify.com/album/1G1rSUbjzsaSyCDulooRDl"),
              ("YouTube", "https://www.youtube.com/watch?v=9ih7RZkDj_o")],
}


# 以後新增真的範本就加在 MINE 後面；有封面的輪流當精選，其他放「更多範本」（site_store.py）
TEMPLATES = [MINE]
OPEN_SLOTS = 6  # 「更多範本」那排的「徵集中」空位數
