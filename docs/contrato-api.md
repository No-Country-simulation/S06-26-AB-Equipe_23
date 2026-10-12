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

## `POST /match/aprovar-candidato`

Endpoint autenticado (`Authorization: Bearer <token>`) para liberação de dados de contato do candidato aprovado na triagem.

Request:
```json
{
  "candidato_id": "cand_001",
  "empresa_id": "emp_001"
}
```

Resposta:
```json
{
  "candidato_id": "cand_001",
  "apelido_exibicao": "Candidato 1",
  "contato_liberado": {
    "nome": "Ana Souza",
    "email": "ana.souza@example.com",
    "telefone": "+55 48 99999-0000",
    "linkedin": "https://linkedin.com/in/ana-souza"
  }
}
```

---

## `GET /vagas` & CRUD de Vagas

Persistência relacional de vagas no banco de dados (Flyway Migration V9).

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/vagas` | Lista vagas cadastradas (suporta paginação `?page=0&size=20`) |
| `GET` | `/vagas/{id}` | Detalhes de uma vaga por ID |
| `POST` | `/vagas` | Criação de nova vaga (com flags afirmativas ESG e skills) |
| `PUT` | `/vagas/{id}` | Atualização completa de vaga existente |
| `DELETE` | `/vagas/{id}` | Exclusão de vaga |

Exemplo de payload de criação (`POST /vagas`):
```json
{
  "titulo": "Engenheiro de Dados Pleno",
  "descricao": "Atuação com pipelines ETL, Python, SQL e Databricks.",
  "nivel": "Pleno",
  "modalidade": "Híbrido",
  "area": "Dados",
  "prioridadeMulheres": true,
  "prioridadeNegros": false,
  "prioridadePcd": false,
  "prioridadeLgbt": false,
  "esgMatch": 85,
  "skills": ["python", "sql", "etl"]
}
```

---

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

---

## `GET /insights/esg` e Exportações

- **`GET /insights/esg`**: Lista alertas analíticos e sugestões automáticas de diversidade e conectividade regional.
- **`GET /insights/exportar/pdf`**: Download de relatório executivo em PDF com assinatura digital SHA-256 (`application/pdf`).
- **`GET /insights/exportar/excel`**: Download de planilha consolidada em Excel (`.xlsx`).

---

## Autenticação e Provedores de Identidade

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `POST` | `/login` | Público | Autenticação com e-mail/senha, retornando token JWT |
| `POST` | `/cadastro` | Público | Cadastro de novo usuário recrutador |
| `GET` | `/api/auth/config` | Público | Retorna flags de configuração pública (ex: `googleClientId`) |
| `GET` | `/oauth2/**` | Público | Fluxo de autorização Google OAuth2 |
| `GET` | `/.well-known/jwks.json` | Público | Chaves públicas para validação assimétrica de JWT |
