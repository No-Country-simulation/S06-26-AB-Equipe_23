# Modelagem Conceitual - SQL Server

## Objetivo

Propor uma estrutura inicial de tabelas para apoiar candidatos, vagas, regiões, concentração regional, fluxos e resultados de matching no BiT App B2B.

## Tabelas sugeridas

| Tabela | Finalidade |
|---|---|
| `dim_regiao` | Cadastro de clusters, municípios e coordenadas |
| `dim_antena` | Cadastro de antenas e localização |
| `dim_candidato` | Candidatos simulados/sub-representados |
| `dim_skill` | Lista de habilidades |
| `bridge_candidato_skill` | Relação entre candidatos e habilidades |
| `dim_vaga` | Vagas publicadas pelas empresas |
| `bridge_vaga_skill` | Relação entre vagas e habilidades exigidas |
| `fact_concentracao_regional` | Concentração por antena, data e período |
| `fact_fluxo_regional` | Fluxos origem-destino entre regiões |
| `fact_match` | Resultado do score entre vaga e candidato |

## Ideia da modelagem

A modelagem separa três camadas:

1. Dados regionais vindos do dataset Vísent.
2. Dados simulados de candidatos, vagas e skills.
3. Resultado analítico do matching e métricas de diversidade.

## Uso no MVP

Para a primeira versão, o backend pode começar com dados simulados em JSON. A modelagem SQL Server serve como referência para evolução futura do banco.

## Relação com o produto

- `dim_regiao` e `dim_antena` apoiam mapa e insights regionais.
- `dim_candidato` e `dim_skill` apoiam shortlist.
- `dim_vaga` registra as necessidades da empresa.
- `fact_match` guarda o resultado do score.
- `fact_concentracao_regional` e `fact_fluxo_regional` apoiam dashboard.
