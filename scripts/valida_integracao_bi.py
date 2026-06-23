#!/usr/bin/env python3
"""Valida contratos e linhagem das entregas de BI antes da integração."""

from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def csv_rows(relative: str) -> list[dict[str, str]]:
    with (ROOT / relative).open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def json_data(relative: str) -> object:
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def main() -> None:
    candidatos = json_data("mocks/candidatos_teste.json")["candidatos"]
    match = json_data("mocks/match_payload.json")
    shortlist = csv_rows("data/powerbi/shortlist_candidatos_powerbi.csv")
    cruzamentos = json_data("data/processed/cruzamento_candidatos_regioes.json")
    assert len(candidatos) == len(match["candidatos"]) == len(shortlist) == len(cruzamentos) == 8
    assert not any("contato_pos_aprovacao" in item for item in match["candidatos"])

    antenas = csv_rows("data/processed/antenas_sinal_tratadas.csv")
    regioes = csv_rows("data/processed/insights_regioes_agregado.csv")
    payload = json_data("mocks/insights_conectividade_payload.json")
    assert len({item["ecgi"] for item in antenas}) == 132
    assert len(regioes) == payload["total_regioes"] == len(payload["regioes"]) == 24
    assert sum(int(item["qtd_antenas"]) for item in regioes) == 132
    assert all(int(item["usuarios_observados_total"]) > 0 for item in regioes)
    assert all(item["periodo_pico"] != "SEM_DADO" for item in regioes)
    assert max(float(item["indice_concentracao_relativa"]) for item in regioes) == 100.0
    for tecnologia in ("3g", "4g", "5g", "outros"):
        assert sum(int(item[f"sessoes_{tecnologia}"]) for item in antenas) == sum(
            int(item[f"total_sessoes_{tecnologia}"]) for item in regioes
        )

    metricas = csv_rows("data/powerbi/metricas_empresa_demo.csv")
    assert len(metricas) == 1152
    assert all(item["dado_demonstrativo"] == "SIM" for item in metricas)
    assert len({(item["genero_demo"], item["raca_cor_demo"], item["pcd_demo"]) for item in metricas}) == 8
    assert all(
        int(item["headcount_fim"])
        == int(item["headcount_inicio"]) + int(item["admissoes"]) - int(item["desligamentos"])
        for item in metricas
    )

    for obsoleto in (
        "data/powerbi/candidatos_powerbi.csv",
        "data/powerbi/dashboard_tela2_mvp.csv",
        "scripts/gera_powerbi_candidatos.py",
    ):
        assert not (ROOT / obsoleto).exists(), f"Artefato obsoleto encontrado: {obsoleto}"

    print("OK: candidatos=8, privacidade preservada")
    print("OK: antenas=132, regioes=24, sessoes e concentracao reconciliadas")
    print("OK: metricas empresariais demonstrativas=1152, segmentos=8")
    print("OK: artefatos artificiais de candidatos ausentes")


if __name__ == "__main__":
    main()
