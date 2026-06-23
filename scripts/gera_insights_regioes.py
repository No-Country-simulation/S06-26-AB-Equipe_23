from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "processed" / "antenas_sinal_tratadas.csv"
INPUT_CONCENTRACAO = ROOT / "data" / "processed" / "concentracao_regional.csv"
OUTPUT_CSV = ROOT / "data" / "processed" / "insights_regioes_agregado.csv"
OUTPUT_JSON = ROOT / "mocks" / "insights_conectividade_payload.json"
SOURCE_ANTENNAS = "Vísent CDRView: referencias/antenas_flp.csv"
SOURCE_SESSIONS = "Vísent CDRView: tensores/tensor_mobilidade.csv"
SOURCE_CONCENTRATION = "Vísent CDRView: tensores/tensor_concentracao.csv"


def to_optional_float(value: str | None) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def to_int(value: str | None) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0


def tecnologia_predominante(row: dict[str, int]) -> str:
    sessoes = {
        "3G": row["total_sessoes_3g"],
        "4G": row["total_sessoes_4g"],
        "5G": row["total_sessoes_5g"],
        "OUTROS": row["total_sessoes_outros"],
    }
    return max(sessoes, key=sessoes.get) if sum(sessoes.values()) else "SEM_DADO"


def obter_qualidade_sinal(tecnologia: str, sessoes: int) -> str:
    if tecnologia == "5G":
        return "muito_alta"
    elif tecnologia == "4G":
        if sessoes >= 2000000:
            return "alta"
        else:
            return "media"
    elif tecnologia == "3G":
        return "baixa"
    else:
        return "sem_dado"



def main() -> None:
    if not INPUT.exists():
        raise FileNotFoundError(f"Base de antenas processada não encontrada: {INPUT}")
    if not INPUT_CONCENTRACAO.exists():
        raise FileNotFoundError(f"Base de concentração processada não encontrada: {INPUT_CONCENTRACAO}")

    concentracao: dict[tuple[str, str], dict[str, object]] = {}
    with INPUT_CONCENTRACAO.open("r", encoding="utf-8-sig", newline="") as file:
        for item in csv.DictReader(file):
            chave = (item["municipio"].strip(), item["cluster"].strip())
            atual = concentracao.setdefault(
                chave,
                {
                    "usuarios_observados_total": 0,
                    "sessoes_concentracao_total": 0,
                    "periodo_pico": "SEM_DADO",
                    "usuarios_observados_periodo_pico": 0,
                },
            )
            usuarios = to_int(item.get("usuarios_total"))
            atual["usuarios_observados_total"] = int(atual["usuarios_observados_total"]) + usuarios
            atual["sessoes_concentracao_total"] = int(atual["sessoes_concentracao_total"]) + to_int(item.get("sessoes_total"))
            if usuarios > int(atual["usuarios_observados_periodo_pico"]):
                atual["periodo_pico"] = item["periodo"].strip()
                atual["usuarios_observados_periodo_pico"] = usuarios

    grupos: dict[tuple[str, str], dict[str, float | int | str]] = defaultdict(
        lambda: {
            "municipio": "",
            "cluster": "",
            "qtd_antenas": 0,
            "lat_soma": 0.0,
            "lon_soma": 0.0,
            "coords_validas": 0,
            "total_sessoes_3g": 0,
            "total_sessoes_4g": 0,
            "total_sessoes_5g": 0,
            "total_sessoes_outros": 0,
        }
    )

    with INPUT.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        for item in reader:
            municipio = item["municipio"].strip()
            cluster = item["cluster"].strip()
            row = grupos[(municipio, cluster)]
            row["municipio"] = municipio
            row["cluster"] = cluster
            row["qtd_antenas"] = int(row["qtd_antenas"]) + 1

            lat = to_optional_float(item.get("lat"))
            lon = to_optional_float(item.get("lon"))
            if lat is not None and lon is not None:
                row["lat_soma"] = float(row["lat_soma"]) + lat
                row["lon_soma"] = float(row["lon_soma"]) + lon
                row["coords_validas"] = int(row["coords_validas"]) + 1

            for origem, destino in (
                ("sessoes_3g", "total_sessoes_3g"),
                ("sessoes_4g", "total_sessoes_4g"),
                ("sessoes_5g", "total_sessoes_5g"),
                ("sessoes_outros", "total_sessoes_outros"),
            ):
                row[destino] = int(row[destino]) + to_int(item.get(origem))

    output_rows: list[dict[str, object]] = []
    for row in grupos.values():
        coords_validas = int(row["coords_validas"])
        totais = {
            "total_sessoes_3g": int(row["total_sessoes_3g"]),
            "total_sessoes_4g": int(row["total_sessoes_4g"]),
            "total_sessoes_5g": int(row["total_sessoes_5g"]),
            "total_sessoes_outros": int(row["total_sessoes_outros"]),
        }
        total = sum(totais.values())
        dados_concentracao = concentracao.get(
            (str(row["municipio"]), str(row["cluster"])),
            {
                "usuarios_observados_total": 0,
                "sessoes_concentracao_total": 0,
                "periodo_pico": "SEM_DADO",
                "usuarios_observados_periodo_pico": 0,
            },
        )
        output: dict[str, object] = {
            "municipio": row["municipio"],
            "cluster": row["cluster"],
            "qtd_antenas": int(row["qtd_antenas"]),
            "lat_media": round(float(row["lat_soma"]) / coords_validas, 6) if coords_validas else None,
            "lon_media": round(float(row["lon_soma"]) / coords_validas, 6) if coords_validas else None,
            **totais,
            "total_sessoes": total,
            "percentual_3g": round(totais["total_sessoes_3g"] / total * 100, 4) if total else 0.0,
            "percentual_4g": round(totais["total_sessoes_4g"] / total * 100, 4) if total else 0.0,
            "percentual_5g": round(totais["total_sessoes_5g"] / total * 100, 4) if total else 0.0,
            "percentual_outros": round(totais["total_sessoes_outros"] / total * 100, 4) if total else 0.0,
            "tecnologia_predominante_regiao": "",
            "qualidade_sinal": "",
            "indicador_conectividade": "",
            **dados_concentracao,
            "indice_concentracao_relativa": 0.0,
            "fonte_antenas": SOURCE_ANTENNAS,
            "fonte_sessoes": SOURCE_SESSIONS,
            "fonte_concentracao": SOURCE_CONCENTRATION,
        }
        pred = tecnologia_predominante(totais)
        output["tecnologia_predominante_regiao"] = pred
        qualidade = obter_qualidade_sinal(pred, total)
        output["qualidade_sinal"] = qualidade
        output["indicador_conectividade"] = qualidade
        output_rows.append(output)

    max_usuarios = max(int(item["usuarios_observados_total"]) for item in output_rows)
    for item in output_rows:
        item["indice_concentracao_relativa"] = (
            round(int(item["usuarios_observados_total"]) / max_usuarios * 100, 4)
            if max_usuarios
            else 0.0
        )

    output_rows.sort(key=lambda item: (str(item["municipio"]), str(item["cluster"])))
    if not output_rows:
        raise RuntimeError("Nenhuma região foi derivada da base de antenas.")

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_CSV.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(output_rows[0].keys()))
        writer.writeheader()
        writer.writerows(output_rows)

    payload = {
        "fontes": {
            "antenas": SOURCE_ANTENNAS,
            "sessoes": SOURCE_SESSIONS,
            "concentracao": SOURCE_CONCENTRATION,
        },
        "metodologia": (
            "Agregação por município e cluster. Percentuais representam distribuição observada "
            "de sessões por tecnologia; não representam medição de velocidade ou garantia de cobertura. "
            "O índice de concentração é relativo ao maior volume observado entre as regiões."
        ),
        "total_regioes": len(output_rows),
        "regioes": output_rows,
    }
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"CSV gerado: {OUTPUT_CSV}")
    print(f"JSON gerado: {OUTPUT_JSON}")
    print(f"Regiões derivadas: {len(output_rows)}")


if __name__ == "__main__":
    main()
