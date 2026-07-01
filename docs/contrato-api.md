# Contrato da API

## `POST /match`

Entrada: filtros da vaga conforme implementação do backend. Fonte atual de candidatos: `mocks/candidatos_teste.json`. O `score_match` deve seguir o cálculo documentado em `docs/score-match.md` ou consumir artefato gerado por `python -m scripts.gera_shortlist_mvp`.

Resposta mínima:

```json
{
  "fonte_candidatos": "mocks/candidatos_teste.json",
  "total_analisados": 8,
  "total_retorno": 8,
  "regra_privacidade": "contato_pos_aprovacao omitido na triagem inicial",
  "candidatos": [
    {
      "candidato_id": "cand_001",
      "apelido_exibicao": "Candidato 1",
      "status_identificacao": "anonimizado",
      "cargo_alvo": "Analista de Dados",
      "nivel": "Júnior",
      "regiao": "Florianópolis - SC",
      "cluster_residencia": "CENTRO",
      "skills": ["Python", "SQL"],
      "score_match": 92
    }
  ]
}
```

`contato_pos_aprovacao` nunca integra esta resposta. Sua liberação exige endpoint autenticado, autorização e ID específico.

## `GET /insights/regioes`

Fontes: cadastro de antenas Anatel e tensor de mobilidade do Vísent.

```json
{
  "fontes": {
    "antenas": "Vísent CDRView: referencias/antenas_flp.csv",
    "sessoes": "Vísent CDRView: tensores/tensor_mobilidade.csv",
    "concentracao": "Vísent CDRView: tensores/tensor_concentracao.csv"
  },
  "metodologia": "agregação por município e cluster",
  "total_regioes": 24,
  "regioes": [
    {
      "municipio": "Florianópolis",
      "cluster": "CENTRO",
      "lat_media": -27.59,
      "lon_media": -48.55,
      "qtd_antenas": 5,
      "total_sessoes_3g": 0,
      "total_sessoes_4g": 100,
      "total_sessoes_5g": 0,
      "total_sessoes_outros": 0,
      "total_sessoes": 100,
      "percentual_3g": 0,
      "percentual_4g": 100,
      "percentual_5g": 0,
      "percentual_outros": 0,
      "tecnologia_predominante_regiao": "4G",
      "usuarios_observados_total": 120000,
      "sessoes_concentracao_total": 540000,
      "periodo_pico": "TARDE",
      "usuarios_observados_periodo_pico": 50000,
      "indice_concentracao_relativa": 82.5,
      "fonte_antenas": "Vísent CDRView: referencias/antenas_flp.csv",
      "fonte_sessoes": "Vísent CDRView: tensores/tensor_mobilidade.csv",
      "fonte_concentracao": "Vísent CDRView: tensores/tensor_concentracao.csv"
    }
  ]
}
```

Os valores do exemplo ilustram o formato; o endpoint deve servir os números gerados pelos arquivos processados, sem hardcode. Sessões não equivalem a velocidade ou garantia de cobertura. `usuarios_observados_total` agrega observações do tensor e não representa população única.
