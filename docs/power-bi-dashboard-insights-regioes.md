# Power BI - Dashboard de Insights Regionais

## Objetivo

Montar uma pagina de Power BI para validar e apresentar a conectividade regional do App BiT, usando as 24 regioes agregadas do dataset Vísent/Anatel.

Essa pagina deve apoiar a Alessandra no front-end e responder a demanda de validar graficamente:

- coordenadas `lat_media` e `lon_media`;
- distribuicao geografica dos pontos;
- regra de cor por conectividade;
- filtros e interacoes da tela de insights.

## Base recomendada

Usar o arquivo preparado para Power BI:

```text
data/powerbi/insights_regioes_powerbi.csv
```

Esse arquivo ja traz labels, cores, faixas e recomendacoes para reduzir tratamento manual no Power BI.

## Conceito visual

Inspiracao: dashboard executivo de RH, com menu lateral, cards no topo e area central em blocos.

Tema sugerido:

| Elemento | Cor |
|---|---|
| Fundo geral | `#F8FAFC` |
| Sidebar | `#2D1B69` |
| Destaque/primaria | `#6D28D9` |
| Cards | `#FFFFFF` |
| Borda dos cards | `#E5E7EB` |
| Texto principal | `#111827` |
| Texto secundario | `#6B7280` |
| Alta | `#16A34A` |
| Media | `#F59E0B` |
| Regular/Baixa | `#EF4444` |
| Alerta | `#7F1D1D` |
| Sem dado | `#6B7280` |

## Estrutura da pagina

### Sidebar esquerda

Largura sugerida: 90 a 120 px.

Itens:

- App BiT / BI
- Match
- Dashboard RH
- Insights Regionais
- Conectividade

O item ativo deve ser `Insights Regionais`.

### Header

Titulo:

```text
Insights Regionais
```

Subtitulo:

```text
Conectividade Vísent/Anatel para apoio ao recrutamento remoto e hibrido
```

### Cards superiores

Criar 5 cards:

| Card | Medida/campo |
|---|---|
| Regioes mapeadas | `Total Regioes` |
| Municipios | `Total Municipios` |
| Antenas | `Total Antenas` |
| Sessoes totais | `Total Sessoes` |
| Regioes com alerta | `Regioes com Alerta` |

Com a base atual, esperado:

- Regioes mapeadas: 24
- Municipios: 4
- Regioes com alerta: 0

### Coluna de filtros

Usar slicers verticais ou cards de filtro.

Filtros recomendados:

| Filtro | Campo |
|---|---|
| Municipio | `municipio` |
| Cluster | `cluster` |
| Indicador | `indicador_label` |
| Tecnologia | `tecnologia_predominante_regiao` |
| Faixa de antenas | `faixa_antenas` |
| Faixa de sessoes | `faixa_sessoes` |
| Categoria 4G+5G | `categoria_4g_5g` |
| Possui alerta | `possui_alerta` |

### Mapa principal

Visual: mapa do Power BI.

Campos:

| Campo do visual | Campo da base |
|---|---|
| Latitude | `lat_media` |
| Longitude | `lon_media` |
| Legenda | `indicador_label` |
| Tamanho | `qtd_antenas` |
| Tooltips | `label_regiao`, `qtd_antenas`, `total_sessoes`, `percentual_3g`, `percentual_4g`, `percentual_5g`, `recomendacao_rh` |

Titulo:

```text
Mapa de conectividade por regiao
```

Observacao:

Com a base atual, todos os pontos devem aparecer como `Alta`, porque todos os clusters atendem a regra de conectividade validada.

### Grafico de barras - Ranking por sessoes

Visual: barras horizontais.

Campos:

| Campo do visual | Campo |
|---|---|
| Eixo Y | `label_regiao` |
| Eixo X | `total_sessoes` |
| Legenda opcional | `municipio` |

Ordenacao:

- Descendente por `total_sessoes`.

Titulo:

```text
Top regioes por volume de sessoes
```

### Grafico de composicao tecnologica

Visual: barras empilhadas ou 100% empilhadas.

Campos:

| Serie | Campo |
|---|---|
| 3G | `total_sessoes_3g` |
| 4G | `total_sessoes_4g` |
| 5G | `total_sessoes_5g` |

Eixo:

- `municipio` ou `label_regiao`.

Titulo:

```text
Composicao 3G, 4G e 5G
```

### Donut - Indicador de conectividade

Visual: rosca.

Campos:

| Campo do visual | Campo |
|---|---|
| Legenda | `indicador_label` |
| Valores | `Total Regioes` |

Titulo:

```text
Distribuicao dos indicadores
```

Com a base atual, a rosca ficara 100% em `Alta`.

### Tabela detalhada

Visual: tabela.

Campos:

- `municipio`
- `cluster`
- `indicador_label`
- `tecnologia_predominante_regiao`
- `qtd_antenas`
- `total_sessoes`
- `percentual_3g`
- `percentual_4g`
- `percentual_5g`
- `recomendacao_rh`

Titulo:

```text
Detalhamento regional
```

## Interacoes esperadas

- Clicar em um municipio filtra mapa, graficos e tabela.
- Clicar em uma barra do ranking destaca o ponto correspondente no mapa.
- Filtros de indicador devem afetar todos os visuais.
- Tooltip do mapa deve explicar a leitura regional sem sugerir eliminacao de candidato.

## Leitura analitica esperada

Com o arquivo atual:

- todas as 24 regioes ficam como `Alta`;
- o mapa deve mostrar pontos na Grande Florianopolis;
- nao deve aparecer ponto fora de Santa Catarina;
- a ausencia de regioes `Media`, `Regular/Baixa` ou `Alerta` e efeito da base atual, nao erro do painel;
- as categorias devem continuar configuradas para bases futuras.

## Criterios de aceite

O dashboard esta pronto para validacao se:

- importa `data/powerbi/insights_regioes_powerbi.csv`;
- reconhece `lat_media` como latitude e `lon_media` como longitude;
- mostra 24 pontos no mapa;
- permite filtrar por municipio, cluster, indicador, tecnologia, faixa de antenas e faixa de sessoes;
- mostra cards executivos no topo;
- mostra ranking de regioes por sessoes;
- mostra composicao 3G/4G/5G;
- mostra tabela detalhada;
- preserva a regra de que conectividade nao elimina candidato.
