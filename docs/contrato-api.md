# Contrato de Dados da API - MVP

## Objetivo

Definir o formato inicial dos dados que a API deve entregar para o frontend e para o dashboard.

Nesta fase, os dados podem ser simulados.

## Endpoint `POST /match`

Recebe uma vaga e retorna candidatos compatíveis com score, skills, região e badge de diversidade.

Por privacidade e redução de vieses, a primeira resposta do matching deve ser anonimizada. Nome e contato do candidato ficam para uma etapa posterior, após aprovação/seleção.

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
      "apelido_exibicao": "Candidato 1",
      "status_identificacao": "anonimizado",
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

## Endpoint futuro `GET /candidatos/:id/contato`

Endpoint sugerido para etapa posterior. Deve ser usado somente quando o candidato for aprovado/selecionado para avanço no processo.

### Response

```json
{
  "candidato_id": "cand_001",
  "nome": "Ana Souza",
  "email": "ana.souza@email.com",
  "telefone": "+55 48 99999-0000",
  "linkedin": "https://linkedin.com/in/anasouza"
}
```

Observação:

Este endpoint não precisa entrar no MVP inicial se o time preferir manter apenas dados simulados e anonimizados na primeira entrega.

## Endpoint `GET /insights`

Retorna indicadores para o dashboard. Nesta primeira versão, o bloco principal é `regioes`, derivado do dataset Vísent.

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

Observação:

`/insights` foi mantido como rota principal para simplificar o backend. O conteúdo regional fica dentro da chave `regioes`.

## Regra inicial de score

```text
score_match =
  0.60 * score_skills +
  0.20 * score_nivel +
  0.10 * score_regiao +
  0.10 * score_diversidade
```

## Campos mínimos para frontend - MVP

- `candidato_id`
- `apelido_exibicao`
- `status_identificacao`
- `nivel`
- `regiao`
- `score_match`
- `skills`
- `badge_diversidade`
- `explicacao`

## Campos mínimos para dashboard - MVP

- `total_analisados`
- `total_retorno`
- `percentual_shortlist_diversa`
- `meta_diversidade`
- `meta_atingida`
- `media_score_match`
- `distribuicao_por_regiao`

## Campos opcionais para evolução

Estes campos podem ser usados depois, se frontend e backend quiserem evoluir o dashboard:

- `cluster_residencia`
- `score_componentes`
- `perfil_regiao`
- `indicador_acessibilidade`
- `periodo_pico`
- `uso_no_produto`
