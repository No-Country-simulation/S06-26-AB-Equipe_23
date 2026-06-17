# Guia Power BI - Validacao Grafica das 24 Regioes

## Objetivo

Validar no Power BI se as 24 regioes da base agregada estao geograficamente coerentes e se a regra de cor por conectividade faz sentido para a tela de insights.

Este guia atende a demanda:

```text
Importar o output do script de insights para a ferramenta BI e plotar as coordenadas lat_media/lon_media.
```

## Arquivo para importar

```text
data/processed/insights_regioes_agregado.csv
```

## Configuracao dos campos no Power BI

Depois de importar o CSV, conferir os tipos:

| Campo | Tipo no Power BI | Categoria de dados |
|---|---|---|
| `municipio` | Texto | Nao categorizado |
| `cluster` | Texto | Nao categorizado |
| `qtd_antenas` | Numero inteiro | Nao categorizado |
| `lat_media` | Numero decimal | Latitude |
| `lon_media` | Numero decimal | Longitude |
| `total_sessoes_3g` | Numero inteiro | Nao categorizado |
| `total_sessoes_4g` | Numero inteiro | Nao categorizado |
| `total_sessoes_5g` | Numero inteiro | Nao categorizado |
| `total_sessoes` | Numero inteiro | Nao categorizado |
| `percentual_3g` | Numero decimal | Nao categorizado |
| `percentual_4g` | Numero decimal | Nao categorizado |
| `percentual_5g` | Numero decimal | Nao categorizado |
| `tecnologia_predominante_regiao` | Texto | Nao categorizado |
| `indicador_conectividade` | Texto | Nao categorizado |

## Visual recomendado

Usar visual de mapa do Power BI.

Campos:

| Campo do visual | Campo da base |
|---|---|
| Latitude | `lat_media` |
| Longitude | `lon_media` |
| Legenda | `indicador_conectividade` |
| Tamanho | `qtd_antenas` ou `total_sessoes` |
| Tooltips | `municipio`, `cluster`, `qtd_antenas`, `percentual_3g`, `percentual_4g`, `percentual_5g`, `tecnologia_predominante_regiao` |

## Cores sugeridas

| Indicador | Cor |
|---|---|
| `alta` | Verde |
| `media` | Amarelo/laranja |
| `baixa` | Vermelho |
| `alerta_exclusao_digital` | Vermelho escuro |
| `sem_dado` | Cinza |

Observacao:

A Alessandra citou o termo "regular". No dado atual, o valor equivalente documentado e `baixa`. No front, pode aparecer como label "Regular/Baixa", mas o valor tecnico permanece `baixa`.

## Filtros recomendados

Adicionar slicers para:

- `municipio`
- `indicador_conectividade`
- `tecnologia_predominante_regiao`
- `cluster`

## Medidas DAX opcionais

```DAX
Total Regioes = COUNTROWS(insights_regioes_agregado)
```

```DAX
Total Antenas = SUM(insights_regioes_agregado[qtd_antenas])
```

```DAX
Total Sessoes = SUM(insights_regioes_agregado[total_sessoes])
```

```DAX
Regioes com Alerta =
CALCULATE(
    COUNTROWS(insights_regioes_agregado),
    insights_regioes_agregado[indicador_conectividade] IN {"baixa", "alerta_exclusao_digital"}
)
```

## Resultado esperado com a base atual

Com o CSV atual:

- total de regioes: 24;
- municipios: Biguacu, Florianopolis, Palhoca e Sao Jose;
- todos os pontos ficam em Santa Catarina, na Grande Florianopolis;
- todas as regioes ficam classificadas como `alta`;
- por isso, o mapa deve aparecer todo em verde.

Esse resultado faz sentido com a regra atual, porque todos os clusters possuem:

- 4G acima de 60%;
- 5G acima de 20%;
- predominancia regional 4G.

## O que validar visualmente

Conferir no Power BI:

- se os pontos aparecem na Grande Florianopolis;
- se nenhum ponto ficou deslocado para outro estado/pais;
- se a concentracao dos pontos faz sentido por municipio;
- se a legenda mostra `alta`;
- se o tooltip exibe municipio, cluster e percentuais;
- se os filtros funcionam sem quebrar o mapa.

## Evidencia complementar

O arquivo abaixo e apenas uma previa local versionavel para conferencia rapida fora do Power BI:

```text
exports/validacao_mapa_regioes.html
```

A validacao oficial do projeto deve ser feita no Power BI usando o CSV indicado neste guia.
