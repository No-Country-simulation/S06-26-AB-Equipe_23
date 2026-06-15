from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "processed" / "antenas_sinal_tratadas.csv"
OUTPUT_CSV = ROOT / "data" / "processed" / "insights_regioes_agregado.csv"


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


def tecnologia_predominante(row: dict[str, int]) -> str:
    scores = {
        "3G": row["total_sessoes_3g"],
        "4G": row["total_sessoes_4g"],
        "5G": row["total_sessoes_5g"],
        "OUTROS": row["total_sessoes_outros"],
    }
    if sum(scores.values()) == 0:
        return "SEM_DADO"
    return max(scores, key=scores.get)


def indicador_conectividade(row: dict[str, float | int | str]) -> str:
    total = int(row["total_sessoes"])
    if total == 0:
        return "sem_dado"

    pct_3g = float(row["percentual_3g"])
    pct_4g = float(row["percentual_4g"])
    pct_5g = float(row["percentual_5g"])

    if pct_5g >= 20 or (pct_4g >= 65 and pct_5g >= 10):
        return "alta"
    if pct_4g >= 60:
        return "media"
    if pct_3g >= 50:
        return "alerta_exclusao_digital"
    return "baixa"


def main() -> None:
    grupos: dict[tuple[str, str], dict[str, float | int | str]] = defaultdict(
        lambda: {
            "municipio": "",
            "cluster": "",
            "qtd_antenas": 0,
            "lat_soma": 0.0,
            "lon_soma": 0.0,
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
            key = (municipio, cluster)
            row = grupos[key]

            row["municipio"] = municipio
            row["cluster"] = cluster
            row["qtd_antenas"] = int(row["qtd_antenas"]) + 1
            row["lat_soma"] = float(row["lat_soma"]) + to_float(item["lat"])
            row["lon_soma"] = float(row["lon_soma"]) + to_float(item["lon"])
            row["total_sessoes_3g"] = int(row["total_sessoes_3g"]) + to_int(item["sessoes_3g"])
            row["total_sessoes_4g"] = int(row["total_sessoes_4g"]) + to_int(item["sessoes_4g"])
            row["total_sessoes_5g"] = int(row["total_sessoes_5g"]) + to_int(item["sessoes_5g"])
            row["total_sessoes_outros"] = int(row["total_sessoes_outros"]) + to_int(item["sessoes_outros"])

    output_rows = []
    for row in grupos.values():
        qtd_antenas = int(row["qtd_antenas"])
        total_3g = int(row["total_sessoes_3g"])
        total_4g = int(row["total_sessoes_4g"])
        total_5g = int(row["total_sessoes_5g"])
        total_outros = int(row["total_sessoes_outros"])
        total = total_3g + total_4g + total_5g + total_outros

        output = {
            "municipio": row["municipio"],
            "cluster": row["cluster"],
            "qtd_antenas": qtd_antenas,
            "lat_media": round(float(row["lat_soma"]) / qtd_antenas, 6) if qtd_antenas else 0,
            "lon_media": round(float(row["lon_soma"]) / qtd_antenas, 6) if qtd_antenas else 0,
            "total_sessoes_3g": total_3g,
            "total_sessoes_4g": total_4g,
            "total_sessoes_5g": total_5g,
            "total_sessoes_outros": total_outros,
            "total_sessoes": total,
            "percentual_3g": round((total_3g / total) * 100, 2) if total else 0,
            "percentual_4g": round((total_4g / total) * 100, 2) if total else 0,
            "percentual_5g": round((total_5g / total) * 100, 2) if total else 0,
            "tecnologia_predominante_regiao": "",
            "indicador_conectividade": "",
        }
        output["tecnologia_predominante_regiao"] = tecnologia_predominante(output)
        output["indicador_conectividade"] = indicador_conectividade(output)
        output_rows.append(output)

    output_rows.sort(key=lambda x: (str(x["municipio"]), str(x["cluster"])))

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_CSV.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(output_rows[0].keys()))
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"Arquivo gerado: {OUTPUT_CSV}")
    print(f"Regioes agregadas: {len(output_rows)}")


if __name__ == "__main__":
    main()
