# Entrega para André - Base de Conectividade e BI

## Objetivo

Este documento organiza a parte de dados que pode ser usada pelo André para continuar a frente de ETL, validação e cruzamento entre conectividade regional e candidatos fictícios.

A ideia não é refazer a base do zero. A base inicial já foi tratada e documentada. O próximo passo é validar, evoluir e transformar esses dados em insumos úteis para o backend, frontend e análise do produto.

## Arquivos principais

| Arquivo | Uso |
|---|---|
| `data/processed/antenas_sinal_tratadas.csv` | Base leve tratada com antenas, coordenadas e tecnologia predominante |
| `docs/dicionario-antenas-sinal.md` | Dicionário das colunas da base tratada |
| `docs/painel-conectividade-anatel.md` | Proposta de uso da base em mapa/painel de conectividade |
| `scripts/processa_dataset_visent_local.py` | Script usado para gerar a base tratada a partir do dataset Vísent/Anatel |
| `mocks/insights_conectividade_payload.json` | Exemplo de resposta para o endpoint de insights regionais |
| `mocks/candidatos_teste.json` | Massa ficticia de candidatos para testes de match e cruzamento regional |
| `data/processed/insights_regioes_agregado.csv` | Base agregada por municipio/cluster para `GET /insights/regioes` |
| `docs/contrato-api.md` | Contratos de API usados pelo backend/frontend |
| `docs/score-match.md` | Fórmula inicial do score match |
| `docs/separacao-metricas-dashboard.md` | Separacao entre dashboard inicial e insights regionais |
| `docs/base-agregada-insights-regioes.md` | Explicacao da base agregada regional |

## Base tratada

Arquivo:

```text
data/processed/antenas_sinal_tratadas.csv
```

Uso principal:

Esta e a base detalhada, no nivel de antena/celula. Deve ser usada pelo Andre para calcular distancia entre candidato e antenas proximas.

Campos principais:

- `ecgi`: identificador técnico da antena/célula;
- `cluster`: agrupamento regional do dataset;
- `municipio`: município associado;
- `lat`: latitude;
- `lon`: longitude;
- `sessoes_3g`: volume agregado de sessões 3G;
- `sessoes_4g`: volume agregado de sessões 4G;
- `sessoes_5g`: volume agregado de sessões 5G;
- `sessoes_outros`: sessões sem classificação 3G/4G/5G;
- `tecnologia_predominante`: tecnologia com maior volume de sessões no ponto.

## Como essa base entra no produto

A conectividade regional deve ser usada como insight de contexto, não como critério eliminatório.

Uso correto:

- mostrar cobertura regional;
- apoiar análise de vagas remotas, híbridas ou presenciais;
- enriquecer a leitura do recrutador;
- identificar regiões com maior ou menor infraestrutura de sinal;
- gerar indicadores agregados por município, cluster ou tecnologia.

Uso que deve ser evitado:

- eliminar candidato automaticamente por região;
- expor dado individual sensível;
- tratar conectividade como avaliação pessoal do candidato;
- confundir sinal móvel agregado com internet residencial contratada.

## Endpoint relacionado

Padrão alinhado com o time:

```text
GET /insights/regioes
```

Esse endpoint deve retornar uma visão regional pronta para consumo do frontend.

O mock inicial está em:

```text
mocks/insights_conectividade_payload.json
```

## Tarefas sugeridas para o André

1. Validar a estrutura da base `antenas_sinal_tratadas.csv`.
2. Conferir se as colunas estão coerentes com o dicionário de dados.
3. Verificar se latitude e longitude estão preenchidas e em faixa plausível.
4. Criar agregações por município, cluster e tecnologia predominante.
5. Avaliar se o payload de `insights_conectividade_payload.json` atende ao frontend.
6. Apoiar a evolução do ETL para cruzar candidatos fictícios com regiões.
7. Sugerir métricas regionais simples para o MVP.
8. Usar `mocks/candidatos_teste.json` como massa inicial para testar distancia ate antenas e regra de qualidade de rede.
9. Usar `data/processed/insights_regioes_agregado.csv` para validar a primeira versao de insights regionais.

## Alinhamento sobre as duas bases

| Base | Melhor uso |
|---|---|
| `data/processed/antenas_sinal_tratadas.csv` | Calculo de distancia ate antenas proximas, por conter latitude/longitude de cada antena/celula |
| `data/processed/insights_regioes_agregado.csv` | Dashboard, mapa resumido e retorno de `GET /insights/regioes`, por estar agregada por municipio/cluster |

## Sugestão de agregações

### Por município

- quantidade de antenas;
- total de sessões 3G;
- total de sessões 4G;
- total de sessões 5G;
- tecnologia predominante do município.

### Por cluster

- quantidade de municípios;
- quantidade de antenas;
- participação percentual de 3G, 4G e 5G;
- cluster com maior concentração de sinal.

### Para o mapa

- latitude;
- longitude;
- tecnologia predominante;
- total de sessões;
- município;
- cluster.

## Relação com o score match

No score, conectividade deve entrar como fator explicativo ou de apoio à decisão.

Exemplo:

- candidato com maior aderência técnica continua bem posicionado;
- conectividade regional pode aparecer como alerta ou contexto;
- o recrutador entende se aquela região tem melhor suporte para trabalho remoto/híbrido;
- o sistema evita transformar localização em barreira automática.

## Critério de aceite

Essa parte estará pronta para integração quando:

- a base tratada estiver validada;
- o dicionário estiver claro;
- o mock estiver compatível com o backend/frontend;
- as agregações principais estiverem definidas;
- o time entender que conectividade é insight, não eliminação.

## Próximo passo

Depois da validação do André, o ideal é gerar uma segunda versão da base com dados agregados:

```text
data/processed/insights_regioes_agregado.csv
```

Essa base agregada pode servir diretamente para o endpoint:

```text
GET /insights/regioes
```

