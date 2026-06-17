# Revisao Front + BI - Integracao com Contexto Geral

## Objetivo

Preparar o front para a Alessandra assumir a frente com menos risco de divergencia com BI e backend.

Esta revisao foi feita sem alterar backend e sem mexer na `main`.

## O que foi ajustado no front

- `tsconfig.app.json` agora valida a pasta real `frontend`.
- `npm run build` passou localmente.
- `axios` foi movido para `dependencies`.
- `frontend/lib/axios.ts` ganhou fallback para `http://localhost:8080`.
- `frontend/app/main.tsx` passou a usar o router.
- Router ganhou rotas base:
  - `/`
  - `/dashboard`
  - `/insights/regioes`
- Login corrigido para usar `email` no state e no input.
- `JobPostForm` deixou de ser copia comentada de login.
- Imports TypeScript foram ajustados para `type-only` onde necessario.

## O que foi adicionado para casar com BI

### Contratos TypeScript

Arquivo:

```text
frontend/lib/appbitTypes.ts
```

Inclui tipos para:

- `POST /match`
- candidatos anonimizados;
- metrica de diversidade;
- `GET /insights/regioes`;
- regioes com conectividade.

### Services com fallback mockado

Arquivo:

```text
frontend/lib/appbitApi.ts
```

Funcoes:

- `executarMatch()`
- `buscarInsightsRegioes()`

Enquanto o backend nao estiver pronto, o front usa fallback mockado local.

### Mocks alinhados com BI

Arquivo:

```text
frontend/lib/appbitMocks.ts
```

Inclui:

- 3 candidatos anonimizados;
- 24 regioes;
- indicadores de conectividade;
- percentuais 3G/4G/5G;
- recomendacao RH.

## Telas adicionadas

### Dashboard Executivo

Arquivo:

```text
frontend/components/charts/DashboardExecutivo.tsx
```

Contem:

- vagas abertas;
- candidatos analisados;
- shortlist;
- score medio;
- turnover estimado;
- meta ESG;
- grafico simples de score por candidato;
- shortlist anonima.

### Insights Regionais

Arquivo:

```text
frontend/components/charts/PainelInsightsRegionais.tsx
```

Contem:

- mapa visual simplificado por coordenadas;
- cards de regioes, municipios, antenas, sessoes e alertas;
- filtros por municipio, indicador, tecnologia e cluster;
- ranking por sessoes;
- tabela detalhada.

## Como isso casa com a demanda da Alessandra

### Pedido: validar 24 regioes

Atendido no BI/Power BI e refletido no front por `PainelInsightsRegionais`.

### Pedido: filtros e interacoes da tela de insights

Atendido no front com:

- municipio;
- indicador;
- tecnologia;
- cluster;
- limpar filtros.

### Pedido: Tela 2 com Turnover e ESG

Atendido no front com `DashboardExecutivo`.

## O que ainda depende do backend

Para a integracao real, o backend precisa:

- remover `/api/v1` ou alinhar proxy/base path;
- expor `POST /match`;
- expor `GET /insights/regioes`;
- retornar JSON no mesmo padrao usado no contrato do front;
- retornar 24 regioes ou explicar que o endpoint ainda e parcial;
- manter candidatos anonimizados no retorno inicial;
- liberar contato apenas em rota especifica apos aprovacao.

## Divergencias antecipadas

### Padrao de JSON

Front/BI estao em `snake_case`:

- `vaga_id`
- `total_analisados`
- `apelido_exibicao`

Backend atual tende a devolver `camelCase`:

- `vagaId`
- `totalAnalisados`
- `apelidoExibicao`

Isso precisa ser resolvido antes da integracao.

### Quantidade de dados

Front/BI esperam:

- 3 candidatos no mock de match;
- 24 regioes em insights.

Backend atual retorna:

- 2 candidatos;
- 2 regioes.

## Validacao local

Comando executado:

```text
npm run build
```

Resultado:

```text
Build concluido com sucesso.
```
