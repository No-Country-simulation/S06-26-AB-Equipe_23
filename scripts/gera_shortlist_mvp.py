from __future__ import annotations

import csv
import json
from pathlib import Path

from scripts.score_match import ScoreConfig, ScoreProfile, compute_scores


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "mocks" / "candidatos_teste.json"
OUTPUT_MATCH = ROOT / "mocks" / "match_payload.json"
OUTPUT_POWERBI = ROOT / "data" / "powerbi" / "shortlist_candidatos_powerbi.csv"

PUBLIC_FIELDS = (
    "candidato_id",
    "apelido_exibicao",
    "status_identificacao",
    "cargo_alvo",
    "nivel",
    "regiao",
    "cluster_residencia",
    "cep",
    "lat",
    "lon",
    "modelo_trabalho_preferido",
    "skills",
    "anos_experiencia",
    "badge_diversidade",
    "score_match",
)


def anonimizar(candidato: dict) -> dict:
    return {campo: candidato.get(campo) for campo in PUBLIC_FIELDS if campo in candidato}


def main() -> None:
    if not INPUT.exists():
        raise FileNotFoundError(f"Input oficial de candidatos não encontrado: {INPUT}")
    source = json.loads(INPUT.read_text(encoding="utf-8"))
    candidates = source.get("candidatos", [])
    if len(candidates) != 8:
        raise ValueError(
            f"Esperados 8 candidatos no input oficial; encontrados {len(candidates)}. "
            "Atualize o contrato antes de gerar a shortlist."
        )

    score_profile = ScoreProfile(
        required_skills=("sql", "python", "power bi"),
        preferred_work_model="hibrido",
        min_experience_years=1,
    )
    candidates = compute_scores(candidates, score_profile, ScoreConfig())
    public_candidates = [anonimizar(candidate) for candidate in candidates]
    match_payload = {
        "fonte_candidatos": "mocks/candidatos_teste.json",
        "total_analisados": len(public_candidates),
        "total_retorno": len(public_candidates),
        "regra_privacidade": (
            "contato_pos_aprovacao não é retornado na shortlist inicial; "
            "a liberação exige endpoint autenticado específico."
        ),
        "candidatos": public_candidates,
    }
    OUTPUT_MATCH.write_text(
        json.dumps(match_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    rows = []
    for candidate in public_candidates:
        row = dict(candidate)
        if isinstance(row.get("skills"), list):
            row["skills"] = ", ".join(row["skills"])
        row["fonte_candidatos"] = "mocks/candidatos_teste.json"
        rows.append(row)

    OUTPUT_POWERBI.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_POWERBI.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    print(f"Mock anonimizado gerado: {OUTPUT_MATCH}")
    print(f"Shortlist Power BI gerada: {OUTPUT_POWERBI}")
    print(f"Candidatos provenientes do input oficial: {len(rows)}")


if __name__ == "__main__":
    main()
