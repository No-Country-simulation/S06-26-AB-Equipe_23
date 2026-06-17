from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "processed" / "insights_regioes_agregado.csv"
OUTPUT = ROOT / "data" / "powerbi" / "insights_regioes_powerbi.csv"


INDICADOR_META = {
    "alta": {
        "label": "Alta",
        "ordem": 1,
        "cor_hex": "#16A34A",
        "recomendacao": "Regiao com conectividade adequada para apoiar trabalho remoto ou hibrido.",
    },
    "media": {
        "label": "Media",
        "ordem": 2,
        "cor_hex": "#F59E0B",
        "recomendacao": "Regiao funcional, mas pode exigir acompanhamento de infraestrutura.",
    },
    "baixa": {
        "label": "Regular/Baixa",
        "ordem": 3,
        "cor_hex": "#EF4444",
        "recomendacao": "Regiao com conectividade limitada. Avaliar necessidade de apoio operacional.",
    },
    "alerta_exclusao_digital": {
        "label": "Alerta",
        "ordem": 4,
        "cor_hex": "#7F1D1D",
        "recomendacao": "Regiao com risco de barreira digital. Nao eliminar candidato, mas prever apoio.",
    },
    "sem_dado": {
        "label": "Sem dado",
        "ordem": 5,
        "cor_hex": "#6B7280",
        "recomendacao": "Sem dados suficientes para avaliar conectividade regional.",
    },
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


def faixa_antenas(qtd: int) -> str:
    if qtd >= 10:
        return "10+ antenas"
    if qtd >= 5:
        return "5 a 9 antenas"
    if qtd >= 2:
        return "2 a 4 antenas"
    return "1 antena"


def faixa_sessoes(total: int) -> str:
    if total >= 5_000_000:
        return "5M+ sessoes"
    if total >= 2_000_000:
        return "2M a 5M sessoes"
    if total >= 1_000_000:
        return "1M a 2M sessoes"
    return "Ate 1M sessoes"


def categoria_4g_5g(pct: float) -> str:
    if pct >= 80:
        return "Muito alta"
    if pct >= 70:
        return "Alta"
    if pct >= 60:
        return "Media"
    return "Baixa"


def main() -> None:
    if not INPUT.exists():
        raise FileNotFoundError(f"Base agregada nao encontrada: {INPUT}")

    with INPUT.open("r", encoding="utf-8-sig", newline="") as file:
        rows = list(csv.DictReader(file))

    output_rows = []
    for row in rows:
        indicador = row["indicador_conectividade"]
        meta = INDICADOR_META.get(indicador, INDICADOR_META["sem_dado"])
        qtd_antenas = to_int(row["qtd_antenas"])
        total_sessoes = to_int(row["total_sessoes"])
        pct_3g = to_float(row["percentual_3g"])
        pct_4g = to_float(row["percentual_4g"])
        pct_5g = to_float(row["percentual_5g"])
        pct_4g_5g = round(pct_4g + pct_5g, 2)

        label_regiao = f"{row['municipio']} - {row['cluster']}"
        tooltip = (
            f"{label_regiao}: {meta['label']} | "
            f"3G {pct_3g:.2f}% | 4G {pct_4g:.2f}% | 5G {pct_5g:.2f}%"
        )

        output_rows.append(
            {
                "municipio": row["municipio"],
                "cluster": row["cluster"],
                "label_regiao": label_regiao,
                "lat_media": row["lat_media"],
                "lon_media": row["lon_media"],
                "qtd_antenas": qtd_antenas,
                "total_sessoes_3g": to_int(row["total_sessoes_3g"]),
                "total_sessoes_4g": to_int(row["total_sessoes_4g"]),
                "total_sessoes_5g": to_int(row["total_sessoes_5g"]),
                "total_sessoes_outros": to_int(row["total_sessoes_outros"]),
                "total_sessoes": total_sessoes,
                "percentual_3g": pct_3g,
                "percentual_4g": pct_4g,
                "percentual_5g": pct_5g,
                "percentual_4g_5g": pct_4g_5g,
                "categoria_4g_5g": categoria_4g_5g(pct_4g_5g),
                "tecnologia_predominante_regiao": row["tecnologia_predominante_regiao"],
                "indicador_conectividade": indicador,
                "indicador_label": meta["label"],
                "indicador_ordem": meta["ordem"],
                "indicador_cor_hex": meta["cor_hex"],
                "faixa_antenas": faixa_antenas(qtd_antenas),
                "faixa_sessoes": faixa_sessoes(total_sessoes),
                "possui_alerta": "Sim" if indicador in {"baixa", "alerta_exclusao_digital"} else "Nao",
                "recomendacao_rh": meta["recomendacao"],
                "tooltip_resumo": tooltip,
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(output_rows[0].keys()))
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"Arquivo gerado: {OUTPUT}")
    print(f"Regioes exportadas: {len(output_rows)}")


if __name__ == "__main__":
    main()
