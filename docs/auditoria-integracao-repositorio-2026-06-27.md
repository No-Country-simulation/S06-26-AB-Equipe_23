# Auditoria de integração do repositório - 2026-06-27

## Objetivo

Registrar uma checagem transversal do repositório NoCountry/App BiT considerando BI/Dados, Backend e Frontend, para apoiar a integração final até segunda-feira.

## Worktrees verificados

```text
github_work/S06-26-AB-Equipe_23                         -> bi-dados-inicial
github_work/backend-integracao-oficial                  -> feature/backend
github_work/frontend-bi-integracao                      -> frontend-bi-integracao
github_work/S06-26-AB-Equipe_23.worktrees/copilot-*     -> copilot/worktree-2026-06-25T15-11-07
```

## Estado das branches

- `bi-dados-inicial`: commit local `a558061`, 1 commit à frente de `origin/bi-dados-inicial`.
- `feature/backend`: alinhada com `origin/feature/backend` em `75c98cb`.
- `frontend-bi-integracao`: alinhada com `origin/frontend-bi-integracao` em `c7c2012`, mas o tracking local aponta para `origin/frontend`, por isso aparece como `ahead 5`.
- `main`: local está atrás de `origin/main`; a integração final ainda depende do merge coordenado.

## Validações executadas

### BI/Dados

```powershell
python -m scripts.gera_shortlist_mvp
python -m pytest tests/test_score_match.py tests/test_score_regression.py tests/test_anonymization.py -q
python scripts\valida_integracao_bi.py
```

Resultado:

```text
7 passed
OK: candidatos=8, privacidade preservada
OK: antenas=132, regioes=24, sessoes e concentracao reconciliadas
OK: metricas empresariais demonstrativas=1152, segmentos=8
OK: artefatos artificiais de candidatos ausentes
```

### Frontend

No worktree `frontend-bi-integracao`:

```powershell
npm run build
```

Resultado: build concluído com sucesso.

### Backend

No worktree `backend-integracao-oficial`:

```powershell
.\backend\mvnw.cmd test
```

Resultado local: bloqueado por ambiente.

```text
The JAVA_HOME environment variable is not defined correctly
```

O bloqueio local é de máquina/JDK, não prova falha do código. Ainda assim, o CI/CD precisa validar esta frente.

## Pontos que estão batendo

- Backend expõe `POST /match` e `POST /match/aprovar-candidato`.
- Backend possui DTO de shortlist com `score_match`, `candidato_id`, `apelido_exibicao`, `status_identificacao`, região, skills e badge.
- Frontend possui tipos TypeScript compatíveis com `MatchResponse` e `CandidatoMatch`.
- Frontend não fabrica fallback silencioso para candidatos se `/match` falhar.
- BI/Dados mantém 8 candidatos oficiais e preserva anonimização.
- Frontend builda com sucesso no estado atual.

## Pontos de atenção

### 1. Score recalculado no BI ainda não está refletido no backend

O BI/Dados agora recalcula `score_match` com `scripts/score_match.py` e exporta novas notas:

- `cand_001`: 80
- `cand_002`: 61
- `cand_003`: 56
- `cand_004`: 68
- `cand_005`: 63
- `cand_006`: 49
- `cand_007`: 78
- `cand_008`: 58

O backend `feature/backend` ainda lê `backend/src/main/resources/mocks/candidatos_teste.json`, onde os scores continuam no padrão antigo:

- `cand_001`: 91
- `cand_002`: 86
- `cand_003`: 84
- `cand_004`: 82
- `cand_005`: 79
- `cand_006`: 73
- `cand_007`: 88
- `cand_008`: 76

Decisão necessária:

- atualizar o mock do backend com os scores recalculados; ou
- implementar no backend a mesma regra documentada em `docs/score-match.md`; ou
- definir que o backend consome artefato gerado por Dados/BI.

### 2. `application-test` ainda é risco para H2/Flyway

O backend está com:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true
```

Isso pode quebrar testes em H2 se as migrations MySQL não forem 100% compatíveis com H2.

Opções alinhadas com a demanda:

- usar `ddl-auto=create-drop` e desabilitar Flyway no perfil de teste; ou
- manter Flyway ligado, mas garantir migrations compatíveis com H2; ou
- isolar testes que dependem de schema real.

### 3. JWT ainda tem fallback hardcoded

`backend/src/main/resources/application.yaml` contém fallback:

```yaml
jwt:
  secret: ${JWT_SECRET:Hfj938fjd8fhdgn646bf8gbfrg56fdnj53hj7}
```

Para produção/code freeze, o ideal é não aceitar fallback sensível. O pipeline/ambiente deve exigir `JWT_SECRET`.

### 4. Tracking do frontend está confuso

O worktree `frontend-bi-integracao` está em `c7c2012`, mesmo commit de `origin/frontend-bi-integracao`, mas aparece como `ahead 5` porque rastreia `origin/frontend`.

Sugestão:

```powershell
git branch --set-upstream-to=origin/frontend-bi-integracao frontend-bi-integracao
```

Isso não altera código, apenas corrige o tracking local.

## Recomendação de integração

1. Publicar o commit de BI `a558061`.
2. Alinhar com Júlio se o backend vai recalcular score ou consumir score recalculado.
3. Corrigir `application-test.yml`/perfil de teste no backend antes do merge na `main`.
4. Remover fallback sensível de JWT ou exigir variável no ambiente de produção.
5. Validar CI/CD do backend em ambiente com JDK configurado.
6. Depois do merge backend + BI + frontend, rodar smoke:
   - `POST /match`
   - `POST /match/aprovar-candidato`
   - `GET /insights/regioes`
   - build frontend
   - validação BI.

