# Power BI - Shortlist do MVP

## Fonte

- `mocks/candidatos_teste.json`: oito candidatos do input oficial do projeto.
- `data/powerbi/shortlist_candidatos_powerbi.csv`: projeção anonimizada gerada por `scripts/gera_shortlist_mvp.py`.

## Visuais permitidos

- total de candidatos disponíveis;
- score médio informado no input;
- candidatos por região, nível e cargo;
- distribuição dos badges informados;
- tabela anonimizada com skills e `score_match` recalculado pelo protótipo atual.

## Privacidade

Nome, e-mail, telefone e LinkedIn ficam em `contato_pos_aprovacao` no input e não são exportados para o Power BI nem retornados no `POST /match` inicial.

## Métricas demonstrativas

Turnover corporativo, evolução temporal, headcount, desligamentos e metas ESG usam massa empresarial fictícia apenas para estruturar o relatório. Os visuais devem permanecer identificados como demonstrativos até a entrada de uma fonte empresarial validada.

Consulte `docs/especificacao-dashboard-tela-2.md`, `docs/power-bi-medidas-dax.md` e `data/powerbi/metricas_empresa_demo.csv`.

## Critério de aceite

- exatamente oito registros provenientes do input oficial;
- nenhum contato pessoal na shortlist;
- nenhuma massa artificial de candidatos para preencher gráficos;
- toda medida deve ser reproduzível a partir do CSV ou JSON de origem;
- o ranking deve usar o `score_match` gerado por `python -m scripts.gera_shortlist_mvp`.
