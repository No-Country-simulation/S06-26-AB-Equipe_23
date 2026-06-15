# README BI - BiT App

## Papel da camada de BI

A camada de BI/Dados organiza as informacoes que sustentam o produto:

- dados de candidatos e vagas;
- regras de score match;
- modelagem conceitual;
- contratos de API para backend/frontend;
- base de conectividade Anatel/Vísent;
- mocks para desenvolvimento.

## Arquivos principais

| Arquivo | Finalidade |
|---|---|
| `docs/dicionario-dados.md` | Dicionario inicial do modelo de dados |
| `docs/dicionario-antenas-sinal.md` | Dicionario da base tratada de antenas e sinal |
| `docs/score-match.md` | Formula matematica do match |
| `docs/contrato-api.md` | Contratos de resposta para backend/frontend |
| `docs/painel-conectividade-anatel.md` | Proposta do mapa/painel Anatel |
| `docs/separacao-metricas-dashboard.md` | Separacao entre dashboard inicial e insights regionais |
| `docs/fluxo-aprovacao-candidato.md` | Fluxo de anonimização e liberação de contato após aprovação |
| `docs/entrega-para-andre.md` | Orientacao para continuidade da frente de dados/ETL |
| `database/modelagem_sql_server.sql` | Modelo fisico inicial em SQL Server |
| `database/V1__modelagem_inicial_mysql.sql` | Versao MySQL/Flyway para backend |
| `mocks/match_payload.json` | Mock da shortlist anonima |
| `mocks/candidatos_teste.json` | Massa ficticia de candidatos para testes |
| `mocks/insights_payload.json` | Mock de insights gerais |
| `mocks/insights_conectividade_payload.json` | Mock do mapa de conectividade |
| `data/processed/antenas_sinal_tratadas.csv` | Base leve tratada para mapa |
| `scripts/processa_dataset_visent_local.py` | Script de tratamento do dataset |

## Como a equipe deve usar

Backend:

- usar `mocks/` para endpoints simulados;
- manter `POST /match`;
- manter `GET /insights/regioes`;
- usar `database/V1__modelagem_inicial_mysql.sql` como referencia do Flyway.

Frontend:

- consumir os mocks ou endpoints equivalentes;
- mostrar candidatos anonimizados na shortlist;
- liberar nome e contato apenas apos aprovacao na triagem;
- usar `pontos_mapa` para renderizar mapa de conectividade.

Dados/BI:

- evoluir o score match;
- validar campos do dataset;
- manter separadas as metricas de dashboard e os insights regionais;
- documentar novas regras antes de implementar.

## Proximo passo recomendado

1. Backend ler `mocks/match_payload.json` e `mocks/insights_conectividade_payload.json`.
2. Frontend criar tela de shortlist e painel de conectividade.
3. André usar `docs/entrega-para-andre.md` e `mocks/candidatos_teste.json` para validar a frente de dados.
4. Dados revisar score match v2 com conectividade como componente explicativo.

