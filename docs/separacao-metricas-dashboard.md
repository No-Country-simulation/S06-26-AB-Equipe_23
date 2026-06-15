# Separacao de Metricas - Dashboard e Insights Regionais

## Objetivo

Separar claramente o que pertence ao dashboard inicial do produto e o que pertence ao endpoint regional de conectividade.

Essa separacao evita misturar regra de negocio de recrutamento com dados geograficos da Anatel/Vísent.

## Dashboard Inicial - Tela 2

Foco: acompanhamento executivo da operacao de recrutamento.

Metricas recomendadas:

| Metrica | Descricao | Origem sugerida |
|---|---|---|
| `total_vagas_abertas` | Quantidade de vagas em andamento | Base de vagas |
| `total_candidatos_analisados` | Total de candidatos processados pelo match | Resultado de `/match` |
| `percentual_shortlist_diversa` | Percentual de candidatos diversos na shortlist | Resultado de `/match` |
| `meta_esg_atingida` | Indica se a meta minima de diversidade foi atingida | Resultado de `/match` |
| `media_score_match` | Media dos scores retornados | Resultado de `/match` |
| `turnover_estimado` | Indicador simulado de rotatividade para o MVP | Mock/dashboard |

## Insights Regionais - Conectividade

Foco: leitura geografica e infraestrutura digital.

Endpoint:

```text
GET /insights/regioes
```

Metricas recomendadas:

| Metrica | Descricao | Origem sugerida |
|---|---|---|
| `municipio` | Municipio analisado | Base tratada Anatel/Vísent |
| `cluster` | Agrupamento regional do dataset | Base tratada Anatel/Vísent |
| `qtd_antenas` | Quantidade de antenas/celulas no recorte | Base agregada |
| `sessoes_3g` | Volume de sessoes 3G | Base tratada |
| `sessoes_4g` | Volume de sessoes 4G | Base tratada |
| `sessoes_5g` | Volume de sessoes 5G | Base tratada |
| `tecnologia_predominante` | Tecnologia predominante na regiao | Calculo BI |
| `indicador_conectividade` | Alta, media, baixa ou alerta | Regra BI |

## Regra de separacao

- Turnover, metas ESG, quantidade de vagas e shortlist ficam no dashboard inicial.
- Antenas, tecnologia predominante, mapa e barreiras digitais ficam em `/insights/regioes`.
- Conectividade nao deve eliminar candidato automaticamente.
- Conectividade deve ser apresentada como contexto operacional e regional.

## Inconsistencia observada

No resumo da reuniao apareceu uma mencao a `/regioes`, mas o alinhamento mais especifico da documentacao e da conversa ficou como:

```text
GET /insights/regioes
```

Para evitar divergencia, a entrega de BI segue `GET /insights/regioes`.
