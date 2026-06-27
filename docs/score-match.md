# Algoritmo de cálculo do `score_match`

## Objetivo

O `score_match` é uma nota de 0 a 100 que classifica a aderência de um candidato a um perfil de vaga. O cálculo atual é um protótipo implementado em `scripts/score_match.py` e consumido por `scripts/gera_shortlist_mvp.py`.

## Dados usados na avaliação

### Do candidato

- `skills`: lista de habilidades informadas pelo candidato.
- `anos_experiencia`: tempo total de experiência em anos.
- `modelo_trabalho_preferido`: preferência de trabalho (`hibrido`, `remoto`, `presencial`).
- `badge_diversidade`: indicador de diversidade social/territorial.
- `regiao`: região de origem do candidato (mantida no resultado, mas não é pontuada no score atual).

### Do perfil da vaga

- `required_skills`: skills obrigatórias ou preferenciais da vaga.
- `preferred_work_model`: modelo de trabalho desejado pela vaga.
- `min_experience_years`: experiência mínima esperada.

## Critérios de cálculo

O score é composto por quatro critérios principais:

1. Skills
2. Experiência / nível
3. Compatibilidade de modelo de trabalho
4. Diversidade

### 1. Skills

A correspondência de skills é medida como a proporção de skills obrigatórias que o candidato possui.

- Se a vaga não define skills obrigatórias, o `skill_score` é tratado como 100%.
- Se a vaga define skills, o valor é:
  - `skill_score = matched_skills / total_required_skills`
- O resultado fica entre 0 e 1.

Isso significa que uma vaga com 4 skills obrigatórias e 2 skills coincidentes gera `skill_score = 0.5`.

### 2. Experiência / nível

A pontuação de experiência é calculada a partir dos anos de experiência do candidato:

- `experience_score = anos_experiencia / max(min_experience_years, max_experience_years_configured)`
- O valor é limitado a 100%.

No protótipo, a configuração padrão considera `max_experience_years = 5`, ou seja, 5 anos de experiência já saturam o componente de experiência.

Candidatos sem anos de experiência ou com valor inválido recebem `0` neste critério.

### 3. Modelo de trabalho

A compatibilidade entre o modelo de trabalho preferido pelo candidato e o modelo desejado pela vaga é avaliada com as seguintes regras:

- mesma preferência: 100%
- híbrido com remoto/presencial: 85%
- remoto com presencial: 75%
- presencial com remoto: 65%
- ausência de preferência ou dados incompletos: 50%

Esse critério avalia flexibilidade e alinhamento de modalidade, sem ser excludente.

### 4. Diversidade

O algoritmo atual trata o campo `badge_diversidade` como um bônus adicional.

- Se o candidato possui uma `badge_diversidade` válida, ele recebe 100% do peso de diversidade.
- Caso contrário, recebe 0%.

Isso significa que o bônus não reduz candidatos não diversos; apenas realça perfis com diversidade declarada.

### 5. Região

A região do candidato é mantida no payload e usada nas regras de negócio de apresentação e filtros, mas não entra no cálculo numérico do `score_match` na versão atual.

## Pesos aplicados

Os pesos padrão configuráveis são:

- skills: 50%
- experiência: 25%
- modelo de trabalho: 15%
- diversidade: 10%

A soma ponderada usa esses pesos para combinar os critérios principais.

## Fórmula final

A fórmula do `score_match` é:

```text
raw_score = (
  skill_score * 0.50 +
  experience_score * 0.25 +
  work_model_score * 0.15
) + diversity_bonus * 0.10
```

Em seguida, o `raw_score` é normalizado para a escala de 0 a 100 e arredondado para inteiro.

## Exemplos de comportamento

- Um candidato com todas as skills exigidas, experiência compatível e modelo de trabalho igual tende a obter uma nota alta.
- Um candidato sem skills exigidas pode receber `skill_score = 0`, mas ainda pontua por experiência, trabalho e diversidade.
- Um candidato com `badge_diversidade` recebe um bônus adicional de até 10 pontos percentuais na nota final.
- Um candidato sem região compatível permanece na shortlist; a região só é usada em filtros ou validações de conformidade do processo.

## Resultado atual do protótipo

O cálculo de `score_match` foi integrado ao gerador de shortlist de MVP:

- `scripts/score_match.py`: implementação do cálculo e funções de apoio.
- `scripts/gera_shortlist_mvp.py`: recálculo do `score_match` antes da geração do payload final.

A geração de `mocks/match_payload.json` agora utiliza o score calculado dinamicamente em vez de valores estáticos.

## Validação e testes

O algoritmo foi validado com testes automatizados:

- `tests/test_score_match.py`
- `tests/test_score_regression.py`
- `tests/test_anonymization.py`

Esses testes garantem a consistência do cálculo, a preservação do resultado nos mocks e a anonimização dos dados sensíveis.

## Recomendações para entrega ao cliente

- Esta especificação deve acompanhar o sistema como a regra atual de cálculo do `score_match`.
- Para produção, recomendamos validar e ajustar:
  - pesos de cada critério,
  - tratamento de `min_experience_years` e faixas de senioridade,
  - inclusão de região/comparação regional no score,
  - políticas de diversidade e fairness.
- Com essa base, o modelo pode evoluir para incluir regras de exclusão, thresholds obrigatórios ou cálculo de risco regional.
