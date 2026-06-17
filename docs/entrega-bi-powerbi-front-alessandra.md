# Entrega BI - Power BI e Apoio ao Front

## Objetivo

Consolidar a entrega de BI para apoiar a Alessandra na construcao do front-end e na validacao visual pelo Power BI.

Esta entrega cobre:

- validacao geografica das 24 regioes;
- tela de insights regionais/conectividade;
- dashboard executivo Tela 2;
- filtros e interacoes esperadas;
- medidas DAX;
- bases preparadas para Power BI;
- criterios de aceite.

## Arquivos preparados para Power BI

| Arquivo | Uso |
|---|---|
| `data/powerbi/insights_regioes_powerbi.csv` | Base principal da pagina de Insights Regionais |
| `data/powerbi/candidatos_powerbi.csv` | Massa sintetica de 200 candidatos para filtros, graficos e validacao visual |
| `data/powerbi/dashboard_tela2_mvp.csv` | Indicadores executivos da Tela 2 |
| `data/powerbi/shortlist_candidatos_powerbi.csv` | Tabela anonima de candidatos para Tela 2 |

## Documentos de montagem

| Documento | Finalidade |
|---|---|
| `docs/power-bi-dashboard-insights-regioes.md` | Layout completo da pagina de Insights Regionais |
| `docs/power-bi-dashboard-tela-2.md` | Layout completo da Tela 2 |
| `docs/power-bi-medidas-dax.md` | Medidas DAX prontas para os dashboards |
| `docs/guia-power-bi-validacao-regioes.md` | Passo a passo da validacao geografica das 24 regioes |
| `docs/especificacao-front-insights-regioes.md` | Especificacao para implementar a tela de insights no React |
| `docs/especificacao-dashboard-tela-2.md` | Especificacao para implementar a Tela 2 no React |

## Scripts

| Script | Saida |
|---|---|
| `scripts/gera_insights_regioes.py` | `data/processed/insights_regioes_agregado.csv` |
| `scripts/gera_powerbi_insights_regioes.py` | `data/powerbi/insights_regioes_powerbi.csv` |
| `scripts/gera_powerbi_candidatos.py` | `data/powerbi/candidatos_powerbi.csv` |
| `scripts/gera_powerbi_dashboard_tela2.py` | CSVs da Tela 2 |
| `scripts/gera_validacao_mapa_regioes.py` | Relatorio e HTML local complementar |

## Pagina 1 - Insights Regionais

### Deve conter

- Mapa das 24 regioes.
- Cards de regioes, municipios, antenas, sessoes e alertas.
- Filtros por municipio, cluster, indicador, tecnologia, faixa de antenas e faixa de sessoes.
- Ranking de clusters por total de sessoes.
- Composicao 3G/4G/5G.
- Donut de indicadores.
- Tabela detalhada.

### Filtros obrigatorios

- `municipio`
- `cluster`
- `indicador_label`
- `tecnologia_predominante_regiao`
- `faixa_antenas`
- `faixa_sessoes`
- `categoria_4g_5g`
- `possui_alerta`

### Resultado esperado com a base atual

- 24 regioes.
- 4 municipios.
- Todos os indicadores como `Alta`.
- Nenhum alerta.
- Pontos concentrados na Grande Florianopolis.

## Pagina 2 - Dashboard Tela 2

### Deve conter

- Cards de vagas, candidatos analisados, shortlist, score medio, turnover e meta ESG.
- Grafico de score por candidato anonimizado.
- Grafico de shortlist por regiao.
- Graficos de distribuicao da massa sintetica de 200 candidatos por regiao, nivel, skills e status do funil.
- Bloco ESG com meta atual vs meta esperada.
- Bloco turnover com percentual, risco e fatores.
- Tabela de shortlist anonima.

### Filtros obrigatorios

- `nivel`
- `regiao`
- `cargo_alvo`
- `badge_diversidade`
- `status_identificacao`

### Regras criticas

- Candidato deve aparecer como `Candidato 1`, `Candidato 2` etc.
- Nome, email, telefone e LinkedIn nao aparecem antes da aprovacao.
- A massa de 200 candidatos e para analise visual/Power BI; o retorno do `/match` continua sendo uma shortlist filtrada.
- ESG nao elimina candidato.
- Conectividade nao elimina candidato.
- Turnover e ESG ficam no dashboard executivo.
- Antenas e mapa ficam na pagina de Insights Regionais.

## Ponte para o front-end

O front pode replicar a logica do Power BI usando:

- `GET /insights/regioes` para Insights Regionais;
- `POST /match` para shortlist, ESG e score;
- mocks atuais enquanto o backend nao fecha.

Rotas acordadas:

```text
POST /match
GET /insights/regioes
```

## Checklist antes de apresentar

- [ ] Importar `data/powerbi/insights_regioes_powerbi.csv` no Power BI.
- [ ] Conferir `lat_media` como Latitude.
- [ ] Conferir `lon_media` como Longitude.
- [ ] Validar que aparecem 24 pontos no mapa.
- [ ] Conferir que todos os pontos estao na Grande Florianopolis.
- [ ] Aplicar filtros de municipio, cluster, indicador e tecnologia.
- [ ] Importar `dashboard_tela2_mvp.csv`.
- [ ] Importar `shortlist_candidatos_powerbi.csv`.
- [ ] Criar cards da Tela 2.
- [ ] Conferir que candidatos seguem anonimizados.
- [ ] Conferir que ESG/turnover nao foram misturados com mapa de conectividade.

## Observacao para alinhamento

O HTML em `exports/validacao_mapa_regioes.html` e apenas uma maquete local complementar para conferencia rapida. A validacao visual oficial deve ser feita no Power BI.
