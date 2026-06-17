#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script auxiliar para cruzamento de candidatos com regioes (tarefas 6 e 8)."""

import json
import os
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
MATCH_PAYLOAD = ROOT / "mocks" / "match_payload.json"
OUTPUT = ROOT / "data" / "processed" / "cruzamento_candidatos_regioes.json"

with MATCH_PAYLOAD.open("r", encoding="utf-8") as file:
    payload = json.load(file)

CANDIDATOS = [candidato["candidato_id"] for candidato in payload["candidatos"]]

resultados = []
for cid in CANDIDATOS:
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    r = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "avalie_candidato_conectividade.py"),
         "--candidato", cid,
         "--candidatos-json", str(MATCH_PAYLOAD)],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
        cwd=str(ROOT), env=env,
    )
    if r.returncode == 0:
        resultados.append(json.loads(r.stdout))
    else:
        print(f"ERRO em {cid}: {r.stderr[:80]}", file=sys.stderr)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with OUTPUT.open("w", encoding="utf-8") as f:
    json.dump(resultados, f, indent=2, ensure_ascii=False)

print(f"Cruzamento concluido. {len(resultados)} candidatos processados.")
print(f"Arquivo salvo em: {OUTPUT}")
print()

header = "{:<12} {:<14} {:<16} {:<24} {:>5} {:<8} {:<26} {}".format(
    "ID", "Apelido", "Regiao", "Cluster", "Score", "Qual.", "Alerta", "Antena mais proxima"
)
print(header)
print("-" * 120)
for d in resultados:
    ant = d["antenas_proximas"][0] if d["antenas_proximas"] else {}
    antena_info = "{} - {} ({} km)".format(
        ant.get("municipio", "?"),
        ant.get("tecnologia_predominante", "?"),
        ant.get("distancia_km", "?"),
    )
    row = "{:<12} {:<14} {:<16} {:<24} {:>5} {:<8} {:<26} {}".format(
        d["candidato_id"],
        d["apelido_exibicao"],
        d.get("regiao", "?"),
        d.get("cluster_residencia", "?"),
        d["nota_conectividade"],
        d["qualidade_rede"],
        str(d["alerta"]),
        antena_info,
    )
    print(row)
