#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de BI / Dados - Gera o Mock de Insights de Conectividade
Lê as bases reais (antenas_sinal_tratadas.csv e insights_regioes_agregado.csv)
e atualiza mocks/insights_conectividade_payload.json com todos os clusters e coordenadas.
"""

from __future__ import annotations

import csv
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ANTENAS_CSV = ROOT / "data" / "processed" / "antenas_sinal_tratadas.csv"
AGREGADO_CSV = ROOT / "data" / "processed" / "insights_regioes_agregado.csv"
OUTPUT_JSON = ROOT / "mocks" / "insights_conectividade_payload.json"

INDICADOR_RECOMENDACAO = {
    "alta": "Regiao com conectividade adequada para apoiar trabalho remoto ou hibrido.",
    "media": "Regiao funcional, mas pode exigir acompanhamento de infraestrutura.",
    "baixa": "Regiao com conectividade limitada. Avaliar necessidade de apoio operacional.",
    "alerta_exclusao_digital": "Regiao com risco de barreira digital. Nao eliminar candidato, mas prever apoio.",
    "sem_dado": "Sem dados suficientes para avaliar conectividade regional.",
}


def to_float(value: str) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def to_int(value: str) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0


def main() -> None:
    if not ANTENAS_CSV.exists():
        raise FileNotFoundError(f"Base de antenas nao encontrada: {ANTENAS_CSV}")
    if not AGREGADO_CSV.exists():
        raise FileNotFoundError(f"Base agregada nao encontrada: {AGREGADO_CSV}")

    # 1. Carrega o primeiro ECGI para cada par (municipio, cluster)
    ecgi_map: dict[tuple[str, str], str] = {}
    with ANTENAS_CSV.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            muni = row["municipio"].strip()
            clust = row["cluster"].strip()
            key = (muni, clust)
            if key not in ecgi_map:
                ecgi_map[key] = row["ecgi"].strip()

    # 2. Carrega a base agregada e constroi os pontos_mapa
    pontos_mapa = []
    municipios_set = set()
    total_antenas_calc = 0

    with AGREGADO_CSV.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            muni = row["municipio"].strip()
            clust = row["cluster"].strip()
            key = (muni, clust)
            ecgi = ecgi_map.get(key, "")

            municipios_set.add(muni)
            total_antenas_calc += to_int(row["qtd_antenas"])

            indicador = row["indicador_conectividade"].strip()
            recomendacao = INDICADOR_RECOMENDACAO.get(indicador, INDICADOR_RECOMENDACAO["sem_dado"])

            pontos_mapa.append({
                "ecgi": ecgi,
                "cluster": clust,
                "municipio": muni,
                "lat": to_float(row["lat_media"]),
                "lon": to_float(row["lon_media"]),
                "sessoes_3g": to_int(row["total_sessoes_3g"]),
                "sessoes_4g": to_int(row["total_sessoes_4g"]),
                "sessoes_5g": to_int(row["total_sessoes_5g"]),
                "sessoes_outros": to_int(row["total_sessoes_outros"]),
                "total_sessoes": to_int(row["total_sessoes"]),
                "tecnologia_predominante": row["tecnologia_predominante_regiao"].strip(),
                "indicador_conectividade": indicador,
                "recomendacao_rh": recomendacao
            })

    # 3. Cria a estrutura do payload mock
    payload = {
        "fonte": "Visent CDRView / Anatel",
        "endpoint_sugerido": "GET /insights/regioes",
        "conectividade": {
            "resumo": {
                "total_antenas": total_antenas_calc,
                "tecnologia_predominante_geral": "4G",
                "municipios_mapeados": sorted(list(municipios_set)),
                "uso_no_produto": "Apoiar a leitura de barreiras digitais no processo seletivo remoto ou hibrido."
            },
            "legenda_mapa": {
                "3G": {
                    "cor": "azul",
                    "descricao": "Conectividade basica ou legada"
                },
                "4G": {
                    "cor": "verde",
                    "descricao": "Conectividade movel predominante"
                },
                "5G": {
                    "cor": "roxo",
                    "descricao": "Conectividade avancada"
                }
            },
            "pontos_mapa": pontos_mapa
        }
    }

    # 4. Grava o payload JSON
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_JSON.open("w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)

    print(f"Mock atualizado com sucesso em: {OUTPUT_JSON}")
    print(f"Total de pontos de mapa gerados: {len(pontos_mapa)}")
    print(f"Municipios mapeados: {sorted(list(municipios_set))}")
    print(f"Total de antenas agregadas: {total_antenas_calc}")


if __name__ == "__main__":
    main()
