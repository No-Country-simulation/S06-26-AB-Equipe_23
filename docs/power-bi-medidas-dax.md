# Medidas DAX com fonte disponível

Tabela regional: `insights_regioes_powerbi`.

```DAX
Total Regioes = COUNTROWS(insights_regioes_powerbi)

Total Antenas = SUM(insights_regioes_powerbi[qtd_antenas])

Total Sessoes = SUM(insights_regioes_powerbi[total_sessoes])

Total Sessoes 3G = SUM(insights_regioes_powerbi[total_sessoes_3g])

Total Sessoes 4G = SUM(insights_regioes_powerbi[total_sessoes_4g])

Total Sessoes 5G = SUM(insights_regioes_powerbi[total_sessoes_5g])

Percentual 5G = DIVIDE([Total Sessoes 5G], [Total Sessoes], 0)
```

Tabela de shortlist: `shortlist_candidatos_powerbi`.

```DAX
Candidatos Analisados = DISTINCTCOUNT(shortlist_candidatos_powerbi[candidato_id])

Score Medio = AVERAGE(shortlist_candidatos_powerbi[score_match])
```

Não há fonte atual para medidas corporativas de quadro de funcionários ou rotatividade.
