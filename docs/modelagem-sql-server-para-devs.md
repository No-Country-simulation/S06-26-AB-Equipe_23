# Modelagem SQL Server - Explicação para Desenvolvimento

## Objetivo

A modelagem conceitual organiza as entidades que o sistema precisa entender antes de virar API, banco ou tela.

Para o MVP, ela não precisa ser implementada inteira no primeiro momento. Ela serve como guia para backend e frontend trabalharem com os mesmos conceitos.

## Tabelas principais

| Tabela | Para que serve |
|---|---|
| `dim_regiao` | Guarda clusters, municípios e coordenadas usados nos insights regionais |
| `dim_antena` | Guarda antenas da base Anatel/Vísent com latitude e longitude |
| `dim_candidato` | Guarda candidatos simulados/sub-representados |
| `dim_skill` | Guarda habilidades como SQL, Python, Power BI |
| `bridge_candidato_skill` | Liga candidatos às suas habilidades |
| `dim_vaga` | Guarda vagas publicadas pela empresa |
| `bridge_vaga_skill` | Liga vagas às habilidades exigidas |
| `fact_concentracao_regional` | Guarda concentração de usuários por região/período |
| `fact_fluxo_regional` | Guarda fluxos origem-destino entre regiões |
| `fact_match` | Guarda resultado do score entre vaga e candidato |

## O que é essencial para o MVP

Para o primeiro backend mockado:

- `dim_candidato`
- `dim_skill`
- `dim_vaga`
- `fact_match`

Para os insights regionais:

- `dim_regiao`
- `dim_antena`
- `fact_concentracao_regional`
- `fact_fluxo_regional`

## Como explicar para o backend

O backend pode começar lendo JSON da pasta `mocks`. A modelagem SQL Server fica como referência para quando o banco for implementado.

## Como explicar para o frontend

O frontend não precisa conhecer todas as tabelas. Ele precisa consumir os campos finais dos endpoints:

- `/match`: candidatos anonimizados, score, skills, região, badge e explicação.
- `/insights/regioes`: regiões, coordenadas, concentração e indicadores.
