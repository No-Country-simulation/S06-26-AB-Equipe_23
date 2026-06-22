#!/usr/bin/env python3
"""Cruza os oito candidatos do input oficial do projeto com dados Vísent."""

from __future__ import annotations

import json
import os
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
CANDIDATES_INPUT = ROOT / "mocks" / "candidatos_teste.json"
OUTPUT = ROOT / "data" / "processed" / "cruzamento_candidatos_regioes.json"


def main() -> None:
    payload = json.loads(CANDIDATES_INPUT.read_text(encoding="utf-8"))
    candidate_ids = [item["candidato_id"] for item in payload.get("candidatos", [])]
    if not candidate_ids:
        raise RuntimeError(f"Nenhum candidato encontrado em {CANDIDATES_INPUT}")

    resultados = []
    for candidate_id in candidate_ids:
        process = subprocess.run(
            [
                sys.executable,
                str(ROOT / "scripts" / "avalie_candidato_conectividade.py"),
                "--candidato",
                candidate_id,
                "--candidatos-json",
                str(CANDIDATES_INPUT),
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="strict",
            env={**os.environ, "PYTHONUTF8": "1"},
            cwd=str(ROOT),
            check=False,
        )
        if process.returncode != 0:
            raise RuntimeError(f"Falha ao processar {candidate_id}: {process.stderr.strip()}")
        resultados.append(json.loads(process.stdout))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(resultados, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Cruzamento concluído: {len(resultados)} candidatos")
    print(f"Arquivo salvo: {OUTPUT}")


if __name__ == "__main__":
    main()
