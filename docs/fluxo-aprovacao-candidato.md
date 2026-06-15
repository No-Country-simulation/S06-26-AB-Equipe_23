# Fluxo de Aprovacao do Candidato

## Objetivo

Definir quando os dados identificaveis do candidato podem aparecer no produto.

No MVP, a shortlist deve nascer anonimizada para reduzir vies e proteger dados sensiveis. Nome, e-mail, telefone e LinkedIn so devem ser exibidos depois de uma acao explicita de aprovacao na triagem.

## Regra principal

1. O recrutador cria ou preenche a vaga.
2. O sistema executa `POST /match`.
3. A resposta retorna candidatos anonimizados:
   - `Candidato 1`
   - `Candidato 2`
   - `Candidato 3`
4. O recrutador analisa score, skills, explicacao e indicadores de apoio.
5. Se o candidato for aprovado na triagem, o frontend pode chamar a rota futura de contato.
6. Somente nessa etapa o nome e os dados de contato aparecem.

## Payload do match anonimizado

```json
{
  "candidato_id": "cand_001",
  "apelido_exibicao": "Candidato 1",
  "status_identificacao": "anonimizado",
  "nivel": "junior",
  "regiao": "Florianopolis",
  "score_match": 91,
  "skills": ["sql", "python", "power bi"],
  "explicacao": "Alta aderencia nas skills principais e residencia em regiao compativel com a vaga."
}
```

## Payload apos aprovacao

Endpoint futuro sugerido:

```text
GET /candidatos/:id/contato
```

```json
{
  "candidato_id": "cand_001",
  "status_identificacao": "liberado_apos_aprovacao",
  "nome": "Ana Souza",
  "email": "ana.souza@example.com",
  "telefone": "+55 48 99999-0000",
  "linkedin": "https://linkedin.com/in/ana-souza"
}
```

## Cuidado de implementacao

- O backend nao deve enviar `nome`, `email`, `telefone` ou `linkedin` no retorno inicial de `/match`.
- O frontend deve mostrar apenas o `apelido_exibicao` antes da aprovacao.
- O clique de aprovacao deve ser uma acao consciente do recrutador.
- Esta regra protege o candidato e reduz vies na triagem inicial.

## Critério de aceite

O fluxo estara correto quando:

- `/match` retornar somente candidatos anonimizados;
- dados de contato nao aparecerem na shortlist inicial;
- a liberacao de contato estiver separada em rota/etapa posterior;
- o time conseguir explicar que anonimizar e uma decisao de produto, nao apenas detalhe tecnico.
