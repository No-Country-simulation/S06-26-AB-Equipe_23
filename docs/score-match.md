# Score Match - Fórmula Matemática

## Objetivo

Calcular a compatibilidade entre uma vaga e um candidato de forma simples, auditável e fácil de implementar.

## Fórmula inicial

```text
score_match =
  0.60 * score_skills +
  0.20 * score_nivel +
  0.10 * score_regiao +
  0.10 * score_diversidade
```

## Componentes

| Componente | Peso | Explicação |
|---|---:|---|
| `score_skills` | 60% | Quanto as habilidades do candidato batem com as exigidas pela vaga |
| `score_nivel` | 20% | Quanto o nível do candidato combina com o nível da vaga |
| `score_regiao` | 10% | Quanto a região do candidato faz sentido para a vaga |
| `score_diversidade` | 10% | Apoio à meta ESG/diversidade sem eliminar candidatos |

## Exemplo

Vaga pede:

- SQL
- Python
- Power BI

Candidato tem:

- SQL
- Python
- Excel

Resultado:

```text
score_skills = 2 / 3 * 100 = 66,67
score_nivel = 100
score_regiao = 80
score_diversidade = 100

score_match =
  0.60 * 66,67 +
  0.20 * 100 +
  0.10 * 80 +
  0.10 * 100

score_match = 78
```

## Evolucao com conectividade regional

Como o fluxo do produto agora inclui um painel de conectividade Anatel, o score pode evoluir para uma versao explicativa com contexto regional.

```text
score_match_v2 =
  0.55 * score_skills +
  0.20 * score_nivel +
  0.10 * score_regiao +
  0.10 * score_diversidade +
  0.05 * score_conectividade
```

## Componente `score_conectividade`

Esse componente nao deve eliminar candidatos. Ele serve para indicar se a regiao do candidato pode exigir apoio adicional para trabalho remoto ou hibrido.

Regra inicial:

| Condicao regional | Score sugerido |
|---|---:|
| Predominancia 5G | 100 |
| Predominancia 4G com alto volume de sessoes | 90 |
| Predominancia 4G | 80 |
| Predominancia 3G | 50 |
| Sem dado | 40 |

Exemplo de uso:

```text
score_conectividade = 90
motivo = "Regiao com predominancia 4G e presenca relevante de sessoes 5G."
```

Esse campo deve aparecer como explicacao, nao como criterio eliminatorio.

## Regra de privacidade

Na primeira resposta do `/match`, os candidatos devem aparecer anonimizados:

- `Candidato 1`
- `Candidato 2`
- `Candidato 3`

Nome e contato só entram em etapa posterior de aprovação/seleção.

## Cuidados

- Diversidade não deve ser usada como critério de exclusão.
- Conectividade regional tambem nao deve ser usada como criterio de exclusao.
- O score deve ser explicável.
- O backend deve conseguir retornar os componentes do score.
- O frontend deve mostrar a explicação de forma simples.
