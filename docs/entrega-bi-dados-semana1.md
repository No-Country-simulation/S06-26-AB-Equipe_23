# Entrega BI/Dados

## Entradas oficiais

- `mocks/candidatos_teste.json`: 8 candidatos de teste do projeto.
- `antenas_flp.csv`: 132 antenas reais da Anatel distribuídas no Vísent.
- `tensor_mobilidade.csv`: sessões de telecomunicações do Vísent.

## Saídas versionadas

- `data/processed/antenas_sinal_tratadas.csv`;
- `data/processed/insights_regioes_agregado.csv`;
- `data/powerbi/insights_regioes_powerbi.csv`;
- `data/powerbi/shortlist_candidatos_powerbi.csv`;
- `mocks/insights_conectividade_payload.json`;
- `mocks/match_payload.json`.

## Execução

```powershell
python scripts/valida_base_antenas.py
python scripts/gera_insights_regioes.py
python scripts/gera_powerbi_insights_regioes.py
python scripts/gera_shortlist_mvp.py
python scripts/_aux_cruzamento_candidatos.py
```

O Vísent não fornece candidatos. Seus assinantes representam usuários de telecomunicações e não integram a shortlist.
