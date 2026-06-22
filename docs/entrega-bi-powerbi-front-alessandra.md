# Entrega BI/Power BI para o frontend

## Dashboard da shortlist

Fonte: `data/powerbi/shortlist_candidatos_powerbi.csv`, gerada dos 8 registros de `mocks/candidatos_teste.json`.

Exibir total analisado, total retornado, score fornecido pela fonte, cargo, nível, região, skills e badge. O contato não aparece antes da aprovação.

## Painel regional

Fonte: `data/powerbi/insights_regioes_powerbi.csv`, derivada das antenas Anatel e sessões do Vísent.

Exibir regiões, municípios, antenas, sessões, percentuais por tecnologia, tecnologia predominante, filtros e mapa por coordenadas.

## Limites

- O Vísent não contém candidatos.
- Não existe fonte corporativa atual para turnover, headcount, desligamentos ou metas ESG.
- Sessões observadas não garantem qualidade ou cobertura de rede.
- A indisponibilidade da API deve ser explícita; o frontend não deve fabricar fallback.
