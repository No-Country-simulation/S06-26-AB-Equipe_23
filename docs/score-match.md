# Score de match - estado da fonte e proposta de fórmula

## Situação atual

O arquivo oficial do MVP `mocks/candidatos_teste.json` já contém o campo `score_match` para os oito candidatos. No estado atual do projeto, esse valor é transportado pelo script de geração de shortlist (`scripts/gera_shortlist_mvp.py`) e não é recalculado por um algoritmo próprio.

## Proposta de implementação protótipo

Foi adicionado um módulo protótipo em `scripts/score_match.py` que calcula o `score_match` a partir das informações do candidato e de um perfil de vaga.

### Campos utilizados

- `skills`
- `anos_experiencia`
- `modelo_trabalho_preferido`
- `badge_diversidade`

### Parâmetros de configuração

A classe `ScoreConfig` define pesos default usados na fórmula:

- `skill_weight`: 0.5
- `experience_weight`: 0.25
- `work_model_weight`: 0.15
- `diversity_bonus_weight`: 0.1
- `max_experience_years`: 5

A classe `ScoreProfile` define o perfil da vaga:

- `required_skills`
- `preferred_work_model`
- `min_experience_years`

## Fórmula de cálculo

1. Calcule o percentual de skills compatíveis entre o candidato e as skills requeridas.
   - Se o conjunto de skills requeridas for vazio, considera 100%.
2. Calcule a pontuação de experiência como razão entre anos de experiência e o máximo de anos configurado.
   - O valor é limitado a 100%.
3. Calcule a compatibilidade de modelo de trabalho:
   - igual = 100%
   - híbrido com remoto/presencial = 85%
   - remoto com presencial = 75%
   - presencial com remoto = 65%
   - caso sem preferência clara = 50%
4. Calcule o bônus de diversidade:
   - se `badge_diversidade` estiver presente, o bônus vale 100% do peso de diversidade;
   - caso contrário, vale 0%.
5. Faça a soma ponderada:

```text
raw_score = (
    skill_score * skill_weight +
    experience_score * experience_weight +
    work_model_score * work_model_weight
) + diversity_bonus * diversity_bonus_weight
```

6. Normalize para a escala de 0 a 100 e arredonde.

### Comportamento quando nenhuma skill é encontrada

Se a vaga exigir uma skill que nenhum candidato possui, o protótipo atual retorna:

- `skill_score` igual a 0 para todos os candidatos;
- pontuações ainda calculadas a partir de experiência, modelo de trabalho e bônus de diversidade;
- notas menores, mas não necessariamente zero, desde que exista compatibilidade por experiência ou modelo de trabalho.

Esse comportamento é intencional no protótipo: ele trata o conjunto de skills como um fator importante,
mas não elimina automaticamente candidatos quando outros atributos ainda podem contribuir.

## Resultados atuais do protótipo

O gerador de shortlist oficial também foi atualizado para usar o cálculo de score protótipo em `scripts/gera_shortlist_mvp.py`. Isso significa que a geração de `mocks/match_payload.json` agora recalcula `score_match` a partir do perfil fixo do MVP.

O protótipo já foi coberto por testes: `tests/test_score_match.py`, `tests/test_score_regression.py` e `tests/test_anonymization.py`.

O teste de regressão garante que o valor de `score_match` presente em `mocks/candidatos_teste.json` seja preservado na geração de `mocks/match_payload.json`.

O teste unitário de score valida:

- que todos os 8 candidatos recebem um valor calculado;
- que o score fica entre 0 e 100;
- os valores esperados gerados pelo perfil de teste atual.

## Perguntas para validação de produto

Para avançar de protótipo para produção, precisamos confirmar:

- Quais são as skills obrigatórias e como a vaga será representada no input real?
- Qual modelo de trabalho deve ser tratado como preferencial (`hibrido`, `remoto`, `presencial`)?
- Como a experiência deve ser ponderada: relação linear, faixas ou thresholds?
- O bônus de diversidade deve ser aditivo, multiplicativo ou apenas informativo?
- Conectividade regional deve influenciar o score? Se sim, em qual etapa da fórmula?
- A nota final deve ser um percentual (0-100) ou outra escala formalizada?

## Próximos passos

1. Revisar a fórmula com o time de produto.
2. Ajustar pesos e regras conforme contrato oficial da vaga.
3. Integrar o cálculo de score ao backend / geração de shortlist.
4. Validar com dados reais e atualizar os mocks conforme necessário.
