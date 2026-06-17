# Power BI - Medidas DAX

## Tabela `insights_regioes_powerbi`

Arquivo:

```text
data/powerbi/insights_regioes_powerbi.csv
```

### Medidas principais

```DAX
Total Regioes = COUNTROWS(insights_regioes_powerbi)
```

```DAX
Total Municipios = DISTINCTCOUNT(insights_regioes_powerbi[municipio])
```

```DAX
Total Antenas = SUM(insights_regioes_powerbi[qtd_antenas])
```

```DAX
Total Sessoes = SUM(insights_regioes_powerbi[total_sessoes])
```

```DAX
Regioes com Alerta =
CALCULATE(
    COUNTROWS(insights_regioes_powerbi),
    insights_regioes_powerbi[possui_alerta] = "Sim"
)
```

```DAX
Percentual 4G+5G Medio =
AVERAGE(insights_regioes_powerbi[percentual_4g_5g])
```

```DAX
Percentual 5G Medio =
AVERAGE(insights_regioes_powerbi[percentual_5g])
```

```DAX
Total Sessoes 3G = SUM(insights_regioes_powerbi[total_sessoes_3g])
```

```DAX
Total Sessoes 4G = SUM(insights_regioes_powerbi[total_sessoes_4g])
```

```DAX
Total Sessoes 5G = SUM(insights_regioes_powerbi[total_sessoes_5g])
```

### Medidas de apoio visual

```DAX
Texto Status Conectividade =
VAR Alertas = [Regioes com Alerta]
RETURN
IF(
    Alertas = 0,
    "Sem regioes criticas na base atual",
    Alertas & " regioes exigem atencao"
)
```

```DAX
Cor Status Alerta =
VAR Alertas = [Regioes com Alerta]
RETURN
IF(Alertas = 0, "#16A34A", "#EF4444")
```

## Tabela `dashboard_tela2_mvp`

Arquivo:

```text
data/powerbi/dashboard_tela2_mvp.csv
```

### Medidas principais

```DAX
Total Vagas Abertas = SUM(dashboard_tela2_mvp[total_vagas_abertas])
```

```DAX
Total Candidatos Analisados = SUM(dashboard_tela2_mvp[total_candidatos_analisados])
```

```DAX
Total Shortlist = SUM(dashboard_tela2_mvp[total_shortlist])
```

```DAX
Media Score Match = AVERAGE(dashboard_tela2_mvp[media_score_match])
```

```DAX
Percentual Shortlist Diversa = AVERAGE(dashboard_tela2_mvp[percentual_shortlist_diversa])
```

```DAX
Meta Diversidade = AVERAGE(dashboard_tela2_mvp[meta_diversidade])
```

```DAX
Turnover Estimado = AVERAGE(dashboard_tela2_mvp[turnover_estimado_percentual])
```

```DAX
Texto Meta ESG =
VAR Meta = SELECTEDVALUE(dashboard_tela2_mvp[meta_atingida])
RETURN
IF(Meta = "Sim", "Meta ESG atingida", "Meta ESG em atencao")
```

```DAX
Cor Meta ESG =
VAR Meta = SELECTEDVALUE(dashboard_tela2_mvp[meta_atingida])
RETURN
IF(Meta = "Sim", "#16A34A", "#F59E0B")
```

```DAX
Cor Risco Turnover =
VAR Risco = SELECTEDVALUE(dashboard_tela2_mvp[risco_turnover])
RETURN
SWITCH(
    TRUE(),
    Risco = "baixo", "#16A34A",
    Risco = "medio", "#F59E0B",
    Risco = "alto", "#EF4444",
    "#6B7280"
)
```

## Tabela `shortlist_candidatos_powerbi`

Arquivo:

```text
data/powerbi/shortlist_candidatos_powerbi.csv
```

### Medidas principais

```DAX
Qtd Candidatos Shortlist = COUNTROWS(shortlist_candidatos_powerbi)
```

```DAX
Score Medio Shortlist = AVERAGE(shortlist_candidatos_powerbi[score_match])
```

```DAX
Qtd Regioes Candidatos = DISTINCTCOUNT(shortlist_candidatos_powerbi[regiao])
```

```DAX
Qtd Skills Mapeadas = SUM(shortlist_candidatos_powerbi[qtd_skills])
```

## Observacoes

- As medidas foram escritas para nomes de tabelas iguais aos nomes dos CSVs sem extensao.
- Se o Power BI renomear a tabela ao importar, ajustar o prefixo nas formulas.
- Diversidade e conectividade devem ser explicativas, nao eliminatorias.
- Candidatos devem permanecer anonimizados na Tela 2.
