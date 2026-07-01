# Registro de execução BI - Pedro - 2026-06-27

## Contexto

Trabalho executado na branch `bi-dados-inicial`, no repositório:

```text
C:\Users\pedro\Downloads\UAM_Estudo_20260511_233211\NoCountry_BiT_App\github_work\S06-26-AB-Equipe_23
```

Último commit remoto antes das alterações locais:

```text
2ace92e Atualiza documentação final do cálculo de score_match
```

## Solicitação atendida

Demanda de BI/Pedro:

- apoiar Backend no merge para `main` sem quebrar histórico de migrations;
- apoiar Dados na validação do impacto da redução/alteração de dados no painel;
- apoiar Frontend na implementação do Power BI caso iframe ou token quebrem;
- criar storytelling dos dados para a apresentação.

## Arquivos criados nesta execução

- `docs/impacto-score-match-no-bi.md`
- `docs/suporte-backend-merge-main.md`
- `docs/suporte-frontend-powerbi.md`
- `docs/storytelling-dados-apresentacao.md`
- `docs/registro-execucao-bi-pedro-2026-06-27.md`

## Arquivos atualizados nesta execução

- `data/powerbi/shortlist_candidatos_powerbi.csv`
- `mocks/match_payload.json`
- `docs/contrato-api.md`
- `docs/entrega-bi-powerbi-front-alessandra.md`
- `docs/power-bi-dashboard-tela-2.md`

## Validações executadas

```powershell
python -m scripts.gera_shortlist_mvp
python -m pytest tests/test_score_match.py tests/test_score_regression.py tests/test_anonymization.py -q
python scripts\valida_integracao_bi.py
```

Resultados:

```text
7 passed
OK: candidatos=8, privacidade preservada
OK: antenas=132, regioes=24, sessoes e concentracao reconciliadas
OK: metricas empresariais demonstrativas=1152, segmentos=8
OK: artefatos artificiais de candidatos ausentes
```

## Observação sobre arquivos não rastreados já existentes

Antes desta execução, o `git status` já indicava arquivos locais não rastreados relacionados a workspace e automação de plataforma:

- `docs/UAM_Estudo_20260511_233211.code-workspace`
- `scripts/copia_entregavel_plataforma.py`
- `scripts/foca_janela_edge.py`
- `scripts/preenche_plataforma_nocountry.py`

Esses arquivos não foram alterados nesta execução e precisam de decisão separada: versionar, ignorar ou remover.

## Próxima decisão

Antes de commitar, decidir se o commit deve incluir somente os entregáveis de BI ou também os arquivos auxiliares locais não rastreados.

