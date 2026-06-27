# Suporte BI ao merge do Backend na `main`

## Objetivo

Apoiar o merge do backend sem quebrar histórico de migrations, contrato de BI/Dados e validação de privacidade da shortlist.

## Pontos que BI precisa conferir antes do merge

### 1. Histórico de migrations

- Não renumerar migrations já existentes.
- Não editar migration já aplicada em outra branch sem alinhamento com o backend.
- Novas alterações de banco devem entrar em nova migration sequencial.
- Confirmar que a branch final preserva os arquivos `V__` existentes de `database/` e `backend/src/main/resources/db/migration/`, quando aplicável.

### 2. H2, Flyway e testes

- `application-test.yml` deve permitir teste local/CI sem depender do MySQL real.
- Se H2 estiver ativo, usar `ddl-auto=create-drop` ou isolar Flyway no perfil de teste.
- O CI deve conseguir executar build/test sem exigir variáveis de produção.

### 3. Produção MySQL

- Produção deve continuar usando Flyway e variáveis de ambiente, como `DB_HOST_APPBIT`, `DB_PORT_APPBIT`, `DB_NAME_APPBIT`, `DB_USER_APPBIT` e `DB_PASSWORD_APPBIT`.
- Não hardcodar host, usuário, senha ou segredo JWT nos arquivos versionados.
- Validar que o schema final contempla shortlist, score e aprovação de candidato sem expor contato indevido.

### 4. Contrato `/match`

O backend deve manter compatibilidade com:

- `fonte_candidatos`
- `total_analisados`
- `total_retorno`
- `regra_privacidade`
- `candidatos[]`
- `candidato_id`
- `apelido_exibicao`
- `status_identificacao`
- `nivel`
- `regiao`
- `skills`
- `score_match`

O retorno inicial de `/match` não deve conter:

- `nome`
- `email`
- `telefone`
- `linkedin`
- `contato_pos_aprovacao`

### 5. Alinhamento com Dados

- O backend precisa decidir se consome `score_match` já calculado no payload/CSV ou se reimplementa a mesma regra do `scripts/score_match.py`.
- Se recalcular no backend, documentar equivalência de pesos: skills 50%, experiência 25%, modelo de trabalho 15%, diversidade 10%.
- Se apenas consumir valor calculado, garantir que não ordena usando score antigo do mock.

## Checklist rápido para Júlio

- Build local passa.
- Pipeline CI/CD passa.
- Migrations rodam em MySQL.
- Testes não dependem de banco de produção.
- JWT sem segredo sensível hardcoded.
- `/match` preserva anonimização.
- Logs com `@Slf4j` não imprimem dados pessoais nem tokens.

## Evidência de BI disponível

- `docs/impacto-score-match-no-bi.md`
- `docs/score-match.md`
- `docs/contrato-api.md`
- `docs/fluxo-aprovacao-candidato.md`
- `data/powerbi/shortlist_candidatos_powerbi.csv`
- `mocks/match_payload.json`

