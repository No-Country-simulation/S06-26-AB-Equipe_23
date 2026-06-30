# Guia de Teste Manual: Validação de Score e Dados Sensíveis

**Data:** 2026-06-30  
**Endpoint:** `POST /match`  
**Base URL:** `http://localhost:8080` (local)

---

## RESUMO DE TESTES

| # | Cenário | Skill | Nível | Região | Resultado Esperado |
|---|---------|-------|-------|--------|-------------------|
| 1 | Sem filtros | - | - | - | 8 candidatos (todos) |
| 2 | Vaga base (SQL+Python) | sql, python | junior | Florianopolis | 4 candidatos (91, 84, 76, 73) |
| 3 | Skill inexistente | java | junior | Florianopolis | 0 candidatos |
| 4 | Região errada | sql | junior | Curitiba | 0 candidatos |
| 5 | Nível errado | sql | senior | Florianopolis | 0 candidatos |
| 6 | Acentos | sql | junior | São José | ✓ Match (normalização) |
| 7 | Uppercase | SQL | JUNIOR | FLORIANOPOLIS | ✓ Match (normalização) |
| 8 | Limite 3 | sql, python | junior | - | 3 candidatos (máximo) |
| 9 | Múltiplas skills | java, sql | junior | - | Retorna SQL (OR logic) |
| 10 | Validar scores | - | junior | - | Todos 0-100: [91,88,86,84,82,79,76,73] |

---

## TESTE 1: Request Vazia (Sem Filtros)

**Descrição:** Retorna todos os candidatos quando sem filtro

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": null,
  "filtros": null
}
```

### Response Esperada
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
      "cargo_alvo": "Analista de Dados Junior",
      "nivel": "junior",
      "regiao": "Florianopolis",
      "cluster_residencia": "TRINDADE",
      "cep": "88036-000",
      "lat": -27.596111,
      "lon": -48.525528,
      "modelo_trabalho_preferido": "hibrido",
      "skills": ["sql", "python", "power bi", "excel"],
      "anos_experiencia": 1,
      "badge_diversidade": "Mulher negra em tecnologia",
      "score_match": 91
    },
    // ... mais 7 candidatos
  ]
}
```

### Validações
- ✅ total_analisados = 8
- ✅ total_retorno = 8
- ✅ Nenhum campo "contato_pos_aprovacao" no JSON
- ✅ Nenhum campo "nome", "email", "telefone", "linkedin"
- ✅ Todos scores 0-100 (73-91)
- ✅ Mensagem de privacidade clara

---

## TESTE 2: Vaga Base - Analista de Dados Junior (Florianópolis)

**Descrição:** Validar ranking correto com perfil de vaga base BI

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Analista de Dados",
    "skills": ["sql", "python"],
    "nivel": "junior",
    "regiao": "Florianopolis",
    "modelo_trabalho": null
  },
  "filtros": {
    "limite_resultados": 8,
    "anti_vies": null,
    "diversidade_minima": null
  }
}
```

### Response Esperada
```json
{
  "fonte_candidatos": "mocks/candidatos_teste.json",
  "total_analisados": 8,
  "total_retorno": 4,
  "regra_privacidade": "contato_pos_aprovacao omitido na triagem inicial",
  "candidatos": [
    {
      "candidato_id": "cand_001",
      "apelido_exibicao": "Candidato 1",
      "score_match": 91,
      "regiao": "Florianopolis",
      "skills": ["sql", "python", "power bi", "excel"],
      "nivel": "junior",
      "anos_experiencia": 1,
      "badge_diversidade": "Mulher negra em tecnologia"
    },
    {
      "candidato_id": "cand_003",
      "apelido_exibicao": "Candidato 3",
      "score_match": 84,
      "regiao": "Florianopolis",
      "skills": ["power bi", "sql", "estatistica"],
      "nivel": "junior",
      "anos_experiencia": 0,
      "badge_diversidade": "Perfil junior em formacao tecnica"
    },
    {
      "candidato_id": "cand_008",
      "apelido_exibicao": "Candidato 8",
      "score_match": 76,
      "regiao": "Florianopolis",
      "skills": ["excel", "power bi", "sql"],
      "nivel": "junior",
      "anos_experiencia": 0,
      "badge_diversidade": "Talento de baixa renda"
    },
    {
      "candidato_id": "cand_006",
      "apelido_exibicao": "Candidato 6",
      "score_match": 73,
      "regiao": "Florianopolis",
      "skills": ["sql", "tableau", "excel"],
      "nivel": "junior",
      "anos_experiencia": 2,
      "badge_diversidade": "Sem badge informada"
    }
  ]
}
```

### Validações
- ✅ total_retorno = 4 (só Florianópolis com sql/python)
- ✅ Ordenação descendente: 91 > 84 > 76 > 73
- ✅ Todos têm "sql" ou "python"
- ✅ Todos têm nível "junior"
- ✅ Todos têm região "Florianopolis"
- ✅ **CRÍTICO:** Nenhum campo sensível presente

---

## TESTE 3: Skill Inexistente (JAVA)

**Descrição:** Validar tratamento de skill que não existe em nenhum candidato

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Especialista Java",
    "skills": ["java"],
    "nivel": "junior",
    "regiao": "Florianopolis",
    "modelo_trabalho": null
  },
  "filtros": {
    "limite_resultados": 8,
    "anti_vies": null,
    "diversidade_minima": null
  }
}
```

### Response Esperada
```json
{
  "fonte_candidatos": "mocks/candidatos_teste.json",
  "total_analisados": 8,
  "total_retorno": 0,
  "regra_privacidade": "contato_pos_aprovacao omitido na triagem inicial",
  "candidatos": []
}
```

### Validações
- ✅ total_retorno = 0
- ✅ Array "candidatos" vazio (não nulo)
- ✅ Sem exceção/erro HTTP
- ✅ Status HTTP: 200 OK (não 4xx/5xx)

---

## TESTE 4: Múltiplas Skills com Inexistente (OR Logic)

**Descrição:** Com OR logic, deve retornar candidatos com SQL (ignorando JAVA)

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Analista",
    "skills": ["java", "sql"],
    "nivel": "junior",
    "regiao": null,
    "modelo_trabalho": null
  },
  "filtros": {
    "limite_resultados": 8,
    "anti_vies": null,
    "diversidade_minima": null
  }
}
```

### Response Esperada
```json
{
  "fonte_candidatos": "mocks/candidatos_teste.json",
  "total_analisados": 8,
  "total_retorno": 8,
  "regra_privacidade": "contato_pos_aprovacao omitido na triagem inicial",
  "candidatos": [
    // Todos os 8, pois todos têm SQL
    // Ordenados por score: 91, 88, 86, 84, 82, 79, 76, 73
  ]
}
```

### Validações
- ✅ total_retorno = 8 (todos têm SQL)
- ✅ Ordenação por score DESC
- ✅ OR logic confirmada (java é ignorado)

---

## TESTE 5: Normalização com Acentos

**Descrição:** "São José" (com acento) deve retornar candidatos de "Sao Jose"

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Analista",
    "skills": ["sql"],
    "nivel": "junior",
    "regiao": "São José",
    "modelo_trabalho": null
  },
  "filtros": {
    "limite_resultados": 8
  }
}
```

### Response Esperada
```json
{
  "total_analisados": 8,
  "total_retorno": 2,
  "candidatos": [
    {
      "candidato_id": "cand_007",
      "apelido_exibicao": "Candidato 7",
      "score_match": 88,
      "regiao": "Sao Jose",
      "skills": ["sql", "python", "power bi", "git"]
    },
    {
      "candidato_id": "cand_002",
      "apelido_exibicao": "Candidato 2",
      "score_match": 86,
      "regiao": "Sao Jose",
      "skills": ["sql", "python", "excel"]
    }
  ]
}
```

### Validações
- ✅ "São José" normalizado para "sao jose"
- ✅ Retorna candidatos corretos (Sao Jose + sql)
- ✅ Acentos removidos durante comparação

---

## TESTE 6: Case Insensitivity

**Descrição:** "SQL", "PYTHON", "JUNIOR" (uppercase) funcionam corretamente

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Analista",
    "skills": ["SQL", "PYTHON"],
    "nivel": "JUNIOR",
    "regiao": "FLORIANOPOLIS",
    "modelo_trabalho": null
  },
  "filtros": {
    "limite_resultados": 8
  }
}
```

### Response Esperada
```json
{
  "total_analisados": 8,
  "total_retorno": 4,
  "candidatos": [
    // Mesma resposta do TESTE 2
    // Candidatos 1, 3, 8, 6 ordenados por score
  ]
}
```

### Validações
- ✅ Case insensitivity funciona (uppercase = lowercase)
- ✅ Resultado idêntico ao teste com lowercase

---

## TESTE 7: Limite de Resultados

**Descrição:** Limitar para 3 candidatos

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Analista",
    "skills": ["sql"],
    "nivel": "junior",
    "regiao": null,
    "modelo_trabalho": null
  },
  "filtros": {
    "limite_resultados": 3,
    "anti_vies": null,
    "diversidade_minima": null
  }
}
```

### Response Esperada
```json
{
  "total_analisados": 8,
  "total_retorno": 3,
  "candidatos": [
    {
      "candidato_id": "cand_001",
      "score_match": 91
    },
    {
      "candidato_id": "cand_007",
      "score_match": 88
    },
    {
      "candidato_id": "cand_002",
      "score_match": 86
    }
  ]
}
```

### Validações
- ✅ total_retorno ≤ 3
- ✅ Retorna top 3 por score

---

## TESTE 8: Nível Errado (senior)

**Descrição:** Nível "senior" não corresponde a nenhum candidato (todos são junior)

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Especialista Dados",
    "skills": ["sql", "python"],
    "nivel": "senior",
    "regiao": null,
    "modelo_trabalho": null
  },
  "filtros": {
    "limite_resultados": 8
  }
}
```

### Response Esperada
```json
{
  "total_analisados": 8,
  "total_retorno": 0,
  "candidatos": []
}
```

### Validações
- ✅ total_retorno = 0
- ✅ Nenhum candidato retornado

---

## TESTE 9: Região Errada

**Descrição:** Região que não existe no dataset

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": {
    "titulo": "Analista",
    "skills": ["sql"],
    "nivel": "junior",
    "regiao": "Curitiba",
    "modelo_trabalho": null
  },
  "filtros": {
    "limite_resultados": 8
  }
}
```

### Response Esperada
```json
{
  "total_analisados": 8,
  "total_retorno": 0,
  "candidatos": []
}
```

### Validações
- ✅ total_retorno = 0
- ✅ Nenhum candidato de Curitiba

---

## TESTE 10: Validação de Scores (Range 0-100)

**Descrição:** Confirmar todos os 8 candidatos têm scores válidos

### Request
```bash
POST http://localhost:8080/match
Content-Type: application/json

{
  "empresa_id": "emp_001",
  "vaga": null,
  "filtros": {
    "limite_resultados": 8
  }
}
```

### Response Esperada - Scores
```
Candidato 1: 91 ✅
Candidato 7: 88 ✅
Candidato 2: 86 ✅
Candidato 3: 84 ✅
Candidato 4: 82 ✅
Candidato 5: 79 ✅
Candidato 8: 76 ✅
Candidato 6: 73 ✅
```

### Validações
- ✅ Todos scores: 0 ≤ score ≤ 100
- ✅ Ordem descendente verificada
- ✅ Sem duplicatas

---

## TESTE 11: Validação de Campos Sensíveis

**Descrição:** Confirmar ausência de contato_pos_aprovacao em TODAS as respostas

### Verificação (Apply to All Tests)
```javascript
// Pseudocódigo de validação
response.candidatos.forEach(candidato => {
  // ❌ Esses campos NÃO devem estar presentes
  assert(!candidato.hasOwnProperty('contato_pos_aprovacao'));
  assert(!candidato.hasOwnProperty('nome'));
  assert(!candidato.hasOwnProperty('email'));
  assert(!candidato.hasOwnProperty('telefone'));
  assert(!candidato.hasOwnProperty('linkedin'));
  
  // ✅ Esses campos DEVEM estar presentes
  assert(candidato.hasOwnProperty('candidato_id'));
  assert(candidato.hasOwnProperty('apelido_exibicao'));
  assert(candidato.hasOwnProperty('score_match'));
  assert(candidato.hasOwnProperty('regiao'));
  assert(candidato.hasOwnProperty('skills'));
});
```

---

## TESTE 12: Validação de Payload Inicial

**Descrição:** Confirmar regra de privacidade no payload

### Validação
```javascript
// Todas as respostas devem ter:
assert(response.regra_privacidade === "contato_pos_aprovacao omitido na triagem inicial");
```

---

## RESUMO DE CHECKLIST

```
✅ TC-001: Scores 0-100
✅ TC-002: Sem dados sensíveis
✅ TC-003: 8 candidatos no dataset
✅ TC-004: Skill inexistente = 0 candidatos
✅ TC-005: Nível exact match
✅ TC-006: Nível errado = 0 candidatos
✅ TC-007: Normalização com acentos
✅ TC-008: Case insensitivity
✅ TC-009: Limite de resultados
✅ TC-010: Ordenação DESC por score
✅ TC-011: Sem filtro = todos candidatos
✅ TC-012: Multiple skills com OR logic
✅ TC-013: Ranking esperado confirmado
✅ TC-014: Todos campos obrigatórios presentes
✅ TC-015: Badges de diversidade presentes
```

---

## COMO EXECUTAR

### 1. Clonar/Atualizar Repositório
```bash
git clone <repo>
cd backend
```

### 2. Compilar e Rodar
```bash
./mvnw.cmd clean package
./mvnw.cmd spring-boot:run
```

### 3. Executar Testes Unitários
```bash
./mvnw.cmd test -Dtest=MatchingServiceTest
```

### 4. Testar Manualmente com cURL
```bash
curl -X POST http://localhost:8080/match \
  -H "Content-Type: application/json" \
  -d '{"empresa_id":"emp_001","vaga":null,"filtros":null}'
```

### 5. Usar Postman/Insomnia
- Importar arquivo: `backend/postman_collection.json` (se disponível)
- Ou copiar exemplos de cada teste acima

---

## ALINHAMENTO COM BI/PYTHON

### Vaga Base BI
```yaml
skills: ["sql", "python"]
nivel: "junior"
regiao: "Florianopolis"
```

### Resultado Esperado (BI)
```
1. Candidato 1: 91
2. Candidato 7: 88 (se regional)
3. Candidato 2: 86 (se regional)
...
```

### Resultado Java
- ✅ **IDÊNTICO** ao BI (mesmos scores, mesma ordem)

---

## CONCLUSÃO

Todos os testes devem passar. Se algum falhar, registrar:
1. **Número do teste**
2. **Descrição da falha**
3. **Request enviado**
4. **Response recebida**
5. **Expected vs Actual**

Reportar para revisão de alinhamento Java/BI.
