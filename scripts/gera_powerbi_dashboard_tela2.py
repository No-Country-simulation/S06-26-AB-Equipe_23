from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MATCH_INPUT = ROOT / "mocks" / "match_payload.json"
OUTPUT_DASHBOARD = ROOT / "data" / "powerbi" / "dashboard_tela2_mvp.csv"
OUTPUT_CANDIDATOS = ROOT / "data" / "powerbi" / "shortlist_candidatos_powerbi.csv"


def risco_turnover(score_medio: float) -> tuple[float, str]:
    if score_medio >= 85:
        return 18.5, "medio"
    if score_medio >= 75:
        return 24.0, "medio"
    return 31.0, "alto"


def main() -> None:
    if not MATCH_INPUT.exists():
        raise FileNotFoundError(f"Mock de match nao encontrado: {MATCH_INPUT}")

    payload = json.loads(MATCH_INPUT.read_text(encoding="utf-8"))
    candidatos = payload["candidatos"]
    scores = [float(candidato["score_match"]) for candidato in candidatos]
    media_score = round(sum(scores) / len(scores), 2) if scores else 0.0
    turnover_percentual, risco = risco_turnover(media_score)
    metrica = payload["metrica_diversidade"]

    dashboard_row = {
        "vaga_id": payload["vaga_id"],
        "total_vagas_abertas": 4,
        "total_candidatos_analisados": payload["total_analisados"],
        "total_shortlist": payload["total_retorno"],
        "media_score_match": media_score,
        "percentual_shortlist_diversa": metrica["percentual_shortlist_diversa"],
        "meta_diversidade": metrica["meta_diversidade"],
        "meta_atingida": "Sim" if metrica["meta_atingida"] else "Nao",
        "turnover_estimado_percentual": turnover_percentual,
        "risco_turnover": risco,
        "fator_turnover_1": "modelo hibrido",
        "fator_turnover_2": "nivel junior",
        "fator_turnover_3": "mercado competitivo",
    }

    candidato_rows = []
    for candidato in candidatos:
        candidato_rows.append(
            {
                "vaga_id": payload["vaga_id"],
                "candidato_id": candidato["candidato_id"],
                "apelido_exibicao": candidato["apelido_exibicao"],
                "status_identificacao": candidato["status_identificacao"],
                "cargo_alvo": candidato.get("cargo_alvo", ""),
                "nivel": candidato["nivel"],
                "regiao": candidato["regiao"],
                "cluster_residencia": candidato.get("cluster_residencia", ""),
                "score_match": candidato["score_match"],
                "skills": ", ".join(candidato["skills"]),
                "qtd_skills": len(candidato["skills"]),
                "badge_diversidade": candidato["badge_diversidade"],
                "explicacao": candidato["explicacao"],
            }
        )

    OUTPUT_DASHBOARD.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_DASHBOARD.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(dashboard_row.keys()))
        writer.writeheader()
        writer.writerow(dashboard_row)

    with OUTPUT_CANDIDATOS.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(candidato_rows[0].keys()))
        writer.writeheader()
        writer.writerows(candidato_rows)

    print(f"Arquivo gerado: {OUTPUT_DASHBOARD}")
    print(f"Arquivo gerado: {OUTPUT_CANDIDATOS}")
    print(f"Candidatos exportados: {len(candidato_rows)}")


if __name__ == "__main__":
    main()
