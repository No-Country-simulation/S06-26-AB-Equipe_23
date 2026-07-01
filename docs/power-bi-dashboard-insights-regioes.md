# Dashboard Power BI — Insights regionais

## Fonte

Importar `data/powerbi/insights_regioes_powerbi.csv`, gerado por:

```powershell
python scripts/gera_insights_regioes.py
python scripts/gera_powerbi_insights_regioes.py
```

## Visuais suportados

- cards: regiões, municípios, antenas e sessões;
- mapa: `lat_media`, `lon_media`, tamanho por `qtd_antenas` e legenda por `tecnologia_predominante_regiao`;
- barras: sessões por região e tecnologia;
- tabela: município, cluster, antenas, sessões e percentuais 3G/4G/5G;
- filtros: município, cluster e tecnologia predominante.

## Limitação

Os valores representam sessões observadas no tensor Vísent. Não são medições de velocidade, estabilidade ou garantia de cobertura. Alertas, notas de qualidade e recomendações de RH não devem ser calculados sem uma regra oficial validada.
