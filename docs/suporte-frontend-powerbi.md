# Suporte ao Frontend na implementação do Power BI

## Objetivo

Definir o suporte de BI ao frontend caso a incorporação do Power BI quebre por iframe, rota, permissão ou token expirado.

## Fonte dos dados

Shortlist:

- `data/powerbi/shortlist_candidatos_powerbi.csv`
- origem: `mocks/candidatos_teste.json`
- geração: `python -m scripts.gera_shortlist_mvp`

Regiões:

- `data/powerbi/insights_regioes_powerbi.csv`
- geração: scripts de insights regionais já versionados

Métricas demonstrativas:

- `data/powerbi/metricas_empresa_demo.csv`
- documentação: `docs/power-bi-medidas-dax.md`

## Regras para iframe

- Reservar área responsiva para o relatório.
- Exibir estado de carregamento.
- Exibir erro explícito se o embed falhar.
- Não criar fallback falso com dados inventados.
- Evitar esconder erro de token como tela vazia.

## Se o iframe quebrar

Verificar nesta ordem:

1. URL do relatório está correta.
2. Domínio de embed está autorizado.
3. A rota do frontend permite renderizar iframe.
4. CSP ou headers não bloqueiam `frame-src`.
5. Usuário tem permissão para visualizar o relatório.
6. Navegador não bloqueou cookies/sessão necessários.
7. Console não mostra erro de CORS, CSP, 401, 403 ou token expirado.

## Se o token expirar

Comportamento esperado:

- Detectar erro de autenticação/autorização.
- Mostrar mensagem de sessão expirada ou relatório indisponível.
- Solicitar novo token pelo fluxo correto.
- Não manter iframe quebrado sem feedback.
- Não salvar token em local inseguro.

## Dados que o frontend pode exibir antes da aprovação

- `candidato_id`
- `apelido_exibicao`
- `status_identificacao`
- `cargo_alvo`
- `nivel`
- `regiao`
- `cluster_residencia`
- `modelo_trabalho_preferido`
- `skills`
- `anos_experiencia`
- `badge_diversidade`
- `score_match`

## Dados que o frontend não pode exibir na shortlist inicial

- nome real
- e-mail
- telefone
- LinkedIn
- `contato_pos_aprovacao`

## Critérios de aceite

- Relatório carrega sem tela vazia.
- Erros de iframe/token aparecem de forma clara.
- Shortlist mostra apenas dados anonimizados.
- Score exibido é o `score_match` recalculado.
- Frontend não cria candidatos ou métricas artificiais para contornar falha de API ou BI.

