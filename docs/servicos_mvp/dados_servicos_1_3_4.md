# Dados para os servicos 1, 3 e 4 do MVP

Este pacote local organiza os dados simulados para os modulos pendentes do App BiT:

- Formacoes
- Experiencias Estruturantes
- Mentorias

O objetivo e entregar ao backend uma base inicial coerente com a proposta do projeto, sem alterar o fluxo ja validado de Empregabilidade, shortlist, score, anonimização e Saude do Time.

## Arquivos criados

- `data/servicos_mvp/formacoes_mvp.csv`
- `data/servicos_mvp/experiencias_estruturantes_mvp.csv`
- `data/servicos_mvp/mentorias_mvp.csv`
- `database/V5__servicos_mvp_seed_draft.sql`

## Formacoes

Arquivo: `data/servicos_mvp/formacoes_mvp.csv`

Total: 6 trilhas.

Campos:

- `trilha_id`
- `nome_trilha`
- `descricao_conteudo`
- `carga_horaria`
- `link_midia`

As trilhas foram pensadas para RH e liderancas corporativas, conectando diversidade, score_match, shortlist anonima, ESG e saude do time.

## Experiencias Estruturantes

Arquivo: `data/servicos_mvp/experiencias_estruturantes_mvp.csv`

Total: 24 eventos.

Campos:

- `evento_id`
- `nome_evento`
- `data`
- `horario`
- `local`
- `detalhes`
- `tema_palestra`
- `palestrantes`

O campo `local` usa as 24 regioes ja existentes em `data/powerbi/insights_regioes_powerbi.csv`, mantendo a conexao com a camada regional do projeto.

## Mentorias

Arquivo: `data/servicos_mvp/mentorias_mvp.csv`

Total: 10 mentores ficticios.

Campos:

- `mentor_id`
- `nome_mentor`
- `empresa_origem`
- `cargo`
- `especialidade_esg`
- `disponibilidade`

As mentorias foram desenhadas para troca de boas praticas entre liderancas de diversidade, ESG, People Analytics, cultura e inclusao regional.

## Sugestao de endpoints

Para o MVP, o backend pode expor endpoints simples de leitura:

- `GET /api/formacoes`
- `GET /api/experiencias`
- `GET /api/mentorias`

O frontend pode consumir esses endpoints e renderizar cards sem regra adicional.

## Observacao para Flyway

O arquivo `database/V5__servicos_mvp_seed_draft.sql` e um draft. Antes de virar migration oficial, o backend deve revisar:

- nomes finais das tabelas;
- padrao de entidades Java;
- compatibilidade H2/MySQL;
- se os inserts precisam ser idempotentes.

## Sugestao para validacao BI

O script `scripts/valida_integracao_bi.py` pode receber uma validacao leve:

- conferir 6 trilhas de formacao;
- conferir 24 eventos;
- conferir que os 24 locais dos eventos existem em `insights_regioes_powerbi.csv`;
- conferir 10 mentores.

Isso amplia a validacao dos novos servicos sem quebrar o CI atual.
