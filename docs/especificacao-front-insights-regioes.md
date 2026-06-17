# Especificacao Front-end - Tela de Insights Regionais

## Objetivo da tela

Permitir que o usuario visualize a distribuicao regional de conectividade e infraestrutura digital para apoiar decisoes de recrutamento remoto ou hibrido.

Esta tela consome o endpoint:

```text
GET /insights/regioes
```

## Fonte de dados para o MVP

Arquivo de referencia:

```text
data/processed/insights_regioes_agregado.csv
```

Campos principais:

| Campo | Uso no front |
|---|---|
| `municipio` | Filtro, agrupamento e informacao do card |
| `cluster` | Nome da regiao exibida no mapa |
| `qtd_antenas` | Card de detalhe e tooltip |
| `lat_media` | Latitude do marcador no mapa |
| `lon_media` | Longitude do marcador no mapa |
| `total_sessoes` | Intensidade geral de uso |
| `percentual_3g` | Grafico/tooltip de composicao tecnologica |
| `percentual_4g` | Grafico/tooltip de composicao tecnologica |
| `percentual_5g` | Grafico/tooltip de composicao tecnologica |
| `tecnologia_predominante_regiao` | Badge principal do card |
| `indicador_conectividade` | Cor do marcador e filtro principal |

## Estrutura visual sugerida

Tela dividida em 3 areas:

1. Barra superior de filtros.
2. Mapa com marcadores por regiao.
3. Painel lateral de detalhe da regiao selecionada.

## Filtros

| Filtro | Campo base | Tipo de controle | Opcoes |
|---|---|---|---|
| Municipio | `municipio` | Select ou checkbox | Biguacu, Florianopolis, Palhoca, Sao Jose |
| Indicador de conectividade | `indicador_conectividade` | Segmented control ou checkbox | alta, media, baixa, alerta_exclusao_digital, sem_dado |
| Tecnologia predominante | `tecnologia_predominante_regiao` | Select ou checkbox | 3G, 4G, 5G, SEM_DADO |
| Cluster | `cluster` | Busca textual ou select | Lista de clusters da base |

Comportamento esperado:

- Ao alterar filtros, o mapa deve exibir apenas os pontos correspondentes.
- Se nenhum ponto for encontrado, exibir estado vazio simples: "Nenhuma regiao encontrada para os filtros selecionados".
- O botao de limpar filtros deve voltar para todos os pontos.

## Regra de cores do mapa

| Indicador | Cor sugerida | Uso |
|---|---|---|
| `alta` | Verde | Regiao com boa conectividade regional |
| `media` | Amarelo/laranja | Regiao funcional, mas com atencao |
| `baixa` | Vermelho | Regiao com conectividade limitada |
| `alerta_exclusao_digital` | Vermelho escuro | Risco critico de barreira digital |
| `sem_dado` | Cinza | Sem informacao suficiente |

Mapeamento de label para a interface:

| Valor no dado | Label sugerida no front |
|---|---|
| `alta` | Alta |
| `media` | Media |
| `baixa` | Regular/Baixa |
| `alerta_exclusao_digital` | Alerta |
| `sem_dado` | Sem dado |

Observacao para o estado atual da base:

No arquivo atual, as 24 regioes estao classificadas como `alta`. Isso e consequencia da regra validada de considerar `4G + 5G`, nao erro de exibicao. Mesmo assim, o front deve manter a legenda completa para bases futuras.

## Marcador do mapa

Cada linha do CSV deve virar um marcador.

Coordenadas:

```text
lat = lat_media
lon = lon_media
```

Tooltip ao passar o mouse:

- Municipio.
- Cluster.
- Indicador de conectividade.
- Tecnologia predominante.
- Percentual 3G.
- Percentual 4G.
- Percentual 5G.

Exemplo:

```text
Florianopolis - TRINDADE
Indicador: alta
Tecnologia predominante: 4G
3G: 17.13% | 4G: 60.27% | 5G: 22.60%
```

## Clique no marcador

Ao clicar em um marcador, abrir ou atualizar o painel lateral com:

- Municipio.
- Cluster.
- Indicador de conectividade.
- Tecnologia predominante.
- Quantidade de antenas.
- Total de sessoes.
- Percentual 3G, 4G e 5G.
- Recomendacao para RH.

Regra da recomendacao:

| Indicador | Texto sugerido |
|---|---|
| `alta` | "Regiao com conectividade adequada para apoiar trabalho remoto ou hibrido." |
| `media` | "Regiao funcional, mas pode exigir acompanhamento de infraestrutura." |
| `baixa` | "Regiao com conectividade limitada. Avaliar necessidade de apoio operacional." |
| `alerta_exclusao_digital` | "Regiao com risco de barreira digital. Nao eliminar candidato, mas prever apoio." |
| `sem_dado` | "Sem dados suficientes para avaliar conectividade regional." |

## Cards de resumo da tela

Cards sugeridos acima do mapa:

| Card | Calculo |
|---|---|
| Regioes mapeadas | Total de linhas da base |
| Municipios mapeados | Contagem distinta de `municipio` |
| Total de antenas | Soma de `qtd_antenas` |
| Tecnologia predominante geral | Tecnologia com maior volume agregado |
| Regioes com alerta | Contagem de `alerta_exclusao_digital` + `baixa` |

## Estado atual validado

Com a base atual:

- 24 regioes mapeadas.
- 4 municipios.
- Todas as regioes aparecem como `alta`.
- O mapa deve mostrar todos os pontos em verde.
- A diferenca visual principal sera geografica, nao por cor.

## Artefatos de validacao local

- Guia oficial Power BI: `docs/guia-power-bi-validacao-regioes.md`
- Relatorio: `reports/validacao-mapa-regioes.md`
- HTML local complementar: `exports/validacao_mapa_regioes.html`

O Power BI e a ferramenta principal para a validacao grafica. O HTML e apenas uma previa versionavel para conferencia rapida do repositório.

## Cuidados de produto

- Conectividade nao deve eliminar candidato automaticamente.
- O mapa e um apoio para contexto regional.
- A tela deve evitar linguagem punitiva contra regioes ou candidatos.
- O texto deve reforcar "necessidade de apoio" e nao "desclassificacao".
