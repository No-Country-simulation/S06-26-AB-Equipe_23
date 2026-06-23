# Medidas DAX — Saúde do Time e ESG

Tabela: `metricas_empresa_demo`. A massa atual é fictícia e serve somente para montar e testar o relatório. Na integração, substituir pela tabela corporativa mantendo as mesmas colunas.

## Turnover

```DAX
Headcount Inicial =
VAR PrimeiraCompetencia = MIN(metricas_empresa_demo[competencia])
RETURN
    CALCULATE(
        SUM(metricas_empresa_demo[headcount_inicio]),
        metricas_empresa_demo[competencia] = PrimeiraCompetencia
    )

Headcount Final =
VAR UltimaCompetencia = MAX(metricas_empresa_demo[competencia])
RETURN
    CALCULATE(
        SUM(metricas_empresa_demo[headcount_fim]),
        metricas_empresa_demo[competencia] = UltimaCompetencia
    )

Headcount Medio =
AVERAGEX(
    VALUES(metricas_empresa_demo[competencia]),
    DIVIDE(
        CALCULATE(SUM(metricas_empresa_demo[headcount_inicio]))
            + CALCULATE(SUM(metricas_empresa_demo[headcount_fim])),
        2,
        0
    )
)

Total Admissoes = SUM(metricas_empresa_demo[admissoes])

Total Desligamentos = SUM(metricas_empresa_demo[desligamentos])

Turnover Geral % =
DIVIDE(
    DIVIDE([Total Admissoes] + [Total Desligamentos], 2, 0),
    [Headcount Medio],
    0
)

Turnover Saida % = DIVIDE([Total Desligamentos], [Headcount Medio], 0)

Turnover Entrada % = DIVIDE([Total Admissoes], [Headcount Medio], 0)
```

As medidas respondem automaticamente aos filtros de empresa, competência, departamento e grupo de diversidade.

## Recortes de diversidade e ESG

```DAX
Headcount Diversidade =
CALCULATE(
    [Headcount Final],
    metricas_empresa_demo[grupo_diversidade] <> "Outros colaboradores"
)

Participacao Diversidade % = DIVIDE([Headcount Diversidade], [Headcount Final], 0)

Meta Diversidade % = MAX(metricas_empresa_demo[meta_diversidade_percentual]) / 100

Gap Meta Diversidade pp = ([Participacao Diversidade %] - [Meta Diversidade %]) * 100

Status Meta ESG =
IF(
    [Participacao Diversidade %] >= [Meta Diversidade %],
    "Meta atingida",
    "Abaixo da meta"
)

Turnover Diversidade % =
CALCULATE(
    [Turnover Geral %],
    metricas_empresa_demo[grupo_diversidade] <> "Outros colaboradores"
)
```

Para analisar um grupo específico, usar `grupo_diversidade` como segmentador ou legenda. Não relacionar essa tabela com candidatos individuais: ela representa métricas agregadas da empresa.

## Formatação

- `Turnover Geral %`, `Turnover Saida %`, `Turnover Entrada %`, `Participacao Diversidade %`, `Meta Diversidade %` e `Turnover Diversidade %`: percentual, uma casa decimal.
- `Gap Meta Diversidade pp`: número decimal, uma casa.
- Valores reais somente após conexão com a fonte corporativa cadastrada pela empresa.
