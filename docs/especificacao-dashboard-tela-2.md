# Especificacao Front-end - Dashboard Tela 2

## Objetivo da tela

Dar uma visao executiva do funil de recrutamento, metas ESG/diversidade e risco de turnover.

Esta tela nao e a tela de conectividade. Dados de antenas, mapa e infraestrutura digital ficam na tela de insights regionais e no endpoint:

```text
GET /insights/regioes
```

## Origem dos dados no MVP

Como o backend ainda esta em fase de mock, a Tela 2 pode ser alimentada por dados simulados derivados de:

- `mocks/match_payload.json`
- `mocks/candidatos_teste.json`
- `data/powerbi/candidatos_powerbi.csv`, quando a tela/Power BI precisar de volume visual com 200 candidatos anonimizados
- regras documentadas em `docs/separacao-metricas-dashboard.md`

Quando o backend estiver pronto, os dados devem vir principalmente de:

```text
POST /match
```

## Layout sugerido

Estrutura da tela:

1. Cards executivos no topo.
2. Grafico de funil/shortlist.
3. Bloco ESG/diversidade.
4. Bloco de turnover estimado.
5. Tabela resumida de candidatos anonimizados.

## Cards principais

| Card | Campo sugerido | Calculo no MVP |
|---|---|---|
| Vagas abertas | `total_vagas_abertas` | Mock fixo ou total de vagas criadas no front |
| Candidatos analisados | `total_analisados` | Campo de `mocks/match_payload.json` |
| Shortlist | `total_retorno` | Campo de `mocks/match_payload.json` |
| Score medio | `media_score_match` | Media de `score_match` dos candidatos |
| Meta ESG | `meta_atingida` | Campo `metrica_diversidade.meta_atingida` |
| Shortlist diversa | `percentual_shortlist_diversa` | Campo `metrica_diversidade.percentual_shortlist_diversa` |

Exemplo com o mock atual:

```text
Candidatos analisados: 120
Shortlist: 3
Shortlist diversa: 66,7%
Meta ESG: atingida
Score medio: 87
```

Observacao:

O numero de 120 candidatos analisados vem do mock de retorno do `/match`. A massa de 200 candidatos em `data/powerbi/candidatos_powerbi.csv` e uma base sintetica complementar para filtros, graficos e validacao visual no Power BI/front. Ela nao muda a regra do endpoint `/match`, que continua retornando uma shortlist filtrada e anonimizada.

## Bloco ESG e diversidade

Objetivo:

Mostrar se a shortlist esta alinhada a meta minima de diversidade sem transformar diversidade em criterio eliminatorio.

Componentes sugeridos:

- Card de meta ESG atingida ou nao.
- Barra de progresso comparando percentual atual vs meta.
- Lista de badges de diversidade presentes na shortlist.

Campos:

| Campo | Origem |
|---|---|
| `percentual_shortlist_diversa` | `metrica_diversidade.percentual_shortlist_diversa` |
| `meta_diversidade` | `metrica_diversidade.meta_diversidade` |
| `meta_atingida` | `metrica_diversidade.meta_atingida` |
| `badge_diversidade` | Lista de candidatos retornados |

Texto recomendado:

```text
Meta ESG atingida: 66,7% da shortlist contempla perfis diversos, acima da meta de 40%.
```

## Bloco turnover

Objetivo:

Exibir risco operacional estimado da vaga ou do processo seletivo. Para o MVP, esse dado pode ser simulado.

Campos sugeridos:

| Campo | Tipo | Exemplo | Observacao |
|---|---|---|---|
| `turnover_estimado_percentual` | number | 18.5 | Indicador simulado |
| `risco_turnover` | string | medio | baixo, medio ou alto |
| `fatores_turnover` | array | ["modelo hibrido", "nivel junior"] | Explicacao curta |

Regra visual sugerida:

| Risco | Cor | Condicao |
|---|---|---|
| baixo | Verde | menor que 15% |
| medio | Amarelo/laranja | 15% a 25% |
| alto | Vermelho | maior que 25% |

Texto recomendado:

```text
Turnover estimado medio. Acompanhar aderencia entre nivel da vaga, modelo de trabalho e expectativas do candidato.
```

## Graficos sugeridos

| Grafico | Tipo | Dados |
|---|---|---|
| Funil de candidatos | Barras horizontais | analisados, retornados, aprovados |
| Score dos candidatos | Barras | `apelido_exibicao` x `score_match` |
| ESG/diversidade | Barra de progresso ou donut | percentual atual x meta |
| Turnover | Gauge simples ou card com faixa | percentual estimado e risco |

## Tabela de candidatos anonimizados

Campos para exibir:

| Campo | Observacao |
|---|---|
| `apelido_exibicao` | Exibir Candidato 1, Candidato 2 etc. |
| `status_identificacao` | Deve permanecer `anonimizado` antes da aprovacao |
| `nivel` | Nivel profissional |
| `regiao` | Municipio/regiao |
| `score_match` | Score principal |
| `skills` | Chips/tags |
| `badge_diversidade` | Badge explicativo |
| `explicacao` | Texto curto do match |

Regra de privacidade:

- Nao exibir nome real na tela inicial.
- Nao exibir email, telefone ou LinkedIn antes da aprovacao.
- Nome e contato so entram em fluxo futuro, apos aprovacao.

## O que nao entra nesta tela

Nao misturar nesta tela:

- mapa de antenas;
- `lat_media`;
- `lon_media`;
- sessoes 3G/4G/5G;
- `indicador_conectividade`;
- clusters de antenas como foco principal.

Esses dados pertencem a tela de insights regionais.

## Mock minimo sugerido para front

```json
{
  "dashboard": {
    "total_vagas_abertas": 4,
    "total_candidatos_analisados": 120,
    "total_shortlist": 3,
    "media_score_match": 87,
    "metrica_diversidade": {
      "percentual_shortlist_diversa": 66.7,
      "meta_diversidade": 40,
      "meta_atingida": true
    },
    "turnover": {
      "turnover_estimado_percentual": 18.5,
      "risco_turnover": "medio",
      "fatores_turnover": ["modelo hibrido", "nivel junior", "mercado competitivo"]
    }
  }
}
```

## Criterio de aceite

A Tela 2 esta coerente se:

- exibe cards executivos de recrutamento;
- mostra ESG sem usar diversidade como eliminacao;
- mostra turnover como indicador simulado do MVP;
- mantem candidatos anonimizados;
- nao mistura mapa/conectividade com dashboard executivo;
- consegue ser alimentada pelos mocks atuais enquanto o backend nao fecha.
