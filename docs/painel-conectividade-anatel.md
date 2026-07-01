# Painel de Conectividade Anatel - Proposta BI

## Objetivo

Transformar os dados de antenas e sessoes 3G/4G/5G em uma leitura visual para o RH.

No fluxo do produto, esse painel aparece depois da shortlist, quando o recrutador quer entender se existe alguma barreira regional de conectividade para trabalho remoto ou hibrido.

## Tese de negocio

O match entre vaga e candidato nao deve olhar apenas skills. Para vagas remotas ou hibridas, a empresa tambem precisa entender o contexto regional de conectividade.

Isso nao deve excluir candidatos. Deve apoiar decisao responsavel:

- prever necessidade de apoio de infraestrutura;
- ajustar modelo remoto/hibrido;
- identificar regioes com maior ou menor maturidade digital;
- orientar politicas de inclusao digital.

## Dados usados

Arquivo tratado:

`data/processed/antenas_sinal_tratadas.csv`

Campos principais:

- `lat`
- `lon`
- `municipio`
- `cluster`
- `sessoes_3g`
- `sessoes_4g`
- `sessoes_5g`
- `tecnologia_predominante`

## Indicadores sugeridos

| Indicador | Como calcular | Uso |
|---|---|---|
| Total de antenas | Contagem de `ecgi` | Volume da cobertura mapeada |
| Tecnologia predominante geral | Moda de `tecnologia_predominante` | Leitura rapida do perfil da regiao |
| Total de sessoes | Soma de 3G + 4G + 5G + outros | Intensidade de uso |
| Participacao 5G | `sessoes_5g / total_sessoes` | Maturidade de conectividade |
| Indicador conectividade | Regra qualitativa por tecnologia e volume | Sinal para decisao de RH |

## Regra inicial de indicador

```text
se tecnologia_predominante = 5G -> muito_alta
se tecnologia_predominante = 4G e total_sessoes alto -> alta
se tecnologia_predominante = 4G -> media
se tecnologia_predominante = 3G -> baixa
caso contrario -> sem_dado
```

## Endpoint recomendado

Usar `GET /insights/regioes` como rota principal.

Dentro da resposta:

- `regioes`: resumo regional;
- `conectividade`: dados para mapa;
- `pontos_mapa`: lista de antenas com latitude/longitude.

Se o backend preferir separar, pode expor depois:

`GET /insights/regioes`

Mas o contrato precisa manter o mesmo formato para o frontend nao quebrar.

## Visual sugerido

Mapa com marcadores:

- cor por tecnologia predominante;
- tamanho por total de sessoes;
- tooltip com municipio, cluster e sessoes por tecnologia;
- filtro por municipio/cluster;
- cards com total de antenas, predominancia geral e participacao 5G.

## Mensagem para o usuario final

O painel nao serve para penalizar candidatos. Ele serve para ajudar empresas a criarem processos seletivos mais justos, considerando tambem barreiras de infraestrutura digital.

