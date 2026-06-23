from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "processed" / "insights_regioes_agregado.csv"
OUTPUT = ROOT / "data" / "powerbi" / "insights_regioes_powerbi.csv"


def to_float(value: str | None) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def to_int(value: str | None) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return 0


def main() -> None:
    if not INPUT.exists():
        raise FileNotFoundError(f"Base agregada não encontrada: {INPUT}")

    with INPUT.open("r", encoding="utf-8-sig", newline="") as file:
        rows = list(csv.DictReader(file))
    if not rows:
        raise RuntimeError("A base agregada está vazia.")

    output_rows: list[dict[str, object]] = []
    for row in rows:
        pct_4g = to_float(row.get("percentual_4g"))
        pct_5g = to_float(row.get("percentual_5g"))
        output_rows.append(
            {
                "municipio": row["municipio"],
                "cluster": row["cluster"],
                "label_regiao": f"{row['municipio']} - {row['cluster']}",
                "lat_media": row["lat_media"],
                "lon_media": row["lon_media"],
                "qtd_antenas": to_int(row.get("qtd_antenas")),
                "total_sessoes_3g": to_int(row.get("total_sessoes_3g")),
                "total_sessoes_4g": to_int(row.get("total_sessoes_4g")),
                "total_sessoes_5g": to_int(row.get("total_sessoes_5g")),
                "total_sessoes_outros": to_int(row.get("total_sessoes_outros")),
                "total_sessoes": to_int(row.get("total_sessoes")),
                "percentual_3g": to_float(row.get("percentual_3g")),
                "percentual_4g": pct_4g,
                "percentual_5g": pct_5g,
                "percentual_outros": to_float(row.get("percentual_outros")),
                "percentual_4g_5g": round(pct_4g + pct_5g, 4),
                "tecnologia_predominante_regiao": row["tecnologia_predominante_regiao"],
                "usuarios_observados_total": to_int(row.get("usuarios_observados_total")),
                "sessoes_concentracao_total": to_int(row.get("sessoes_concentracao_total")),
                "periodo_pico": row.get("periodo_pico", "SEM_DADO"),
                "usuarios_observados_periodo_pico": to_int(row.get("usuarios_observados_periodo_pico")),
                "indice_concentracao_relativa": to_float(row.get("indice_concentracao_relativa")),
                "fonte_antenas": row["fonte_antenas"],
                "fonte_sessoes": row["fonte_sessoes"],
                "fonte_concentracao": row["fonte_concentracao"],
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(output_rows[0].keys()))
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"Arquivo gerado: {OUTPUT}")
    print(f"Regiões exportadas: {len(output_rows)}")


if __name__ == "__main__":
    main()
