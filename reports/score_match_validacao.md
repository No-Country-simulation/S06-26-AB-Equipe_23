# Validação do protótipo de score de match

## Objetivo

Registrar o estado atual da implementação de score de match, os testes executados e os resultados obtidos após integrar o cálculo ao gerador de shortlist.

## Alterações principais

- Adicionado protótipo de cálculo de score em `scripts/score_match.py`.
- Integrado o cálculo ao fluxo de geração de shortlist em `scripts/gera_shortlist_mvp.py`.
- Atualizada documentação em `docs/score-match.md` para descrever a fórmula e o novo comportamento.

## Comportamento atual

- O score agora é recalculado ao gerar `mocks/match_payload.json`.
- O cálculo é baseado em:
  - compatibilidade de skills,
  - experiência,
  - compatibilidade do modelo de trabalho,
  - bônus de diversidade.
- Quando a vaga exige skills que nenhum candidato possui, o score é reduzido, mas continua calculado a partir das dimensões restantes.

## Testes aplicados

1. `python -m unittest tests.test_score_match -v`
   - valida scores de todos os 8 candidatos
   - verifica limites de 0 a 100
   - testa cenário de skill inexistente
   - valida que a geração de shortlist usa os scores computados

2. `python -m unittest tests.test_score_regression -v`
   - valida que o payload gerado pelo `POST /match` reflete o cálculo computado, não apenas o valor antigo do mock

3. `python -m unittest tests.test_anonymization -v`
   - valida que `mocks/match_payload.json` não contém `contato_pos_aprovacao`
   - valida que não expõe `nome`, `email`, `telefone` ou `linkedin`

## Resultados

- Todos os testes passaram.
- A geração de shortlist está integrada com o protótipo de score.
- A anonimização do payload inicial está validada na saída atual.

## Observações

- O comportamento de score atual é prototípico e utiliza um perfil fixo de vaga.
- Para produção, é necessário:
  - validar o perfil real de vaga e os pesos de cada componente,
  - definir a regra de exclusão ou corte when não há skills compatíveis,
  - confirmar a política de diversidade e conformidade legal para o filtro anti-vies.

## Próximos passos sugeridos

- Revisar com o time de produto os parâmetros de `ScoreConfig` e `ScoreProfile`.
- Formalizar a fórmula de score no backend e no contrato de API.
- Implementar controle de acesso para a liberação de dados de contato pós-aprovação.
