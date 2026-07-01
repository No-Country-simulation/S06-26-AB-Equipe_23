# Dicionário de Dados - BI/Dados

## Contexto

Este documento registra o mapeamento inicial do dataset Vísent CDRView para apoiar o MVP do BiT App B2B.

O dataset não contém candidatos reais. Ele contém dados sintéticos de mobilidade urbana, concentração regional, antenas e deslocamentos na Região Metropolitana de Florianópolis.

## Uso no MVP

A base pode apoiar:

- insights regionais;
- dashboard de concentração e mobilidade;
- enriquecimento territorial do matching;
- análise de acessibilidade entre regiões;
- documentação de dados para backend e frontend.

## Arquivos mapeados

| Arquivo | Uso no projeto |
|---|---|
| `antenas_flp.csv` | Catálogo de antenas, clusters, municípios e coordenadas |
| `assinantes.csv` | Perfis sintéticos anonimizados por região, renda, idade e mobilidade |
| `tensor_concentracao.csv` | Concentração por antena, data e período |
| `tensor_od.csv` | Fluxo origem-destino entre regiões |
| `trajetos_comuns.csv` | Trajetos agregados entre clusters |
| `tensor_fluxo_vias.csv` | Fluxo entre antenas consecutivas |
| `tensor_tempo_deslocamento.csv` | Distância média entre regiões |
| `sumario_kanon.csv` | Evidência de k-anonimato e privacidade |

## Campos principais

| Campo | Significado |
|---|---|
| `ecgi` | Código único da antena |
| `cluster` | Região ou zona geográfica |
| `municipio` | Município associado ao registro |
| `lat` | Latitude |
| `lon` | Longitude |
| `assinante_hash` | Identificador anônimo de assinante sintético |
| `home_cluster` | Região provável de residência |
| `income_cluster` | Faixa de renda sintética |
| `age_group` | Faixa etária |
| `mobility_pattern` | Padrão de mobilidade |
| `day_date` | Data do registro |
| `periodo` | Período do dia |
| `n_usuarios` | Quantidade de usuários agregados |
| `n_sessoes` | Quantidade de sessões |
| `cluster_origem` | Região de origem |
| `cluster_destino` | Região de destino |
| `n_viagens` | Quantidade de viagens observadas |
| `dist_media_km` | Distância média em quilômetros |
| `periodo_predominante` | Período mais frequente do deslocamento |

## Observação técnica

A documentação do dataset cita arquivos maiores, como `tensor_mobilidade.csv` e `tensor_sequencias.csv`. No clone inicial utilizado para este mapeamento, esses arquivos não estavam disponíveis localmente. O mapeamento foi feito com os arquivos presentes no repositório público.

## Leitura para o time

O dataset Vísent deve ser tratado como apoio regional do produto. Ele não substitui a base de candidatos, mas ajuda a construir inteligência territorial para o dashboard e para o endpoint de insights.
