# Entrega BI/Power BI para o frontend

## Dashboard da shortlist

Fonte: `data/powerbi/shortlist_candidatos_powerbi.csv`, gerada dos 8 registros de `mocks/candidatos_teste.json`.

Exibir total analisado, total retornado, score fornecido pela fonte, cargo, nível, região, skills e badge. O contato não aparece antes da aprovação.

## Painel regional

Fonte: `data/powerbi/insights_regioes_powerbi.csv`, derivada das antenas Anatel e sessões do Vísent.

Exibir regiões, municípios, antenas, sessões, percentuais por tecnologia, tecnologia predominante, filtros e mapa por coordenadas.

## Saúde do Time e ESG

- Base demonstrativa: `data/powerbi/metricas_empresa_demo.csv`.
- Medidas: `docs/power-bi-medidas-dax.md`.
- Layout: `docs/especificacao-dashboard-tela-2.md`.
- Protótipo: `exports/mock_dashboard_metricas_empresa.html`.

O frontend deve reservar espaço nas telas `Relatório ESG` e `Saúde do time` para futura incorporação via iframe ou componentes nativos. Até a conexão empresarial, a tela permanece identificada como demonstrativa.

## Limites

- O Vísent não contém candidatos.
- A base de Turnover/ESG é propositalmente fictícia para prototipação e deve ser substituída pela fonte corporativa.
- Sessões observadas não garantem qualidade ou cobertura de rede.
- A indisponibilidade da API deve ser explícita; o frontend não deve fabricar fallback.
