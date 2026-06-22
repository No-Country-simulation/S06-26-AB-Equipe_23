# Especificação do frontend - Shortlist e métricas disponíveis

## Endpoint

`POST /match`

## Fonte atual

`mocks/candidatos_teste.json`, com oito candidatos. O backend deve devolver apenas os campos não sensíveis presentes em `mocks/match_payload.json`.

## Componentes permitidos

- card com total analisado e total retornado;
- tabela de shortlist anonimizada;
- filtros por região, nível, cargo e skills;
- score informado no input;
- link para a tela separada de insights regionais Vísent.

## Não implementar com dados inventados

- turnover;
- série histórica;
- metas ESG corporativas;
- headcount por departamento;
- candidatos extras.

Esses componentes podem ter somente placeholders sem números até existir uma fonte oficial.
