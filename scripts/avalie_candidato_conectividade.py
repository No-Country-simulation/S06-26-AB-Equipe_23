#!/usr/bin/env python3
"""Cruza coordenadas informadas com antenas e sessões observadas no Vísent.

O script não cria coordenadas, não geocodifica CEP e não atribui nota subjetiva de
qualidade. Ele retorna somente distância e distribuição de sessões 3G/4G/5G
presentes na base processada do Vísent.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import pathlib
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_ANTENNAS = ROOT / "data" / "processed" / "antenas_sinal_tratadas.csv"
DEFAULT_CANDIDATES = ROOT / "mocks" / "candidatos_teste.json"
SOURCE_ANTENNAS = "Vísent CDRView: referencias/antenas_flp.csv"
SOURCE_SESSIONS = "Vísent CDRView: tensores/tensor_mobilidade.csv"


def to_int(value: str | None) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0


def calcular_distancia_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    raio_terra_km = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    return round(raio_terra_km * 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a)), 3)


def buscar_antenas_proximas(
    lat: float, lon: float, antenas_csv_path: pathlib.Path, top_n: int
) -> list[dict[str, object]]:
    if not antenas_csv_path.exists():
        raise FileNotFoundError(f"Base processada de antenas não encontrada: {antenas_csv_path}")

    antenas: list[dict[str, object]] = []
    with antenas_csv_path.open("r", encoding="utf-8-sig", newline="") as file:
        for row in csv.DictReader(file):
            a_lat = float(row["lat"])
            a_lon = float(row["lon"])
            sessoes = {
                "sessoes_3g": to_int(row.get("sessoes_3g")),
                "sessoes_4g": to_int(row.get("sessoes_4g")),
                "sessoes_5g": to_int(row.get("sessoes_5g")),
                "sessoes_outros": to_int(row.get("sessoes_outros")),
            }
            antenas.append(
                {
                    "ecgi": row["ecgi"],
                    "cluster": row["cluster"],
                    "municipio": row["municipio"],
                    "lat": a_lat,
                    "lon": a_lon,
                    "distancia_km": calcular_distancia_haversine(lat, lon, a_lat, a_lon),
                    **sessoes,
                    "total_sessoes": sum(sessoes.values()),
                    "tecnologia_predominante": row["tecnologia_predominante"],
                }
            )

    antenas.sort(key=lambda item: float(item["distancia_km"]))
    return antenas[:top_n]


def resumir_sessoes(antenas: list[dict[str, object]]) -> dict[str, object]:
    totais = {
        campo: sum(int(item[campo]) for item in antenas)
        for campo in ("sessoes_3g", "sessoes_4g", "sessoes_5g", "sessoes_outros")
    }
    total = sum(totais.values())
    percentuais = {
        campo.replace("sessoes", "percentual"): round(valor / total * 100, 4) if total else 0.0
        for campo, valor in totais.items()
    }
    tecnologias = {
        "3G": totais["sessoes_3g"],
        "4G": totais["sessoes_4g"],
        "5G": totais["sessoes_5g"],
        "OUTROS": totais["sessoes_outros"],
    }
    predominante = max(tecnologias, key=tecnologias.get) if total else "SEM_DADO"
    return {
        **totais,
        "total_sessoes": total,
        **percentuais,
        "tecnologia_predominante": predominante,
    }


def processar_localizacao(
    lat: float,
    lon: float,
    antenas_csv_path: pathlib.Path,
    top_n: int,
    candidato: dict[str, object] | None = None,
) -> dict[str, object]:
    antenas = buscar_antenas_proximas(lat, lon, antenas_csv_path, top_n)
    resultado: dict[str, object] = {
        "coordenadas_entrada": {"lat": lat, "lon": lon},
        "fontes": {
            "coordenadas": "mocks/candidatos_teste.json" if candidato else "argumento --coordenadas",
            "antenas": SOURCE_ANTENNAS,
            "sessoes": SOURCE_SESSIONS,
        },
        "resumo_sessoes_antenas_proximas": resumir_sessoes(antenas),
        "antenas_proximas": antenas,
        "limitacao": (
            "Sessões por tecnologia descrevem uso observado no dataset. "
            "Não equivalem a teste de velocidade nem garantem cobertura no endereço."
        ),
    }
    if candidato:
        resultado.update(
            {
                "candidato_id": candidato["candidato_id"],
                "apelido_exibicao": candidato.get("apelido_exibicao"),
                "regiao": candidato.get("regiao"),
                "cluster_residencia": candidato.get("cluster_residencia"),
            }
        )
    return resultado


def carregar_candidato(candidato_id: str, candidatos_json_path: pathlib.Path) -> dict[str, object]:
    if not candidatos_json_path.exists():
        raise FileNotFoundError(f"Arquivo de candidatos não encontrado: {candidatos_json_path}")
    payload = json.loads(candidatos_json_path.read_text(encoding="utf-8"))
    candidato = next(
        (item for item in payload.get("candidatos", []) if item.get("candidato_id") == candidato_id),
        None,
    )
    if candidato is None:
        raise ValueError(f"Candidato não encontrado: {candidato_id}")
    if candidato.get("lat") is None or candidato.get("lon") is None:
        raise ValueError(
            f"Candidato {candidato_id} não possui lat/lon na fonte. "
            "O script não inventa nem geocodifica coordenadas ausentes."
        )
    return candidato


def main() -> None:
    parser = argparse.ArgumentParser(description="Cruza localização com dados observados no Vísent.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--candidato", help="ID presente em mocks/candidatos_teste.json")
    group.add_argument("--coordenadas", nargs=2, type=float, metavar=("LAT", "LON"))
    parser.add_argument("--top-n", type=int, default=3)
    parser.add_argument("--antenas-csv", type=pathlib.Path, default=DEFAULT_ANTENNAS)
    parser.add_argument("--candidatos-json", type=pathlib.Path, default=DEFAULT_CANDIDATES)
    args = parser.parse_args()

    try:
        if args.candidato:
            candidato = carregar_candidato(args.candidato, args.candidatos_json)
            resultado = processar_localizacao(
                float(candidato["lat"]),
                float(candidato["lon"]),
                args.antenas_csv,
                args.top_n,
                candidato,
            )
        else:
            resultado = processar_localizacao(
                args.coordenadas[0], args.coordenadas[1], args.antenas_csv, args.top_n
            )
        print(json.dumps(resultado, indent=2, ensure_ascii=False))
    except Exception as exc:
        print(json.dumps({"status": "erro", "mensagem": str(exc)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
