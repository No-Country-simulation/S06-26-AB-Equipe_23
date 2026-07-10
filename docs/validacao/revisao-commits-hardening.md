# Revisao dos commits de hardening

Revisao individual executada sem reescrever o historico.

| Commit | Objetivo e arquivos | Aderencia | Teste | Risco e regressao | Segredos ou alteracao alheia |
|---|---|---|---|---|---|
| `6fafe28` | DTOs, mapper, matching, insights, tipos e testes | Remove PII do contrato pre-aprovacao e cria alias estavel | Contrato: 3/3; backend: 31/31; resposta real: 8 candidatos e 0 campos proibidos | Medio: altera contrato HTTP; frontend foi ajustado junto | Nenhum segredo ou arquivo alheio |
| `e8a64dd` | Login, router, header, layout, Axios, sessao e titulo | Feedback, bloqueio duplicado, expiracao, logout e limpeza de cache | E2E: login/logout em 3 viewports; build e lint | Medio: guard depende do `exp` do JWT; backend continua validando assinatura | Nenhuma credencial gravada |
| `7c26e8d` | ESG, Saude, Formacoes, Mentorias e ADR | Identifica demonstrativos, bloqueia links ficticios e evita falsa persistencia | E2E e build | Baixo: apenas copy/CTA e documentacao | Nenhum segredo ou regra de negocio alterada |
| `f85afec` | Home, Relatorio ESG isolado, shortlist, vagas e Axios | Remove erros de lint e alinha navegacao/rotulagem local | Lint, build e E2E | Baixo a medio: derivacao do painel por rota; todas as rotas foram testadas | Nenhum segredo; escopo coerente |
| `9d3a681` | Relatorio final local | Registra comandos, resultados e ressalvas | Numeros reconfirmados nesta validacao | Baixo: documentacao poderia ficar desatualizada; foi atualizada no setimo commit | Nenhuma credencial |
| `a7db296` | Baseline | Registra origem, problemas e comandos | Comparado com `e751edc` e log atual | Baixo: historico documental | Nenhuma credencial |

## Verificacoes especiais

- `/match` local autenticado retornou 8 candidatos, todos com `candidato_id` e `apelido_exibicao`.
- Duas chamadas produziram os mesmos aliases e ordenacao de score.
- Busca recursiva encontrou zero ocorrencias dos campos proibidos antes da aprovacao.
- Logout removeu token e caches sensiveis; voltar e acessar `/vagas` apos logout redirecionaram para `/login`.
- ESG, Saude do Time e Power BI estao identificados como demonstrativos.
- Vagas e mentorias nao afirmam persistencia de backend.
- URLs de `example.com` historicas no seed nao sao abertas pelo frontend; o CTA fica desabilitado como conteudo demonstrativo.
