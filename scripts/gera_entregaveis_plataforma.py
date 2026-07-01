from __future__ import annotations

import csv
import json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "exports" / "plataforma_no_country"
DOCS_DESTINO = ROOT / "docs" / "entregaveis-plataforma-no-country.md"
TOTAL_CANDIDATOS_OFICIAL = 8


def contar_csv(path: Path) -> int:
    if not path.exists():
        return 0
    with path.open("r", encoding="utf-8-sig", newline="") as arquivo:
        return sum(1 for _ in csv.DictReader(arquivo))


def contar_lista_json(path: Path, *chaves: str) -> int:
    if not path.exists():
        return 0
    dados = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(dados, list):
        return len(dados)
    for chave in chaves:
        if isinstance(dados.get(chave), list):
            return len(dados[chave])
    return 0


def coletar_status() -> dict:
    return {
        "data_geracao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "candidatos_fonte": contar_lista_json(ROOT / "mocks" / "candidatos_teste.json", "candidatos"),
        "candidatos_match": contar_lista_json(ROOT / "mocks" / "match_payload.json", "candidatos"),
        "shortlist_powerbi": contar_csv(ROOT / "data" / "powerbi" / "shortlist_candidatos_powerbi.csv"),
        "regioes_agregadas": contar_csv(ROOT / "data" / "processed" / "insights_regioes_agregado.csv"),
        "regioes_powerbi": contar_csv(ROOT / "data" / "powerbi" / "insights_regioes_powerbi.csv"),
        "cruzamentos": contar_lista_json(
            ROOT / "data" / "processed" / "cruzamento_candidatos_regioes.json",
            "candidatos", "resultados", "cruzamentos",
        ),
    }


def gerar_documentacao(status: dict) -> str:
    return f"""# App BiT - documentação do projeto

## Fontes e escopo

- Candidatos: `mocks/candidatos_teste.json`, arquivo de entrada oficial do projeto com {TOTAL_CANDIDATOS_OFICIAL} registros fictícios de teste.
- Infraestrutura: `antenas_flp.csv`, cadastro de 132 ERBs reais da Anatel distribuído no dataset Vísent.
- Sessões: `tensor_mobilidade.csv`, dataset Vísent de telecomunicações usado para agregar sessões 3G, 4G e 5G por antena e região.
- Concentração: `tensor_concentracao.csv`, dataset Vísent usado para volume regional observado e período de pico.

Os assinantes do Vísent são usuários de telecomunicações e não podem ser transformados em candidatos. Nenhum candidato adicional, coordenada ausente ou classificação de qualidade é inventado. Turnover e ESG usam massa empresarial fictícia, separada e identificada como demonstrativa, apenas para estruturar o dashboard.

## Rotas do MVP

- `POST /match`: lê a fonte oficial de candidatos e retorna a shortlist anonimizada.
- `GET /insights/regioes`: retorna agregações regionais derivadas das antenas e sessões Vísent.

O retorno inicial não expõe `contato_pos_aprovacao`. Os contatos somente podem ser liberados por uma ação explícita posterior.

## Indicadores disponíveis

- quantidade de regiões derivadas e antenas;
- latitude e longitude médias;
- sessões observadas por tecnologia;
- percentuais de sessões 3G, 4G, 5G e outros;
- tecnologia predominante por volume de sessões.
- índice de concentração relativa e período de pico observados.

Percentuais de sessões não são teste de velocidade nem garantia de cobertura. Turnover, headcount e metas ESG demonstrativos devem ser substituídos pela fonte empresarial antes do uso em produção.

## Validação desta versão

- Candidatos na fonte: {status['candidatos_fonte']}
- Candidatos no mock de resposta `/match`: {status['candidatos_match']}
- Linhas da shortlist Power BI: {status['shortlist_powerbi']}
- Regiões derivadas: {status['regioes_agregadas']}
- Linhas de regiões para Power BI: {status['regioes_powerbi']}
- Cruzamentos candidato/região: {status['cruzamentos']}

Consulte `docs/linhagem-dados-oficiais.md` para a linhagem completa.
"""


def gerar_checklist(status: dict) -> str:
    checks = [
        (f"Fonte oficial com {TOTAL_CANDIDATOS_OFICIAL} candidatos", status["candidatos_fonte"] == TOTAL_CANDIDATOS_OFICIAL),
        (f"Resposta /match com {TOTAL_CANDIDATOS_OFICIAL} candidatos", status["candidatos_match"] == TOTAL_CANDIDATOS_OFICIAL),
        (f"Shortlist Power BI com {TOTAL_CANDIDATOS_OFICIAL} registros", status["shortlist_powerbi"] == TOTAL_CANDIDATOS_OFICIAL),
        ("Mesma quantidade de regiões nos arquivos processado e Power BI", status["regioes_agregadas"] > 0 and status["regioes_agregadas"] == status["regioes_powerbi"]),
        (f"Cruzamento com {TOTAL_CANDIDATOS_OFICIAL} candidatos", status["cruzamentos"] == TOTAL_CANDIDATOS_OFICIAL),
    ]
    linhas = ["# Checklist dos entregáveis", ""]
    linhas.extend(f"- [{'x' if ok else ' '}] {nome}" for nome, ok in checks)
    return "\n".join(linhas) + "\n"


def gerar_consolidado(status: dict) -> str:
    return f"""# Entregáveis da plataforma No Country

Gerado em {status['data_geracao']}.

{gerar_documentacao(status)}

## Ferramentas confirmadas

- Git e GitHub
- Java / Spring Boot
- MySQL / Flyway
- React / TypeScript
- Python
- Power BI

## Link do projeto

- Repositório: https://github.com/No-Country-simulation/S06-26-AB-Equipe_23

## Validação

{gerar_checklist(status)}
"""


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    status = coletar_status()
    arquivos = {
        "tarefa_1_documentacao_projeto.md": gerar_documentacao(status),
        "tarefa_2_roteiro_video_demo.md": "# Roteiro do vídeo demo\n\nGravar após a integração real das rotas e a validação das fontes.\n",
        "tarefa_3_ferramentas_equipe.md": "# Ferramentas\n\n- Git e GitHub\n- Java / Spring Boot\n- MySQL / Flyway\n- React / TypeScript\n- Python\n- Power BI\n",
        "tarefa_4_links_projeto.md": "# Links\n\n- https://github.com/No-Country-simulation/S06-26-AB-Equipe_23\n",
        "checklist_entregaveis.md": gerar_checklist(status),
        "status_entregaveis.json": json.dumps(status, ensure_ascii=False, indent=2),
        "plataforma_colar_tudo.md": gerar_consolidado(status),
    }
    for nome, conteudo in arquivos.items():
        (OUT_DIR / nome).write_text(conteudo, encoding="utf-8")
    DOCS_DESTINO.write_text(gerar_consolidado(status), encoding="utf-8")
    print(json.dumps(status, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
