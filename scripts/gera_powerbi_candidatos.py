from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "powerbi" / "candidatos_powerbi.csv"
MATCH_OUTPUT = ROOT / "mocks" / "match_payload.json"

CARGOS = [
    "Analista de Dados Junior",
    "Analista de BI Junior",
    "Assistente de Dados",
    "Desenvolvedor Frontend Junior",
    "Analista de Suporte Junior",
    "Estagiario em Dados",
    "Analista de Operacoes",
    "Assistente de Projetos",
]

NIVEIS = ["estagio", "junior", "pleno"]
REGIOES = [
    ("Florianopolis", "TRINDADE"),
    ("Florianopolis", "UFSC"),
    ("Florianopolis", "CBD_BEIRAMAR"),
    ("Florianopolis", "CAMPECHE"),
    ("Florianopolis", "INGLESES"),
    ("Sao Jose", "SAO_JOSE_KOBRASOL"),
    ("Sao Jose", "SAO_JOSE_CENTRO"),
    ("Sao Jose", "SAO_JOSE_ROCADO"),
    ("Palhoca", "PALHOCA_CENTRO"),
    ("Palhoca", "PALHOCA_PEDRA_BRANCA"),
    ("Biguacu", "BIGUACU_BR101_NORTE"),
]
COORDENADAS_CLUSTER = {
    "TRINDADE": (-27.596111, -48.525528),
    "UFSC": (-27.593478, -48.552089),
    "CBD_BEIRAMAR": (-27.586028, -48.547444),
    "CAMPECHE": (-27.693087, -48.503058),
    "INGLESES": (-27.44702, -48.395133),
    "SAO_JOSE_KOBRASOL": (-27.594458, -48.619528),
    "SAO_JOSE_CENTRO": (-27.609003, -48.62332),
    "SAO_JOSE_ROCADO": (-27.569376, -48.640131),
    "PALHOCA_CENTRO": (-27.637456, -48.666794),
    "PALHOCA_PEDRA_BRANCA": (-27.632075, -48.690179),
    "BIGUACU_BR101_NORTE": (-27.508108, -48.654131),
}
SKILLS = [
    "sql",
    "python",
    "power bi",
    "excel",
    "react",
    "typescript",
    "java",
    "spring boot",
    "atendimento",
    "suporte",
    "estatistica",
    "etl",
    "dashboards",
    "comunicacao",
]
BADGES = [
    "Mulher em tecnologia",
    "Pessoa negra em tecnologia",
    "Talento de baixa renda",
    "Perfil junior em formacao tecnica",
    "Primeira geracao no ensino superior",
    "Pessoa com deficiencia",
    "Comunidade LGBTQIA+",
    "Talento de regiao com menor acesso",
    "Sem badge declarado",
]


def pick(items: list, index: int, step: int = 1):
    return items[(index * step) % len(items)]


def score_match(index: int) -> int:
    return 58 + ((index * 7) % 40)


def score_diversidade(index: int) -> int:
    return 35 + ((index * 11) % 61)


def skills_for(index: int) -> list[str]:
    total = 3 + (index % 4)
    return [pick(SKILLS, index + offset, step=3) for offset in range(total)]


def status_funil(index: int) -> str:
    if index % 10 == 0:
        return "aprovado_para_contato"
    if index % 4 == 0:
        return "shortlist"
    if index % 3 == 0:
        return "analisado"
    return "base"


def main() -> None:
    rows = []
    for index in range(1, 201):
        municipio, cluster = pick(REGIOES, index, step=5)
        lat, lon = COORDENADAS_CLUSTER[cluster]
        cargo = pick(CARGOS, index, step=3)
        nivel = pick(NIVEIS, index, step=2)
        badge = pick(BADGES, index, step=4)
        score = score_match(index)
        diversidade = score_diversidade(index)
        skills = skills_for(index)

        rows.append(
            {
                "candidato_id": f"cand_{index:03d}",
                "apelido_exibicao": f"Candidato {index}",
                "status_identificacao": "anonimizado",
                "status_funil": status_funil(index),
                "cargo_alvo": cargo,
                "nivel": nivel,
                "municipio": municipio,
                "cluster_residencia": cluster,
                "lat": lat,
                "lon": lon,
                "score_match": score,
                "score_diversidade": diversidade,
                "skills": ", ".join(skills),
                "qtd_skills": len(skills),
                "badge_diversidade": badge,
                "modelo_trabalho_preferido": pick(["remoto", "hibrido", "presencial"], index, step=2),
                "disponibilidade": pick(["imediata", "15 dias", "30 dias"], index, step=4),
                "indicador_conectividade": "alta",
                "contato_liberado": "Sim" if index % 10 == 0 else "Nao",
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    candidatos_match = []
    for row in rows:
        candidatos_match.append(
            {
                "candidato_id": row["candidato_id"],
                "apelido_exibicao": row["apelido_exibicao"],
                "status_identificacao": row["status_identificacao"],
                "status_funil": row["status_funil"],
                "cargo_alvo": row["cargo_alvo"],
                "nivel": row["nivel"],
                "regiao": row["municipio"],
                "cluster_residencia": row["cluster_residencia"],
                "lat": row["lat"],
                "lon": row["lon"],
                "score_match": row["score_match"],
                "score_diversidade": row["score_diversidade"],
                "skills": [skill.strip() for skill in row["skills"].split(",")],
                "qtd_skills": row["qtd_skills"],
                "badge_diversidade": row["badge_diversidade"],
                "modelo_trabalho_preferido": row["modelo_trabalho_preferido"],
                "disponibilidade": row["disponibilidade"],
                "indicador_conectividade": row["indicador_conectividade"],
                "contato_liberado": row["contato_liberado"],
                "explicacao": (
                    "Perfil anonimizado para triagem inicial, com score de match, "
                    "skills e contexto regional prontos para dashboard e validacao."
                ),
            }
        )

    candidatos_diversos = [
        row for row in rows if row["badge_diversidade"] != "Sem badge declarado"
    ]
    percentual_diversidade = round((len(candidatos_diversos) / len(rows)) * 100, 1)
    match_payload = {
        "vaga_id": "job_001",
        "total_analisados": len(rows),
        "total_retorno": len(rows),
        "metrica_diversidade": {
            "percentual_shortlist_diversa": percentual_diversidade,
            "meta_diversidade": 40,
            "meta_atingida": percentual_diversidade >= 40,
        },
        "candidatos": candidatos_match,
    }
    MATCH_OUTPUT.write_text(
        json.dumps(match_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Arquivo gerado: {OUTPUT}")
    print(f"Mock gerado: {MATCH_OUTPUT}")
    print(f"Candidatos exportados: {len(rows)}")


if __name__ == "__main__":
    main()
