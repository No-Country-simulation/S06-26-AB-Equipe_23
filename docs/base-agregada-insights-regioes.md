# Base Agregada - Insights de Regioes

## Objetivo

Disponibilizar uma base resumida para o endpoint:

```text
GET /insights/regioes
```

A base agregada evita que backend e frontend precisem calcular tudo a partir das antenas individuais. Ela resume a conectividade por municipio e cluster.

## Arquivos

Entrada:

```text
data/processed/antenas_sinal_tratadas.csv
```

Saida:

```text
data/processed/insights_regioes_agregado.csv
```

Script:

```text
scripts/gera_insights_regioes.py
```

## Campos da base agregada

| Campo | Descricao |
|---|---|
| `municipio` | Municipio analisado |
| `cluster` | Agrupamento regional do dataset |
| `qtd_antenas` | Quantidade de antenas/celulas no municipio/cluster |
| `lat_media` | Latitude media do grupo, usada para mapa |
| `lon_media` | Longitude media do grupo, usada para mapa |
| `total_sessoes_3g` | Soma das sessoes 3G |
| `total_sessoes_4g` | Soma das sessoes 4G |
| `total_sessoes_5g` | Soma das sessoes 5G |
| `total_sessoes_outros` | Soma das sessoes sem classificacao principal |
| `total_sessoes` | Soma total de sessoes |
| `percentual_3g` | Participacao percentual do 3G |
| `percentual_4g` | Participacao percentual do 4G |
| `percentual_5g` | Participacao percentual do 5G |
| `tecnologia_predominante_regiao` | Tecnologia com maior volume na regiao |
| `indicador_conectividade` | Classificacao simples: alta, media, baixa, sem_dado ou alerta_exclusao_digital |

## Regra inicial de conectividade

| Condicao | Indicador |
|---|---|
| 5G >= 20% ou 4G + 5G >= 75% com 4G >= 50% | `alta` |
| 4G + 5G >= 60% | `media` |
| 3G >= 50% e 4G + 5G < 50% | `alerta_exclusao_digital` |
| Sem sessoes | `sem_dado` |
| Demais casos | `baixa` |

Para evitar classificar como baixa uma regiao com conectividade util relevante, a regra considera 4G e 5G em conjunto nas faixas de `alta` e `media`.

As coordenadas medias (`lat_media` e `lon_media`) devem ser calculadas apenas com registros que tenham latitude e longitude validas. Linhas sem coordenadas ou com valores corrompidos nao devem entrar na divisao da media.

## Uso para o Andre

O Andre pode usar esta base para:

- validar a regra de qualidade da rede;
- cruzar candidatos ficticios com clusters;
- criar alertas de exclusao digital;
- evoluir a funcao de score regional.

Para calculo de distancia ate antenas proximas, a base correta e a detalhada:

```text
data/processed/antenas_sinal_tratadas.csv
```

A base agregada deve ser usada para a visao regional, dashboard e retorno de `GET /insights/regioes`.

## Uso para backend e frontend

Backend:

- pode usar o CSV agregado como base do mock de `GET /insights/regioes`;
- pode transformar cada linha em um ponto/regiao no JSON.

Frontend:

- pode usar `lat_media` e `lon_media` para posicionar pontos no mapa;
- pode usar `indicador_conectividade` para cor do marcador;
- pode usar `percentual_3g`, `percentual_4g` e `percentual_5g` em tooltip ou card.

## Cuidado de interpretacao

Esta base nao deve eliminar candidato automaticamente. O indicador de conectividade serve como contexto regional e pode apontar necessidade de apoio operacional, especialmente em cenarios remoto/hibrido.
