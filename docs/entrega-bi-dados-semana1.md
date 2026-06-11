# Entrega BI/Dados - Semana 1

## Objetivo

Registrar a primeira entrega de BI/Dados para o projeto BiT App B2B, conforme direcionamento da Alessandra.

Esta entrega cobre:

- mapeamento inicial do dataset Vísent CDRView;
- dicionário de dados;
- modelagem conceitual para SQL Server;
- contrato inicial dos dados da API;
- exemplos de payload simulados para backend/frontend.

## Fonte

Repositório de referência:

```text
https://github.com/wongola-bit/appbit-hackathon
```

Pasta analisada:

```text
dataset-visent
```

## Leitura executiva

O dataset Vísent CDRView não é uma base de candidatos ou currículos.

Ele é uma base sintética de mobilidade urbana e território, com dados de:

- antenas;
- regiões;
- municípios;
- concentração de usuários;
- fluxos origem-destino;
- deslocamentos;
- privacidade e k-anonimato.

Para o MVP do BiT App, o dataset deve apoiar principalmente:

- insights regionais;
- dashboard;
- análise territorial;
- enriquecimento do matching por região.

Os candidatos e vagas do MVP devem ser simulados em dados mockados.

## Estrutura entregue

```text
docs/
  dicionario-dados.md
  modelagem-sql-server.md
  contrato-api.md
  entrega-bi-dados-semana1.md

database/
  modelagem_sql_server.sql

mocks/
  match_payload.json
  insights_regioes_payload.json
```

## Arquivos

| Arquivo | Finalidade |
|---|---|
| `docs/dicionario-dados.md` | Explica os principais arquivos e campos do dataset |
| `docs/modelagem-sql-server.md` | Descreve a modelagem conceitual proposta |
| `docs/contrato-api.md` | Define os formatos iniciais de `/match` e `/insights/regioes` |
| `database/modelagem_sql_server.sql` | Script SQL inicial para SQL Server |
| `mocks/match_payload.json` | Exemplo de retorno simulado do endpoint `/match` |
| `mocks/insights_regioes_payload.json` | Exemplo de retorno simulado de insights regionais |

## Próximo passo

Validar com backend e frontend:

- nomes das rotas;
- nomes dos campos;
- formato dos mocks;
- quais dados entram primeiro na interface;
- se o SQL Server será usado agora ou apenas como referência inicial.

## Status

Versão inicial para validação do time.

