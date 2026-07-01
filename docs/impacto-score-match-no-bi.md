# Impacto do novo `score_match` no BI

## Objetivo

Registrar o impacto da integração do cálculo de `score_match` no fluxo de BI e deixar uma trilha objetiva para validação com Dados, Backend e Frontend.

## Estado validado

O gerador de shortlist passou a recalcular `score_match` usando `scripts/score_match.py` antes de exportar:

- `mocks/match_payload.json`
- `data/powerbi/shortlist_candidatos_powerbi.csv`

Com isso, o painel deixa de exibir notas estáticas originalmente preenchidas no mock e passa a exibir notas calculadas pelo protótipo atual.

## Scores atuais exportados

| candidato_id | apelido_exibicao | região | score_match recalculado |
|---|---|---|---:|
| cand_001 | Candidato 1 | Florianopolis | 80 |
| cand_002 | Candidato 2 | Sao Jose | 61 |
| cand_003 | Candidato 3 | Florianopolis | 56 |
| cand_004 | Candidato 4 | Biguacu | 68 |
| cand_005 | Candidato 5 | Palhoca | 63 |
| cand_006 | Candidato 6 | Florianopolis | 49 |
| cand_007 | Candidato 7 | Sao Jose | 78 |
| cand_008 | Candidato 8 | Florianopolis | 58 |

## Impacto esperado no painel

- Cards de score médio e ranking devem mudar porque as notas agora refletem cálculo ponderado.
- A ordenação por `score_match` deve priorizar `cand_001`, `cand_007`, `cand_004`, `cand_005`, `cand_002`, `cand_008`, `cand_003`, `cand_006`.
- Visuais por região, nível, cargo, skills e badges não devem alterar contagem de registros.
- A shortlist continua com exatamente 8 candidatos.
- A anonimização continua preservada: nome, e-mail, telefone e LinkedIn não entram no CSV nem no payload inicial.

## Comandos de validação

Executar a partir da raiz do repositório:

```powershell
python -m scripts.gera_shortlist_mvp
python -m pytest tests/test_score_match.py tests/test_score_regression.py tests/test_anonymization.py -q
python scripts/valida_integracao_bi.py
```

Observação: no Windows, `python scripts\gera_shortlist_mvp.py` pode falhar por import de pacote. Use `python -m scripts.gera_shortlist_mvp`.

## Critérios de aceite para BI

- `data/powerbi/shortlist_candidatos_powerbi.csv` tem 8 linhas de candidatos.
- Campo `score_match` está preenchido entre 0 e 100.
- Não há colunas `nome`, `email`, `telefone`, `linkedin` ou `contato_pos_aprovacao` no CSV.
- O Power BI não cria candidatos sintéticos para preencher gráficos.
- Medidas e visuais devem deixar claro que o score é prototípico e calculado a partir do perfil fixo atual.

