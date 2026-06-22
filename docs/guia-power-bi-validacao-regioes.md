# Validação regional no Power BI

Importe `data/powerbi/insights_regioes_powerbi.csv` em UTF-8.

Valide:

- 24 pares município/cluster derivados;
- 132 antenas no total;
- latitude e longitude como número decimal;
- totais e percentuais de sessões 3G, 4G, 5G e outros;
- tecnologia predominante calculada pelo maior total de sessões.

No mapa, use latitude/longitude, tamanho por `qtd_antenas` e legenda por `tecnologia_predominante_regiao`. Não interprete sessões como velocidade ou garantia de cobertura.
