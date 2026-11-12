# there's nothing… 分軌（2026-11-12）

- 來源：站長資料夾 `Desktop/Workspace/資料存放/Music/單曲 there's nothing/there's nothing_01.wav`（完整混音）。
- 拆法：Demucs 4.1.0，模型 htdemucs_6s（站長同意安裝，裝在 session 暫存的獨立環境）。
- 人聲、鋼琴兩軌近乎靜音（約 -77 dB）→ 不留；這首是純音樂。
- 這是 AI 拆出來的，會有一點殘音；放上網站前要站長聽過。
- 還沒接進網站（build_site.py 不會複製這個資料夾）。

## clip/（網站用）
首頁編曲那段的四軌試聽。站長 2026-11-12 先要鼓組明顯的段落（取過 1:22.5 起），同日改成從 1:10 起播 30 秒
（量過四軌都有聲音；貝斯在最後 5 秒變小）。原本的 0:30 那段鼓中途停、貝斯幾乎無聲，不用。
頭 0.5 秒淡入、尾 2 秒淡出，build 時複製到 site/assets/audio/tn/：
`ffmpeg -ss 70 -t 30 -i <軌>.m4a -af "afade=t=in:d=0.5,afade=t=out:st=28:d=2" -c:a aac -b:a 128k clip/<軌>.m4a`
