from __future__ import annotations

import html
import re
from pathlib import Path
from urllib.parse import urljoin

import requests


FILE_ID = "186vEhiwIgHOdj496Tv3nnEnQb_vumLXq"
URL = "https://drive.google.com/uc?export=download"


def open_drive_stream(session: requests.Session):
    response = session.get(URL, params={"id": FILE_ID}, stream=True, timeout=120)
    for key, value in response.cookies.items():
        if key.startswith("download_warning"):
            response.close()
            return session.get(URL, params={"id": FILE_ID, "confirm": value}, stream=True, timeout=120)

    head = response.raw.read(1024 * 512, decode_content=True)
    text = head.decode("utf-8", errors="replace")
    form_match = re.search(r'<form[^>]+action="([^"]+)"[^>]*>(.*?)</form>', text, re.DOTALL)
    if form_match:
        response.close()
        action = html.unescape(form_match.group(1))
        form_html = form_match.group(2)
        params = {}
        for name, value in re.findall(r'name="([^"]+)"\s+value="([^"]*)"', form_html):
            params[html.unescape(name)] = html.unescape(value)
        return session.get(action, params=params, stream=True, timeout=120)

    raise RuntimeError("Não consegui obter link direto do Google Drive.")


def main() -> None:
    out_dir = Path(__file__).resolve().parents[1] / "tmp_large"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "tensor_mobilidade.csv"

    session = requests.Session()
    response = open_drive_stream(session)
    response.raise_for_status()
    total = int(response.headers.get("Content-Length") or 0)
    downloaded = 0

    with out_file.open("wb") as fh:
        for chunk in response.iter_content(chunk_size=1024 * 1024 * 8):
            if not chunk:
                continue
            fh.write(chunk)
            downloaded += len(chunk)
            if total:
                print(f"baixado_gb={downloaded/1024**3:.2f}/{total/1024**3:.2f}", flush=True)
            else:
                print(f"baixado_gb={downloaded/1024**3:.2f}", flush=True)
    response.close()
    print(out_file)


if __name__ == "__main__":
    main()
