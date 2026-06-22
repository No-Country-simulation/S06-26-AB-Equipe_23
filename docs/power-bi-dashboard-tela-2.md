# Power BI - Shortlist do MVP

## Fonte

- `mocks/candidatos_teste.json`: oito candidatos do input oficial do projeto.
- `data/powerbi/shortlist_candidatos_powerbi.csv`: projeção anonimizada gerada por `scripts/gera_shortlist_mvp.py`.

## Visuais permitidos

- total de candidatos disponíveis;
- score médio informado no input;
- candidatos por região, nível e cargo;
- distribuição dos badges informados;
- tabela anonimizada com skills e score informado.

## Privacidade

Nome, e-mail, telefone e LinkedIn ficam em `contato_pos_aprovacao` no input e não são exportados para o Power BI nem retornados no `POST /match` inicial.

## Métricas indisponíveis

Turnover corporativo, evolução temporal, headcount, desligamentos e metas ESG da empresa não existem nos arquivos oficiais atuais. Esses visuais devem permanecer como espaço reservado até a entrada de uma fonte empresarial validada.

## Critério de aceite

- exatamente oito registros provenientes do input oficial;
- nenhum contato pessoal na shortlist;
- nenhuma massa artificial para preencher gráficos;
- toda medida deve ser reproduzível a partir do CSV ou JSON de origem.
