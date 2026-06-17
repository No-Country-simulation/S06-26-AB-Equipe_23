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
| `docs/base-agregada-insights-regioes.md` | Documentacao da base agregada para `/insights/regioes` |
| `docs/separacao-metricas-dashboard.md` | Separacao entre dashboard inicial e insights regionais |
| `docs/especificacao-front-insights-regioes.md` | Especificacao dos filtros, mapa, tooltip e clique para a tela de insights |
| `docs/especificacao-dashboard-tela-2.md` | Especificacao dos cards e graficos de Turnover/ESG para o dashboard |
| `docs/guia-power-bi-validacao-regioes.md` | Guia para validar as 24 regioes no Power BI |
| `docs/power-bi-dashboard-insights-regioes.md` | Layout completo da pagina de Insights Regionais no Power BI |
| `docs/power-bi-dashboard-tela-2.md` | Layout completo da Tela 2 no Power BI |
| `docs/power-bi-medidas-dax.md` | Medidas DAX para Insights Regionais e Tela 2 |
| `docs/entrega-bi-powerbi-front-alessandra.md` | Checklist consolidado da entrega BI para Power BI e front |
| `docs/fluxo-aprovacao-candidato.md` | Fluxo de anonimização e liberação de contato após aprovação |
| `docs/entrega-para-andre.md` | Orientacao para continuidade da frente de dados/ETL |
| `database/modelagem_sql_server.sql` | Modelo fisico inicial em SQL Server |
| `database/V1__modelagem_inicial_mysql.sql` | Versao MySQL/Flyway para backend |
| `mocks/match_payload.json` | Mock da shortlist anonima |
| `mocks/candidatos_teste.json` | Massa ficticia de candidatos para testes |
| `mocks/insights_payload.json` | Mock de insights gerais |
| `mocks/insights_conectividade_payload.json` | Mock do mapa de conectividade |
| `data/processed/antenas_sinal_tratadas.csv` | Base detalhada por antena/celula, indicada para calculo de distancia |
| `data/processed/insights_regioes_agregado.csv` | Base agregada por municipio/cluster, indicada para dashboard e `/insights/regioes` |
| `data/powerbi/insights_regioes_powerbi.csv` | Base tratada e enriquecida para Power BI - Insights Regionais |
| `data/powerbi/dashboard_tela2_mvp.csv` | Indicadores executivos para Power BI - Tela 2 |
| `data/powerbi/shortlist_candidatos_powerbi.csv` | Shortlist anonimizada para Power BI - Tela 2 |
| `scripts/processa_dataset_visent_local.py` | Script de tratamento do dataset |
| `scripts/gera_insights_regioes.py` | Script que gera a base agregada de regioes |
| `scripts/gera_powerbi_insights_regioes.py` | Script que prepara a base de Insights Regionais para Power BI |
| `scripts/gera_powerbi_dashboard_tela2.py` | Script que prepara os CSVs da Tela 2 para Power BI |
| `scripts/gera_validacao_mapa_regioes.py` | Script que gera validacao local do mapa das 24 regioes |
| `reports/validacao-mapa-regioes.md` | Relatorio de conferencia das coordenadas e indicadores |
| `exports/validacao_mapa_regioes.html` | Previa local complementar dos pontos do mapa, sem substituir o Power BI |

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

1. Revisar `docs/entrega-bi-powerbi-front-alessandra.md`.
2. Validar as 24 regioes no Power BI usando `docs/guia-power-bi-validacao-regioes.md`.
3. Montar a pagina de Insights com `docs/power-bi-dashboard-insights-regioes.md`.
4. Montar a Tela 2 com `docs/power-bi-dashboard-tela-2.md`.
5. Usar `docs/power-bi-medidas-dax.md` para cards e indicadores.
6. Frontend usar `docs/especificacao-front-insights-regioes.md` e `docs/especificacao-dashboard-tela-2.md`.
7. Backend ler `mocks/match_payload.json` e `mocks/insights_conectividade_payload.json`.
8. André usar `docs/entrega-para-andre.md`, `mocks/candidatos_teste.json` e `data/processed/insights_regioes_agregado.csv` para validar a frente de dados.

