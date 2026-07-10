# Relatorio final de hardening do MVP

## Veredito

APROVADO localmente. Os contratos de matching, autenticacao, build, Data/BI e responsividade passaram. Playwright foi adicionado como dependencia de desenvolvimento e validou 30 combinacoes de rota e viewport.

## Origem e branch

- Origem: `e751edc784c1bf454641f24892e17ac2a860204a`
- Branch: `fix/mvp-hardening-completo`
- Nenhum push, merge ou deploy foi executado.

## Commits da execucao

- `6fafe28` - `fix(privacy): anonymize pre-approval matching contract`
- `e8a64dd` - `fix(auth): add reliable login feedback and secure logout`
- `7c26e8d` - `fix(demo): label non-production modules and remove false claims`
- `f85afec` - `fix(demo): label non-production modules and remove false claims`
- Setimo commit: evidencias responsivas e revisao da branch, criado apos os gates locais.

Os commits podem ser revertidos individualmente com `git revert <HASH>`, na ordem inversa caso todos precisem ser desfeitos.

## Correcoes e evidencias

| Problema | Causa | Correcao | Evidencia |
| --- | --- | --- | --- |
| PII no `/match` | DTO pre-aprovacao carregava dados pessoais e localizacao precisa | DTO separado, alias deterministico e campos proibidos removidos da resposta | `MatchingPrivacyContractTest`: 3 testes verdes |
| Login sem feedback | Envio sem estado de carregamento e erro generico | Botao bloqueado, `Entrando...`, mensagens por tipo de falha e mostrar/ocultar senha | `npm run build` verde |
| Sessao fraca | Guard aceitava qualquer texto em `localStorage.token` | Validacao do payload JWT, expiracao, limpeza em 401/403 e logout com redirect | `npm run lint` verde |
| Modulos demonstrativos pareciam produtivos | Textos afirmavam status ou persistencia inexistente | ESG/Saude rotulados, Power BI descrito como demonstrativo, vagas e mentorias identificadas como locais | ADR-001 |
| Links de midia ficticios | Seed usava URLs de exemplo | O frontend nao abre `example.com` e exibe conteudo demonstrativo | Build verde |

## Testes executados

- `.\mvnw.cmd -Dtest=MatchingPrivacyContractTest test --no-transfer-progress`: 3 testes, 0 falhas, BUILD SUCCESS.
- `.\mvnw.cmd test --no-transfer-progress`: 31 testes, 0 falhas, 0 erros, 0 ignorados, BUILD SUCCESS.
- `npm run lint`: passou sem erros.
- `npm run build`: 108 modulos transformados, passou.
- `python -m pytest tests/test_score_match.py tests/test_score_regression.py tests/test_anonymization.py -q`: 7 testes aprovados.
- `python scripts/valida_integracao_bi.py`: 8 candidatos, 132 antenas, 24 regioes e servicos MVP reconciliados.
- `git diff --check`: passou.
- `npm run test:e2e`: 3 testes aprovados, cobrindo 30 capturas em 390x844, 768x1024 e 1366x768.
- Inspecao real de `/match`: 8 candidatos, 8 aliases estaveis, scores ordenados e zero campos proibidos.

## Pendencias e limitacoes

- Vagas continuam em estado local no hook `useVagas`; nao foram transformadas em persistencia de backend nesta execucao.
- Solicitacoes de mentoria continuam simulacao local porque existe endpoint de leitura, mas nao endpoint de criacao.
- Power BI depende de `VITE_POWERBI_URL`; sem essa variavel, a tela exibe reserva demonstrativa.
- ESG e Saude do Time usam recortes fixos e estao identificados como demonstrativos.
- As evidencias responsivas estao em `docs/validacao/responsividade/`.
- Os arquivos locais preexistentes fora deste lote permanecem nao versionados e nao foram incluidos: PDFs, HTML, plano de deploy e a pasta de validacao existente.

## Como validar no Windows PowerShell

```powershell
npm run lint
npm run build
python -m pytest tests/test_score_match.py tests/test_score_regression.py tests/test_anonymization.py -q
python scripts/valida_integracao_bi.py
cd backend
.\mvnw.cmd test --no-transfer-progress
cd ..
```

## Rollback

Para descartar toda a branch sem alterar a `main`:

```powershell
git switch main
```

Para desfazer os lotes individualmente, usar:

```powershell
git revert f85afec
git revert 7c26e8d
git revert e8a64dd
git revert 6fafe28
```
