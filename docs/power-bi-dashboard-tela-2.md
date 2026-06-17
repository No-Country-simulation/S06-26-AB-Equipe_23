# Power BI - Dashboard Tela 2

## Objetivo

Montar a pagina executiva do App BiT com indicadores de recrutamento, ESG/diversidade, shortlist e turnover estimado.

Essa pagina serve como referencia para a tela que a Alessandra vai estruturar no front-end.

## Bases recomendadas

```text
data/powerbi/dashboard_tela2_mvp.csv
data/powerbi/shortlist_candidatos_powerbi.csv
```

## Conceito visual

Usar o mesmo padrao da pagina de insights:

- sidebar roxa;
- cards executivos no topo;
- blocos arredondados;
- graficos com roxo como cor principal;
- alertas com verde, amarelo e vermelho;
- linguagem de RH executivo.

## Estrutura da pagina

### Header

Titulo:

```text
Dashboard RH - App BiT
```

Subtitulo:

```text
Visao executiva de shortlist, ESG e risco de turnover
```

### Cards superiores

| Card | Medida |
|---|---|
| Vagas abertas | `Total Vagas Abertas` |
| Candidatos analisados | `Total Candidatos Analisados` |
| Shortlist | `Total Shortlist` |
| Score medio | `Media Score Match` |
| Turnover estimado | `Turnover Estimado` |
| Meta ESG | `Texto Meta ESG` |

Com o mock atual, esperado:

- Candidatos analisados: 120
- Shortlist: 3
- Score medio: 87
- Meta ESG: atingida
- Turnover estimado: 18,5%

### Grafico - Score por candidato

Visual: barras horizontais.

Campos:

| Campo do visual | Campo |
|---|---|
| Eixo Y | `apelido_exibicao` |
| Eixo X | `score_match` |
| Tooltip | `nivel`, `regiao`, `skills`, `explicacao` |

Regra:

- Exibir apenas `Candidato 1`, `Candidato 2` etc.
- Nao exibir nome, email, telefone ou LinkedIn.

### Grafico - Shortlist por regiao

Visual: barras.

Campos:

| Campo do visual | Campo |
|---|---|
| Eixo X | `regiao` |
| Valores | contagem de `candidato_id` |

### Bloco ESG

Visual recomendado:

- barra de progresso ou gauge simples.

Campos:

| Indicador | Campo/medida |
|---|---|
| Percentual atual | `Percentual Shortlist Diversa` |
| Meta | `Meta Diversidade` |
| Status | `Texto Meta ESG` |

Mensagem esperada com mock atual:

```text
Meta ESG atingida: 66,7% da shortlist contempla perfis diversos, acima da meta de 40%.
```

### Bloco Turnover

Visual recomendado:

- card com percentual;
- gauge ou indicador de faixa;
- lista curta de fatores.

Campos:

| Campo | Uso |
|---|---|
| `turnover_estimado_percentual` | valor principal |
| `risco_turnover` | cor/faixa |
| `fator_turnover_1` | explicacao |
| `fator_turnover_2` | explicacao |
| `fator_turnover_3` | explicacao |

Regra de cor:

| Risco | Cor |
|---|---|
| baixo | Verde |
| medio | Amarelo/laranja |
| alto | Vermelho |

### Tabela de shortlist

Visual: tabela.

Campos:

- `apelido_exibicao`
- `status_identificacao`
- `cargo_alvo`
- `nivel`
- `regiao`
- `cluster_residencia`
- `score_match`
- `skills`
- `badge_diversidade`
- `explicacao`

## Filtros recomendados

| Filtro | Campo |
|---|---|
| Nivel | `nivel` |
| Regiao | `regiao` |
| Cargo alvo | `cargo_alvo` |
| Badge diversidade | `badge_diversidade` |
| Status identificacao | `status_identificacao` |

## O que nao entra nesta pagina

Nao incluir:

- mapa de antenas;
- lat/lon;
- sessoes 3G/4G/5G;
- indicador de conectividade regional como foco principal.

Esses itens pertencem a pagina de Insights Regionais.

## Criterios de aceite

A pagina esta pronta se:

- candidatos aparecem anonimizados;
- ESG aparece como meta de acompanhamento, nao como eliminacao;
- turnover aparece como indicador simulado;
- cards batem com o mock de `/match`;
- a pagina nao mistura mapa/conectividade com dashboard executivo;
- os campos podem ser replicados no front-end.
