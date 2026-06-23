# Resumo das Entregas — 23 de Junho de 2026

Este documento apresenta o resumo das entregas e atualizações realizadas no mapa de conectividade e infraestrutura do projeto App BiT.

---

## 1. Classificação de Qualidade do Sinal
- Foi implementada uma regra qualitativa para classificação da qualidade de sinal por região em [gera_insights_regioes.py](file:///c:/Repositorio/S06-26-AB-Equipe_23/scripts/gera_insights_regioes.py):
  - **Muito Alta**: Predominância de tecnologia `5G`.
  - **Alta**: Predominância de tecnologia `4G` e volume regional total de sessões $\ge 2.000.000$ (indicando densidade de infraestrutura).
  - **Média**: Predominância de tecnologia `4G` e volume regional total de sessões $< 2.000.000$.
  - **Baixa**: Predominância de tecnologia `3G`.
  - **Sem Dado**: Demais cenários ou ausência de dados de sessões.
- A classificação foi exposta nos campos `qualidade_sinal` e `indicador_conectividade`.

## 2. Atualização dos Fluxos de Exportação e BI
- **Campos Propagados**: O script de integração do Power BI ([gera_powerbi_insights_regioes.py](file:///c:/Repositorio/S06-26-AB-Equipe_23/scripts/gera_powerbi_insights_regioes.py)) foi adaptado para exportar as novas métricas de qualidade para o arquivo [insights_regioes_powerbi.csv](file:///c:/Repositorio/S06-26-AB-Equipe_23/data/powerbi/insights_regioes_powerbi.csv).
- **Validação HTML e Markdown**: O script de mapa e listagem regional ([gera_validacao_mapa_regioes.py](file:///c:/Repositorio/S06-26-AB-Equipe_23/scripts/gera_validacao_mapa_regioes.py)) foi atualizado para exibir e catalogar a nova classificação na tabela do relatório de validação.

## 3. Garantia de Integridade e Testes
- Foram introduzidas asserções estritas em [valida_integracao_bi.py](file:///c:/Repositorio/S06-26-AB-Equipe_23/scripts/valida_integracao_bi.py) garantindo que todas as 24 regiões tenham valores válidos mapeados para os campos de qualidade.
- Os scripts foram executados e todos os testes passaram com sucesso, mantendo a consistência dos dados do MVP.

## 4. Documentação Atualizada
- Atualização detalhada no dicionário de antenas em [dicionario-antenas-sinal.md](file:///c:/Repositorio/S06-26-AB-Equipe_23/docs/dicionario-antenas-sinal.md) e na descrição dos dados consolidados em [base-agregada-insights-regioes.md](file:///c:/Repositorio/S06-26-AB-Equipe_23/docs/base-agregada-insights-regioes.md).
