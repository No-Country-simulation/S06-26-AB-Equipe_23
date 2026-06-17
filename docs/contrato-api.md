# Contrato de Dados da API - MVP

## Objetivo

Definir o formato inicial dos dados que a API deve entregar para o frontend e para o dashboard.

Nesta fase, os dados podem ser simulados.

## Padrao de rotas do MVP

Para manter backend e frontend alinhados, a versao do MVP deve usar rotas diretas e simples.

Rotas principais:

- `POST /match`
- `GET /insights/regioes`
- `GET /candidatos/:id/contato` como rota futura, apenas apos aprovacao para entrevista.

Observacao:

O painel de conectividade fica dentro de `GET /insights/regioes`, na chave `conectividade`.

Separacao de escopo:

- Dashboard inicial: turnover, metas ESG, vagas, shortlist e metricas gerais.
- Insights regionais: dados geograficos, antenas, 3G/4G/5G e conectividade Anatel/Vísent.

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
    "limite_resultados": 200
  }
}
```

### Response

```json
{
  "vaga_id": "job_001",
  "total_analisados": 200,
  "total_retorno": 200,
  "metrica_diversidade": {
    "percentual_shortlist_diversa": 88.5,
    "meta_diversidade": 40,
    "meta_atingida": true
  },
  "candidatos": [
    {
      "candidato_id": "cand_001",
      "apelido_exibicao": "Candidato 1",
      "status_identificacao": "anonimizado",
      "status_funil": "base",
      "cargo_alvo": "Desenvolvedor Frontend Junior",
      "nivel": "junior",
      "regiao": "Sao Jose",
      "cluster_residencia": "SAO_JOSE_KOBRASOL",
      "score_match": 65,
      "score_diversidade": 46,
      "skills": ["excel", "java", "suporte", "dashboards"],
      "qtd_skills": 4,
      "badge_diversidade": "Primeira geracao no ensino superior",
      "modelo_trabalho_preferido": "presencial",
      "disponibilidade": "15 dias",
      "indicador_conectividade": "alta",
      "contato_liberado": "Nao",
      "explicacao": "Perfil anonimizado para triagem inicial, com score de match, skills e contexto regional prontos para dashboard e validacao."
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

Detalhe do fluxo:

- Antes da aprovacao, o frontend deve exibir apenas `apelido_exibicao`.
- Depois da aprovacao, a rota futura de contato pode retornar `nome`, `email`, `telefone` e `linkedin`.
- Ver tambem `docs/fluxo-aprovacao-candidato.md`.

## Endpoint `GET /insights/regioes`

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

`/insights/regioes` foi mantido como rota principal para simplificar o backend. O conteudo regional fica dentro da chave `regioes`, e o mapa de conectividade fica dentro da chave `conectividade`.

### Bloco de conectividade para mapa

```json
{
  "conectividade": {
    "fonte": "Vísent CDRView / Anatel",
    "resumo": {
      "total_antenas": 132,
      "tecnologia_predominante_geral": "4G",
      "municipios_mapeados": ["Biguacu", "Florianopolis"]
    },
    "pontos_mapa": [
      {
        "ecgi": "7240501003962715",
        "cluster": "BIGUACU_BR101_NORTE",
        "municipio": "Biguacu",
        "lat": -27.508108,
        "lon": -48.654131,
        "sessoes_3g": 86272,
        "sessoes_4g": 303756,
        "sessoes_5g": 115292,
        "tecnologia_predominante": "4G",
        "indicador_conectividade": "alta",
        "uso_no_produto": "Apoiar RH na leitura de barreiras digitais por regiao."
      }
    ]
  }
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

## Evolucao sugerida do score com conectividade

Quando o fluxo do produto passar a usar o painel Anatel como apoio a decisao, o score pode considerar conectividade regional como componente explicativo:

```text
score_match_v2 =
  0.55 * score_skills +
  0.20 * score_nivel +
  0.10 * score_regiao +
  0.10 * score_diversidade +
  0.05 * score_conectividade
```

Esse componente nao deve eliminar candidatos. Ele serve para sinalizar risco operacional ou necessidade de apoio de infraestrutura no trabalho remoto/hibrido.

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

Observacao:

Metricas como turnover e metas ESG pertencem ao dashboard inicial. Dados de antenas e conectividade ficam restritos a `GET /insights/regioes`.

## Campos opcionais para evolução

Estes campos podem ser usados depois, se frontend e backend quiserem evoluir o dashboard:

- `cluster_residencia`
- `score_componentes`
- `perfil_regiao`
- `indicador_acessibilidade`
- `periodo_pico`
- `uso_no_produto`

