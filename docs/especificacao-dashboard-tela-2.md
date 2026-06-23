# Especificação — Dashboard Saúde do Time e ESG

## Objetivo

Travar o layout e as fórmulas antes da chegada dos dados corporativos reais. A massa `data/powerbi/metricas_empresa_demo.csv` é fictícia, genérica e não contém candidatos.

## Estrutura do relatório

### Filtros

- empresa;
- competência;
- departamento;
- gênero, raça/cor e indicador PcD demonstrativos, permitindo recortes interseccionais sem dupla contagem.

### Cards

- turnover geral;
- turnover de saída;
- desligamentos;
- participação de grupos de diversidade;
- status da meta ESG.

### Gráficos

- linha: evolução mensal do turnover;
- barras: turnover por departamento;
- colunas agrupadas: admissões e desligamentos por período;
- barras: turnover por grupo de diversidade;
- indicador: participação atual versus meta de diversidade.

## Integração futura

A empresa fornecerá esses dados ao cadastrar ou editar seu perfil. O backend deverá disponibilizar uma tabela com o mesmo contrato da massa demonstrativa. O frontend reservará uma área para iframe do Power BI ou implementação nativa.

## Identificação obrigatória

Enquanto a fonte real não estiver conectada, todo visual deve exibir `DADOS DEMONSTRATIVOS — EMPRESAS GENÉRICAS`.

Protótipo navegável: `exports/mock_dashboard_metricas_empresa.html`.
