"""範本庫的資料：照 App 範本支線（和弦大師-範本支線，feat/artist-templates，只讀）Production 那 11 筆。

出處：
- 站長的範本：native/ChordMaster/ArtistTemplates/ArtistTemplateDemoVideoSource.swift 16–28 行
  （歌名、藝人、署名、「這首用到」、發行說明、三個平台連結、試聽 30 秒）。
- 10 組虛構範本：同檔 fakeEntries；署名、標籤照 ArtistTemplateFakeSource.swift 123–124 行；試聽 90 秒。
  docs/52（範本支線）：Production 版藝人名後面加「（示意）」，署名不改。
- 封面：站長的範本用 Apple Music 上那張（Desktop/…/單曲 there's nothing/未命名設計拷貝2.png 縮成 1000px）；
  虛構範本的封面 fake-NN.jpg 沒進 repo → 照 App 沒封面時的樣子放 music.note 佔位。
- 試聽：App 那份 preview.m4a 找不到（scratchpad 已清）→ 取 there's nothing.mp3 第 30–60 秒（站長 2026-11-11 指定從 30 秒開始），頭 0.5 秒淡入、尾 2 秒淡出。
  虛構範本在 App 裡是靜音檔 → 網頁試聽鈕不能按。
"""

FAKE_FEATURES = ["疊錄 4 軌", "效果器", "錄音重點", "和弦譜"]
FAKE_ENTRIES = [("北窗", "晚班公車"), ("阿柑", "山的另一邊"), ("林間小樹", "海岸線"), ("霓虹風箏", "粉紅雜訊"),
                ("銅色午後", "慢慢來"), ("小藍", "夜裡的草"), ("雨傘工廠", "灰色的光"), ("陳小島", "石頭與海"),
                ("退潮", "紅岩"), ("紫色迴紋針", "繞圈圈")]

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


def _fake(i: int, artist: str, title: str) -> dict:
    return {"id": f"fake-{i + 1:02d}", "title": title, "artist": f"{artist}（示意）",
            "credits": f"詞曲、演唱：{artist}｜編曲：{artist}", "features": FAKE_FEATURES, "seconds": 90,
            "cover": "", "preview": "", "release_note": "", "links": []}


# sortOrder 0＝站長的範本（精選），其餘照 fakeEntries 順序
TEMPLATES = [MINE] + [_fake(i, a, t) for i, (a, t) in enumerate(FAKE_ENTRIES)]
