# Status de integracao geral - 2026-06-30

## Escopo da verificacao

Verificacao feita cruzando as demandas registradas por Alessandra, as mensagens recentes do grupo e o estado atual das branches locais sincronizadas com o GitHub.

Branches consideradas:

- `origin/main`: `8e7970a`
- `origin/bi-dados-inicial`: `794fee0`
- `origin/feature/backend`: `7288db4`
- `origin/frontend-bi-integracao`: `fc694eb`

## Resultado geral

O projeto caminha bem em BI/Dados e Frontend, mas ainda nao esta fechado como entrega integrada. A principal pendencia continua no Backend: a branch recebeu novos commits e o Flyway ja passa pela execucao das migrations em H2, porem o build de testes ainda falha por configuracao de JWT.

A `main` ainda nao representa a integracao final. As tres frentes seguem em branches separadas, entao qualquer comunicacao para Alessandra deve deixar claro que existe entrega funcional por frente, mas falta consolidacao final em `main` com CI/CD verde.

## Validacoes executadas

### BI/Dados

Comando executado na branch `bi-dados-inicial`:

```powershell
python -m pytest tests/test_score_match.py tests/test_score_regression.py tests/test_anonymization.py -q
python scripts\valida_integracao_bi.py
```

Resultado:

- `7 passed`
- `OK: candidatos=8, privacidade preservada`
- `OK: antenas=132, regioes=24, sessoes e concentracao reconciliadas`
- `OK: metricas empresariais demonstrativas=1152, segmentos=8`
- `OK: artefatos artificiais de candidatos ausentes`

Conclusao: a entrega de Dados/BI esta coerente com a mensagem do Andre. O score esta documentado, testado contra os 8 candidatos e a shortlist inicial preserva anonimato.

### Frontend

Comando executado na branch `frontend-bi-integracao`:

```powershell
npm run build
```

Resultado:

- build concluido com sucesso;
- warning de performance do plugin, sem quebrar a compilacao.

Conclusao: a branch do frontend compila. O dashboard executivo ainda consome `POST /match` via `executarMatch()`, mas a nova tela de shortlist adicionada em `frontend/app/pages/Shortlist/shortlist.tsx` usa mock proprio com 6 candidatos e dados sensiveis no proprio componente. Isso precisa ser alinhado com o contrato oficial de BI/backend, que trabalha com os 8 candidatos oficiais e anonimiza contato na shortlist inicial.

Tambem nao foi encontrada implementacao real de iframe/token do Power BI. O que existe hoje e reserva de espaco e documentacao de suporte para quando o embed for implementado.

### Backend

Comando executado na branch `feature/backend`:

```powershell
$env:JAVA_HOME='C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd test
```

Resultado:

- Flyway validou e aplicou 4 migrations em H2;
- build falhou no teste `AppbitApplicationTests.contextLoads`;
- causa raiz: `Could not resolve placeholder 'jwt.secret' in value "${jwt.secret}"`.

Conclusao: o problema antigo de migration H2/MySQL melhorou, mas a demanda de "CI/CD build sem erros" ainda nao esta cumprida. O ajuste mais urgente e corrigir a propriedade JWT para que o teste carregue o contexto Spring.

## Pendencias por frente

### BI / Pedro

- Manter a trilha ja entregue: score, anonimização, Power BI, Turnover/ESG demonstrativo e storytelling.
- Apoiar o frontend para trocar mock proprio da shortlist pela fonte oficial ou pelo contrato `POST /match`.
- Apoiar o backend na validacao de impacto: o backend agora reimplementa o score em Java com pesos equivalentes, mas precisa receber o mesmo perfil de vaga usado no BI para evitar ranking divergente.
- Registrar no Redmine as alteracoes e validacoes quando o time consolidar a entrega.

### Frontend

- Substituir a shortlist mockada de `frontend/app/pages/Shortlist/shortlist.tsx` pelo contrato oficial.
- Garantir que a tela nao exponha nome, email e LinkedIn antes da aprovacao vinda do backend.
- Alinhar a rota de shortlist com os 8 candidatos oficiais do MVP.
- Implementar ou deixar explicitamente como fallback a incorporacao Power BI. Hoje ha reserva de espaco, mas nao ha iframe/token real implementado.
- Testar o fluxo frontend + backend quando o backend estiver com build verde.

### Backend

- Corrigir `jwt.secret` para o contexto de teste e CI/CD.
- Confirmar se o workflow do GitHub Actions injeta as mesmas variaveis esperadas pelo Spring.
- Revisar `backend/src/main/resources/application.yaml`: hoje ha defaults locais para MySQL e `ddl-auto: update`; para producao com Flyway, o mais seguro e exigir variaveis reais e usar validacao de schema.
- Corrigir o formato atual de `jwt.secret` no YAML principal, que aparece como `jwt.secret=...` dentro do valor da chave.
- Validar MySQL real com as variaveis `DB_HOST_APPBIT`, `DB_PORT_APPBIT`, `DB_NAME_APPBIT`, `DB_USER_APPBIT`, `DB_PASSWORD_APPBIT` e `JWT_SECRET`.
- Consolidar merge na `main` somente depois de testes verdes.
- Revisar log de `MatchingService`, pois o `log.debug` usa placeholders no estilo `{:.2f}`, que nao e formato valido do SLF4J.

## Pontos que Alessandra pode questionar

1. Se a entrega esta na `main`: ainda nao. As entregas estao em branches.
2. Se o CI/CD esta verde: ainda nao foi confirmado; localmente o backend falhou em teste por JWT.
3. Se o Power BI esta integrado por iframe: ainda nao. Existe suporte/documentacao e reserva visual, nao embed real.
4. Se a shortlist do frontend usa os 8 candidatos oficiais: ainda nao na nova tela de shortlist; ela usa mock proprio com 6 candidatos.
5. Se a privacidade esta garantida ponta a ponta: BI/Dados esta ok; frontend precisa alinhar a tela nova ao contrato oficial; backend tem endpoint de aprovacao e omite contato na triagem inicial, mas o build precisa passar.

## Leitura executiva

O trabalho de BI/Dados esta consistente e defensavel. O frontend compila, mas ainda precisa alinhar a nova tela de shortlist ao contrato oficial. O backend evoluiu bastante, principalmente em migrations e score em Java, mas nao pode ser considerado final enquanto `mvnw test` falhar por configuracao JWT e enquanto a `main` nao receber a integracao com pipeline verde.
