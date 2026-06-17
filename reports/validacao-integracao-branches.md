# Validacao de Integracao entre BI, Front, Backend e Dados

## Objetivo

Registrar a checagem cruzada da branch `bi-dados-inicial` com as frentes de front-end, backend e dados, sem alterar arquivos de outros integrantes.

## Escopo validado

- Branch BI local: `bi-dados-inicial`
- Front remoto: `origin/frontend`
- Backend remoto: `origin/feature/backend`
- Contratos BI: `docs/contrato-api.md`
- Bases Power BI: `data/powerbi/*.csv`
- Bases de conectividade para Andre: `data/processed/*.csv`

## O que esta alinhado

### BI e contrato do produto

- Rotas documentadas continuam:
  - `POST /match`
  - `GET /insights/regioes`
- Candidatos seguem anonimizados na primeira resposta:
  - `apelido_exibicao`
  - `status_identificacao`
- Nome e contato ficam fora da shortlist inicial.
- Turnover e ESG ficam no dashboard executivo.
- Antenas, mapa e conectividade ficam em Insights Regionais.
- Conectividade e diversidade seguem como contexto, nao eliminacao.

### BI e Power BI

- `data/powerbi/insights_regioes_powerbi.csv` tem 24 regioes.
- `data/powerbi/dashboard_tela2_mvp.csv` tem o resumo executivo da Tela 2.
- `data/powerbi/shortlist_candidatos_powerbi.csv` tem candidatos anonimizados.
- `data/powerbi/candidatos_powerbi.csv` tem 200 candidatos anonimizados para Power BI, filtros e cruzamentos regionais.
- Scripts de geracao foram executados localmente.
- Scripts compilaram com `py_compile`.

### BI e frente do Andre

- `data/processed/antenas_sinal_tratadas.csv` segue como base detalhada para calculo de distancia ate antenas.
- `data/processed/insights_regioes_agregado.csv` segue como base agregada para mapa e `GET /insights/regioes`.
- `data/powerbi/candidatos_powerbi.csv` fica disponivel como massa ampliada de candidatos anonimizados para testes e validacao de cruzamentos, sem exigir mudanca no codigo do Andre.
- `scripts/avalie_candidato_conectividade.py` usa a base detalhada, adequada para cruzamento candidato-antena.
- `scripts/gera_insights_regioes.py` usa regra 4G+5G e ignora coordenadas invalidas no calculo da media.

## Divergencias encontradas

### Backend ainda usa `/api/v1`

No backend remoto:

- `POST /api/v1/match`
- `GET /api/v1/insights/regioes`

Contrato validado pelo grupo:

- `POST /match`
- `GET /insights/regioes`

Risco:

- front consumir rota simples e backend responder apenas rota versionada.

Acao recomendada:

- backend ajustar `@RequestMapping` ou alinhar proxy/base path antes de integracao.

### Backend retorna poucos dados de mock

No backend remoto:

- `MatchingService` retorna 2 candidatos.
- `InsightService` retorna 2 regioes.

Na entrega BI:

- `mocks/match_payload.json` retorna 200 candidatos anonimizados.
- `data/processed/insights_regioes_agregado.csv` tem 24 regioes.
- `data/powerbi/insights_regioes_powerbi.csv` tem 24 regioes.

Risco:

- Power BI/front validarem 24 regioes, mas endpoint backend entregar apenas 2 regioes.

Acao recomendada:

- backend usar mock/base agregada atual ou deixar claro que o endpoint ainda esta parcial.

### Backend tende a serializar em camelCase

DTOs do backend remoto usam nomes Java como:

- `vagaId`
- `totalAnalisados`
- `totalRetorno`
- `metricaDiversidade`
- `apelidoExibicao`
- `statusIdentificacao`

Mocks/contrato BI usam:

- `vaga_id`
- `total_analisados`
- `total_retorno`
- `metrica_diversidade`
- `apelido_exibicao`
- `status_identificacao`

Risco:

- front implementar pelo mock em snake_case e quebrar ao consumir backend em camelCase.

Acao recomendada:

- decidir padrao unico antes da integracao.
- opcoes:
  - configurar Jackson para `SNAKE_CASE`;
  - adicionar `@JsonProperty` nos DTOs;
  - ajustar mocks/docs para camelCase.

Recomendacao BI:

- manter `snake_case`, pois ja esta nos mocks e documentos atuais.

### Front ainda nao consome os contratos BI

No front remoto:

- tela atual esta focada em vagas/empregabilidade;
- usa `vagasMock.ts`;
- nao consome `POST /match`;
- nao consome `GET /insights/regioes`;
- nao implementa ainda tela de Insights Regionais com mapa/filtros.

Risco:

- a Alessandra precisar montar as telas ainda usando as especificacoes BI.

Acao recomendada:

- usar:
  - `docs/especificacao-front-insights-regioes.md`
  - `docs/especificacao-dashboard-tela-2.md`
  - `docs/entrega-bi-powerbi-front-alessandra.md`

### Front ainda tem risco de build

No front remoto:

- `tsconfig.app.json` inclui apenas `src`;
- codigo real esta em `frontend`;
- `main.tsx` renderiza direto `Home/App.tsx`;
- router existe, mas nao parece conectado no `main.tsx`;
- `axios` esta em `devDependencies`, nao em `dependencies`.

Risco:

- build e integracao podem falhar antes mesmo de consumir BI/backend.

Acao recomendada:

- corrigir configuracao do front antes de integrar contratos.

## Riscos para o Andre

O Andre pode encontrar divergencia se:

- usar a base agregada para calculo de distancia fina ate antena;
- usar apenas o payload antigo `mocks/insights_conectividade_payload.json`, que tem poucos pontos;
- comparar score binario antigo com o score hibrido atual.

Orientacao correta:

- distancia candidato-antena: usar `data/processed/antenas_sinal_tratadas.csv`;
- mapa regional/Power BI: usar `data/processed/insights_regioes_agregado.csv` ou `data/powerbi/insights_regioes_powerbi.csv`;
- score de conectividade local: usar `scripts/avalie_candidato_conectividade.py`.

## Conclusao

A entrega BI esta consistente internamente e pronta para validacao local/Power BI.

Ainda nao esta garantida a integracao ponta a ponta com front e backend porque as branches remotas possuem divergencias de:

- rota;
- quantidade de dados mockados;
- padrao de nomes JSON;
- configuracao de build do front;
- consumo real dos endpoints.

Antes de subir para `main`, essas divergencias precisam ser alinhadas pelo grupo.
