from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "powerbi" / "candidatos_powerbi.csv"

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

    print(f"Arquivo gerado: {OUTPUT}")
    print(f"Candidatos exportados: {len(rows)}")


if __name__ == "__main__":
    main()
