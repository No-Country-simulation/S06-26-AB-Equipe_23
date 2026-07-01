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

```DAX
Turnover Ultima Competencia % =
VAR UltimaCompetencia = MAX(metricas_empresa_demo[competencia])
RETURN
    CALCULATE(
        [Turnover Geral %],
        metricas_empresa_demo[competencia] = UltimaCompetencia
    )

Desligamentos Ultima Competencia =
VAR UltimaCompetencia = MAX(metricas_empresa_demo[competencia])
RETURN
    CALCULATE(
        [Total Desligamentos],
        metricas_empresa_demo[competencia] = UltimaCompetencia
    )
```

## Recortes de diversidade e ESG

```DAX
Headcount Diversidade =
CALCULATE(
    [Headcount Final],
    FILTER(
        metricas_empresa_demo,
        metricas_empresa_demo[genero_demo] = "Mulher"
            || metricas_empresa_demo[raca_cor_demo] = "Negra"
            || metricas_empresa_demo[pcd_demo] = "Sim"
    )
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
    FILTER(
        metricas_empresa_demo,
        metricas_empresa_demo[genero_demo] = "Mulher"
            || metricas_empresa_demo[raca_cor_demo] = "Negra"
            || metricas_empresa_demo[pcd_demo] = "Sim"
    )
)
```

Para recortes e interseções, usar `genero_demo`, `raca_cor_demo` e `pcd_demo` como segmentadores. As combinações são mutuamente exclusivas na tabela, evitando dupla contagem. Não relacionar essa tabela com candidatos individuais: ela representa métricas agregadas da empresa.

No Power Query, definir `competencia` como Data e as colunas de headcount, admissões e desligamentos como Número inteiro.

## Formatação

- `Turnover Geral %`, `Turnover Ultima Competencia %`, `Turnover Saida %`, `Turnover Entrada %`, `Participacao Diversidade %`, `Meta Diversidade %` e `Turnover Diversidade %`: percentual, uma casa decimal.
- `Gap Meta Diversidade pp`: número decimal, uma casa.
- Valores reais somente após conexão com a fonte corporativa cadastrada pela empresa.
