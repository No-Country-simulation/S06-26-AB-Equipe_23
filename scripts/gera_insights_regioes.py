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


def to_optional_float(value: str | None) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


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
    pct_4g_5g = pct_4g + pct_5g

    if pct_5g >= 20 or (pct_4g_5g >= 75 and pct_4g >= 50):
        return "alta"
    if pct_4g_5g >= 60:
        return "media"
    if pct_3g >= 50 and pct_4g_5g < 50:
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
            key = (municipio, cluster)
            row = grupos[key]

            row["municipio"] = municipio
            row["cluster"] = cluster
            row["qtd_antenas"] = int(row["qtd_antenas"]) + 1
            lat = to_optional_float(item.get("lat"))
            lon = to_optional_float(item.get("lon"))
            if lat is not None and lon is not None:
                row["lat_soma"] = float(row["lat_soma"]) + lat
                row["lon_soma"] = float(row["lon_soma"]) + lon
                row["coords_validas"] = int(row["coords_validas"]) + 1
            row["total_sessoes_3g"] = int(row["total_sessoes_3g"]) + to_int(item["sessoes_3g"])
            row["total_sessoes_4g"] = int(row["total_sessoes_4g"]) + to_int(item["sessoes_4g"])
            row["total_sessoes_5g"] = int(row["total_sessoes_5g"]) + to_int(item["sessoes_5g"])
            row["total_sessoes_outros"] = int(row["total_sessoes_outros"]) + to_int(item["sessoes_outros"])

    output_rows = []
    for row in grupos.values():
        qtd_antenas = int(row["qtd_antenas"])
        coords_validas = int(row["coords_validas"])
        total_3g = int(row["total_sessoes_3g"])
        total_4g = int(row["total_sessoes_4g"])
        total_5g = int(row["total_sessoes_5g"])
        total_outros = int(row["total_sessoes_outros"])
        total = total_3g + total_4g + total_5g + total_outros

        output = {
            "municipio": row["municipio"],
            "cluster": row["cluster"],
            "qtd_antenas": qtd_antenas,
            "lat_media": round(float(row["lat_soma"]) / coords_validas, 6) if coords_validas else 0,
            "lon_media": round(float(row["lon_soma"]) / coords_validas, 6) if coords_validas else 0,
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
