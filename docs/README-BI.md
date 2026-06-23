# BI e Dados

## Fontes

- `mocks/candidatos_teste.json`: 8 candidatos de teste do projeto.
- `data/processed/antenas_sinal_tratadas.csv`: 132 antenas Anatel enriquecidas com sessões observadas no Vísent.

## Saídas

- `mocks/match_payload.json`: shortlist anonimizada.
- `data/powerbi/shortlist_candidatos_powerbi.csv`: shortlist para BI.
- `data/processed/insights_regioes_agregado.csv`: regiões derivadas por município e cluster.
- `data/powerbi/insights_regioes_powerbi.csv`: visão regional para Power BI.
- `data/powerbi/metricas_empresa_demo.csv`: massa empresarial fictícia para estruturar Turnover/ESG.
- `mocks/insights_conectividade_payload.json`: contrato regional para API.

## Geração

```powershell
python scripts/gera_shortlist_mvp.py
python scripts/gera_insights_regioes.py
python scripts/gera_powerbi_insights_regioes.py
python scripts/_aux_cruzamento_candidatos.py
python scripts/gera_metricas_empresa_demo.py
```

Os assinantes do Vísent não são candidatos. Consulte `docs/linhagem-dados-oficiais.md` antes de adicionar métricas.
