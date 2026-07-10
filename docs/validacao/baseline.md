# Baseline de endurecimento do MVP

## Origem

- Data: 2026-07-10
- Branch de origem: `main`
- Commit de origem: `e751edc784c1bf454641f24892e17ac2a860204a`
- Branch de trabalho: `fix/mvp-hardening-completo`

## Alteracoes locais preexistentes

Os arquivos abaixo ja estavam nao versionados antes desta tarefa. Eles foram preservados e nao devem entrar nos commits de endurecimento:

- `docs/comunicado_status_appbit.html`
- `docs/comunicado_status_appbit.pdf`
- `docs/plano-final-deploy-demo-2026-07-09.md`
- `docs/registro_fase_testes_deploy_appbit.pdf`

## Problemas confirmados

- O contrato pre-aprovacao de `POST /match` inclui nome, CEP, latitude, longitude e cluster de residencia.
- O frontend espera `apelido_exibicao`, mas o DTO atual do backend nao fornece esse campo.
- A autenticacao do frontend considera qualquer texto salvo em `localStorage.token` como sessao valida.
- O login nao possui estado de carregamento e trata falha de rede como credencial invalida.
- Nao existe logout explicito com limpeza dos dados sensiveis locais.
- A interface ainda contem os termos `aceder` e `palavra-passe` e o titulo HTML permanece `frontend`.
- Trilhas usam links `example.com` e alguns modulos demonstrativos parecem persistentes ou produtivos.
- Indicadores de ESG e Saude do Time usam recortes demonstrativos sem rotulagem uniforme.
- A responsividade ainda nao possui evidencia reproduzivel nas tres resolucoes exigidas.

## Comandos oficiais de validacao

Frontend:

```powershell
npm run build
npm run lint
```

Backend:

```powershell
cd backend
.\mvnw.cmd test --no-transfer-progress
```

Data / BI:

```powershell
python -m pytest tests/test_score_match.py tests/test_score_regression.py tests/test_anonymization.py -q
python scripts/valida_integracao_bi.py
```

## Resultado da linha de base

- Frontend: build Vite concluido, 107 modulos transformados.
- Backend: `BUILD SUCCESS`, 28 testes, 0 falhas, 0 erros, 0 ignorados.
- Data / BI: 7 testes aprovados; 8 candidatos, privacidade dos artefatos, 132 antenas, 24 regioes e servicos MVP reconciliados.

## Limitacoes conhecidas

- Nao ha suite automatizada de frontend ou Playwright configurada no projeto.
- O teste do backend em H2 leva alguns minutos e emite avisos de compatibilidade de Flyway/H2 e carregamento dinamico do Mockito.
- Nenhuma credencial ou dado do ambiente de producao sera usado ou alterado nesta branch.
- Nenhum push, merge, PR ou deploy faz parte desta execucao.
