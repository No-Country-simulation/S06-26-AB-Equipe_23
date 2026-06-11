# Contrato de Dados da API - MVP

## Objetivo

Definir o formato inicial dos dados que a API deve entregar para o frontend e para o dashboard.

Nesta fase, os dados podem ser simulados.

## Endpoint `POST /match`

Recebe uma vaga e retorna candidatos compatíveis com score, skills, região e badge de diversidade.

### Request

```json
{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Analista de Dados Junior",
    "skills": ["sql", "python", "power bi"],
    "nivel": "junior",
    "regiao": "Florianopolis",
    "modelo_trabalho": "hibrido"
  },
  "filtros": {
    "anti_vies": true,
    "diversidade_minima": 40,
    "limite_resultados": 10
  }
}
```

### Response

```json
{
  "vaga_id": "job_001",
  "total_analisados": 120,
  "total_retorno": 3,
  "metrica_diversidade": {
    "percentual_shortlist_diversa": 66.7,
    "meta_diversidade": 40,
    "meta_atingida": true
  },
  "candidatos": [
    {
      "candidato_id": "cand_001",
      "nome": "Ana Souza",
      "nivel": "junior",
      "regiao": "Florianopolis",
      "score_match": 91,
      "skills": ["sql", "python", "power bi", "excel"],
      "badge_diversidade": "Mulher negra em tecnologia",
      "explicacao": "Alta aderencia nas skills principais e residencia em regiao compativel com a vaga."
    }
  ]
}
```

## Endpoint `GET /insights/regioes`

Retorna indicadores regionais derivados do dataset Vísent.

### Response

```json
{
  "fonte": "Vísent CDRView - dataset sintetico App BiT",
  "regioes": [
    {
      "cluster": "TRINDADE",
      "municipio": "Florianopolis",
      "lat": -27.6011,
      "lon": -48.532,
      "n_usuarios_estimados": 18420,
      "periodo_pico": "TARDE",
      "perfil_regiao": "Residencial universitario",
      "indicador_acessibilidade": "alta"
    }
  ]
}
```

## Regra inicial de score

```text
score_match =
  0.60 * score_skills +
  0.20 * score_nivel +
  0.10 * score_regiao +
  0.10 * score_diversidade
```

## Campos mínimos para frontend

- `candidato_id`
- `nome`
- `nivel`
- `regiao`
- `score_match`
- `skills`
- `badge_diversidade`
- `explicacao`

## Campos mínimos para dashboard

- `total_analisados`
- `total_retorno`
- `percentual_shortlist_diversa`
- `meta_diversidade`
- `meta_atingida`
- `media_score_match`
- `distribuicao_por_regiao`
