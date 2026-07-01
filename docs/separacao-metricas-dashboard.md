# Separação das métricas

## Shortlist

Fonte: `mocks/candidatos_teste.json`.

- total de candidatos analisados e retornados;
- score já fornecido pelo arquivo;
- cargo, nível, região, skills e badge;
- identificação anonimizada.

## Regiões

Fontes: antenas Anatel e sessões do Vísent.

- quantidade de antenas;
- coordenadas médias;
- sessões e percentuais 3G, 4G, 5G e outros;
- tecnologia predominante por volume observado.

## Estrutura demonstrativa

Turnover, headcount, desligamentos e metas ESG usam `metricas_empresa_demo.csv` somente para travar layout e fórmulas. Esses valores não devem ser calculados a partir de score de candidato nem exibidos como reais. A produção dependerá da fonte corporativa cadastrada pela empresa.
