# Dicionario de Dados - Antenas e Sinal

Arquivo base: `data/processed/antenas_sinal_tratadas.csv`

Objetivo: disponibilizar uma base leve para o painel de conectividade Anatel/Vísent, permitindo que backend e frontend exibam mapa, graficos por regiao e leitura de tecnologia predominante.

## Campos

| Campo | Tipo sugerido | Descricao | Uso no produto |
|---|---|---|---|
| `ecgi` | string | Identificador tecnico da antena/celula. | Chave do ponto no mapa e referencia tecnica. |
| `cluster` | string | Agrupamento regional do dataset. | Filtro por regiao ou area operacional. |
| `municipio` | string | Municipio associado ao ponto. | Filtro e agregacao regional. |
| `lat` | decimal | Latitude da antena. | Posicionamento no mapa. |
| `lon` | decimal | Longitude da antena. | Posicionamento no mapa. |
| `sessoes_3g` | integer | Quantidade agregada de sessoes em tecnologia 3G. | Indicador de uso legado/conectividade basica. |
| `sessoes_4g` | integer | Quantidade agregada de sessoes em tecnologia 4G. | Indicador principal de cobertura movel atual. |
| `sessoes_5g` | integer | Quantidade agregada de sessoes em tecnologia 5G. | Indicador de conectividade avancada. |
| `sessoes_outros` | integer | Sessoes sem classificacao 3G/4G/5G. | Controle tecnico e qualidade de dado. |
| `tecnologia_predominante` | string | Tecnologia com maior volume de sessoes na antena. | Icone/cor principal do marcador no mapa. |

## Regra de tecnologia

O campo `tecnologia_predominante` vem do maior valor entre:

- `sessoes_3g`
- `sessoes_4g`
- `sessoes_5g`
- `sessoes_outros`

Mapeamento usado no tratamento:

| `rat_type` original | Tecnologia tratada |
|---|---|
| `WCDMA` | `3G` |
| `LTE` | `4G` |
| `NR` | `5G` |

## Regra de Qualidade do Sinal (Regiões)

Para o painel regional de conectividade, a qualidade do sinal/conectividade é categorizada como:

- `muito_alta`: predominância de tecnologia `5G`.
- `alta`: predominância de tecnologia `4G` e volume total de sessões regional de pelo menos `2.000.000` (alto volume observado).
- `media`: predominância de tecnologia `4G` e volume total de sessões menor que `2.000.000`.
- `baixa`: predominância de tecnologia `3G`.
- `sem_dado`: outros casos ou regiões sem sessões observadas.

Esse mapeamento é exportado nos campos `qualidade_sinal` e `indicador_conectividade`.

## Uso recomendado no mapa

- Marcador azul: predominancia `3G`.
- Marcador verde: predominancia `4G`.
- Marcador roxo: predominancia `5G`.
- Tamanho do marcador: total de sessoes.
- Tooltip: municipio, cluster, tecnologia predominante e volume por tecnologia.

## Cuidado de interpretacao

Essa base nao mede qualidade contratada de internet residencial. Ela representa sinais agregados do dataset Vísent/CDRView. No produto, deve ser usada como indicio regional de conectividade, nao como julgamento individual do candidato.
