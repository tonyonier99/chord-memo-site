"""示範歌的真實錄音：從 App 內建示範歌（.chorddemo 內嵌的 m4a，只讀）取出，build 時寫進 site/assets/audio/。

- 免費版「夜車」：主錄音（錄音分頁的「主旋律」播放用）＋編曲 2 軌（導覽手機的編曲分頁）。
- 付費版「夜車（完整編曲）」：編曲每一軌一個檔，順序照 hums/*.stack.json 的 layers（編曲分頁各軌出聲、靜音用）。
- 檔名改成 ASCII（free/take.m4a、pro/lane-0.m4a…），網址不必處理中文編碼。
"""
import json
from pathlib import Path

from site_app_data import FREE_DEMO, PRO_DEMO, _files, _load

AUDIO_DIR = "assets/audio"


def _stack_layers(files: dict[str, bytes]) -> list[dict]:
    stack = next((v for k, v in files.items() if k.endswith(".stack.json")), None)
    return json.loads(stack.decode("utf-8")).get("layers", []) if stack else []


def _write(out: Path, rel: str, data: bytes) -> Path:
    if not data:
        raise FileNotFoundError(f"示範歌裡找不到音檔：{rel}")
    path = out / AUDIO_DIR / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return path


def export_demo_audio(out: Path) -> list[Path]:
    """取出主錄音與各軌音檔；缺檔讓 build 失敗，不產生點了沒聲音的頁面。"""
    free_doc, pro_doc = _load(FREE_DEMO), _load(PRO_DEMO)
    free_files, pro_files = _files(free_doc), _files(pro_doc)
    take = free_doc["demo"].get("mainTakeId") or ""
    written = [_write(out, "free/take.m4a", free_files.get(f"hums/{take}.m4a", b""))]
    for kind, files in (("free", free_files), ("pro", pro_files)):
        for i, layer in enumerate(_stack_layers(files)):
            written.append(_write(out, f"{kind}/lane-{i}.m4a", files.get(f"hums/{layer.get('fileName', '')}", b"")))
    return written


def audio_urls() -> dict:
    """給示範手機的 data-song 用（相對 assets/audio/）。"""
    free, pro = (len(_stack_layers(_files(_load(rel)))) for rel in (FREE_DEMO, PRO_DEMO))
    return {"take": "free/take.m4a", "free": [f"free/lane-{i}.m4a" for i in range(free)],
            "lanes": [f"pro/lane-{i}.m4a" for i in range(pro)]}
