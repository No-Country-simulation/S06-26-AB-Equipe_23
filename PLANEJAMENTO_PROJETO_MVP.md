# Planejamento do Projeto MVP

## 1. Contexto da Demanda

Este planejamento cobre a frente de dados para três ofertas do MVP:

1. Trilhas de capacitacao em diversidade e inclusao para RH e liderancas.
2. Eventos corporativos de diversidade (palestras e paineis).
3. Conexao com lideres de diversidade de outras empresas (mentorias e networking).

Objetivo principal: criar a estrutura de dados, popular o banco com dados simulados e garantir validacao tecnica sem quebrar o pipeline de CI.

## 2. Objetivo Geral

Garantir que o banco de dados tenha modelagem, dados iniciais e validacoes necessarias para que backend, frontend e validacao BI funcionem com consistencia no MVP.

## 3. Escopo Tecnico

### 3.1 Tabelas a Criar

1. Tabela de Trilhas (Formacoes)
2. Tabela de Eventos (Experiencias Estruturantes)
3. Tabela de Mentores (Mentorias)

### 3.2 Carga Inicial

1. Scripts SQL de seed com dados simulados.
2. Registros suficientes para os fluxos basicos de listagem, detalhe e filtros.

### 3.3 Validacao e Integracao

1. Atualizar script valida_integracao_bi.py para reconhecer novas tabelas.
2. Garantir execucao sem regressao no CI do GitHub.

## 4. Modelagem de Dados Proposta

## 4.1 Tabela trilhas

Campos obrigatorios:

1. trilha_id (PK)
2. nome_trilha
3. descricao_conteudo
4. carga_horaria
5. link_midia

Regras recomendadas:

1. nome_trilha nao nulo e com tamanho minimo.
2. carga_horaria maior que zero.
3. link_midia com formato valido quando informado.

## 4.2 Tabela eventos

Campos obrigatorios:

1. evento_id (PK)
2. nome_evento
3. data
4. horario
5. local (vinculado as 24 regioes de Florianopolis)
6. detalhes
7. tema_palestra
8. palestrantes

Regras recomendadas:

1. data e horario nao nulos.
2. local validado contra lista de regioes permitidas.
3. nome_evento e tema_palestra nao vazios.

## 4.3 Tabela mentores

Campos obrigatorios:

1. mentor_id (PK)
2. nome_mentor
3. empresa_origem
4. cargo
5. especialidade_esg
6. disponibilidade

Regras recomendadas:

1. nome_mentor nao nulo.
2. disponibilidade padronizada (exemplo: semanal, quinzenal, mensal).
3. especialidade_esg preenchida com categorias consistentes.

## 5. Atividades do Analista de Dados

1. Levantar e consolidar requisitos de dados com negocio, backend e frontend.
2. Definir dicionario de dados das tres entidades.
3. Especificar tipos de dados, constraints e validacoes.
4. Projetar a estrategia de local para as 24 regioes de Florianopolis.
5. Construir scripts DDL para criacao das tabelas.
6. Construir scripts de seed SQL com dados simulados realistas.
7. Validar a integridade referencial e qualidade minima dos dados.
8. Atualizar o script valida_integracao_bi.py para novas tabelas.
9. Executar testes de regressao tecnica para evitar quebra no CI.
10. Documentar premissas, comandos e evidencias de validacao.

## 6. Cronograma Sugerido (1 Semana)

## Dia 1 - Descoberta e Especificacao

1. Refinar requisitos com produto e engenharia.
2. Definir dicionario de dados.
3. Formalizar regras de qualidade por campo.

Saida esperada:

1. Documento de requisitos de dados fechado.

### Execucao do Dia 1 (Iniciar Hoje)

Data de inicio: 02/07/2026

Objetivo do dia: fechar requisitos de dados e preparar base para modelagem do Dia 2.

Checklist de execucao do Dia 1:

- [ ] Alinhar com produto os campos obrigatorios de trilhas, eventos e mentores.
- [ ] Validar com backend os tipos esperados por campo (texto, data, horario, identificadores).
- [ ] Validar com frontend os campos necessarios para listagem, detalhe e filtros.
- [ ] Definir e registrar o dicionario de dados inicial.
- [ ] Definir regras de qualidade de dados por campo (nao nulo, formato, limites).
- [ ] Definir padrao de disponibilidade de mentores (exemplo: semanal, quinzenal, mensal).
- [ ] Definir estrategia de local para eventos (lista controlada das 24 regioes).
- [ ] Revisar e aprovar criterios de pronto do Dia 1 com o time.

Status do Dia 1:

1. Situacao atual: Em andamento
2. Bloqueios: Nenhum registrado
3. Proximo marco: Dicionario de dados validado

Evidencias do Dia 1 (preencher ao longo do dia):

1. Decisoes tomadas:
2. Campos confirmados por entidade:
3. Regras de qualidade fechadas:
4. Pendencias para Dia 2:

Quadro rapido do Dia 1:

Responsabilidades sugeridas:

1. Analista de Dados: consolidacao tecnica e dicionario.
2. PO: validacao de regra de negocio e prioridade.
3. Backend: contrato tecnico de tipos e consumo.
4. Frontend: contrato de exibicao, filtros e detalhes.

| Item | Tarefa | Status | Responsavel | Prazo | Observacoes |
|---|---|---|---|---|---|
| D1-01 | Alinhar campos obrigatorios com produto | Em andamento | Analista de Dados + PO | 02/07/2026 | - |
| D1-02 | Validar tipos de dados com backend | Pendente | Analista de Dados + Backend | 02/07/2026 | - |
| D1-03 | Validar necessidade de campos com frontend | Pendente | Analista de Dados + Frontend | 02/07/2026 | - |
| D1-04 | Fechar dicionario de dados inicial | Pendente | Analista de Dados | 02/07/2026 | Dependente dos itens D1-01 a D1-03 |
| D1-05 | Fechar regras de qualidade por campo | Pendente | Analista de Dados + Backend | 02/07/2026 | Dependente do item D1-04 |
| D1-06 | Fechar estrategia das 24 regioes de local | Pendente | Analista de Dados + PO | 02/07/2026 | Validar aderencia com negocio |

## Dia 2 - Modelagem e DDL

1. Criar modelagem logica/fisica das tabelas trilhas, eventos e mentores.
2. Implementar scripts SQL de criacao.
3. Revisar constraints e padroes de nomenclatura.

Saida esperada:

1. Scripts DDL executando em ambiente limpo.

## Dia 3 - Seed SQL

1. Definir volume minimo para o MVP.
2. Criar inserts simulados por tabela.
3. Validar cenarios de listagem e filtros.

Saida esperada:

1. Base povoada para consumo de backend e frontend.

## Dia 4 - Validacao BI e Pipeline

1. Atualizar valida_integracao_bi.py com novas tabelas.
2. Rodar validacoes locais.
3. Ajustar eventuais inconsistencias.

Saida esperada:

1. Script de validacao atualizado e sem regressao local.

## Dia 5 - Fechamento e Evidencias

1. Rodar fluxo completo (DDL + seed + validacao).
2. Coletar evidencias de execucao.
3. Consolidar documentacao tecnica para handoff.

Saida esperada:

1. Pacote final pronto para CI e entrega do MVP.

## 7. Entregaveis

1. Script SQL de criacao da tabela trilhas.
2. Script SQL de criacao da tabela eventos.
3. Script SQL de criacao da tabela mentores.
4. Script SQL de seed inicial das tres tabelas.
5. Atualizacao do valida_integracao_bi.py.
6. Evidencias de teste local e de pipeline.
7. Documento de dicionario de dados e regras.

## 8. Criterios de Pronto (Definition of Done)

1. Tabelas criadas com sucesso em ambiente limpo.
2. Seeds executam sem falha e com volume minimo definido.
3. Backend consegue consultar e retornar dados das novas tabelas.
4. Frontend consegue exibir dados reais simulados.
5. Script valida_integracao_bi.py reconhece as novas tabelas.
6. CI nao apresenta quebra relacionada a mudancas de dados.
7. Documentacao permite reproducao por outra pessoa do time.

## 9. Riscos e Mitigacoes

1. Risco: inconsistencias entre campos esperados pelo frontend e backend.
Mitigacao: alinhar contrato de dados antes do seed final.

2. Risco: local de evento sem padronizacao para as 24 regioes.
Mitigacao: adotar tabela ou dominio controlado de regioes validas.

3. Risco: dados simulados insuficientes para cenarios de teste.
Mitigacao: incluir massa minima para cenarios felizes e de borda.

4. Risco: quebra no CI apos atualizacao da validacao BI.
Mitigacao: executar bateria local e revisar asserts do script antes de subir.

## 10. Checklist Operacional

Como usar este checklist:

1. Marcar [x] quando a atividade for concluida.
2. Manter [ ] para itens pendentes.
3. Atualizar durante as dailies ou revisoes tecnicas.

Checklist por fase:

Status verificado nesta branch em 02/07/2026:

1. Ha evidencias de estrutura e seed em formato draft em `database/V5__servicos_mvp_seed_draft.sql`.
2. Ha dados simulados separados por modulo em `data/servicos_mvp/`.
3. Migration oficial criada em `backend/src/main/resources/db/migration/V5__servicos_mvp.sql`.
4. `scripts/valida_integracao_bi.py` atualizado para validar trilhas, eventos, mentores e mapeamento dos 24 locais.
5. Validacao local executada com sucesso em 02/07/2026.
6. Contagens no banco confirmadas em ambiente limpo: trilhas=6, eventos=24, mentores=10.

### Fase 1 - Estrutura

- [x] Criar DDL da tabela trilhas.
- [x] Criar DDL da tabela eventos.
- [x] Criar DDL da tabela mentores.
- [x] Executar DDL em ambiente de desenvolvimento sem erro.

### Fase 2 - Dados Iniciais

- [x] Criar script de seed da tabela trilhas.
- [x] Criar script de seed da tabela eventos.
- [x] Criar script de seed da tabela mentores.
- [x] Executar seed completo sem falhas.

### Fase 3 - Qualidade e Integracao

- [x] Validar consultas basicas por tabela.
- [x] Validar dados de local contra as 24 regioes de Florianopolis.
- [x] Atualizar valida_integracao_bi.py para novas tabelas.
- [x] Rodar validacao local completa sem regressao.

### Fase 4 - Entrega

- [x] Verificar pipeline de CI sem quebra relacionada aos dados.
- [x] Consolidar evidencias de execucao (DDL, seed, validacoes).
- [x] Revisar documentacao tecnica final.
- [x] Realizar handoff para backend e frontend.

### Quadro de Acompanhamento (Itens e Fases)

Preencher e atualizar este quadro durante a execucao do projeto.

| Item | Fase | Descricao | Status | Responsavel | Prazo | Data conclusao | Observacoes |
|---|---|---|---|---|---|---|---|
| 1 | Fase 1 - Estrutura | Criar DDL da tabela trilhas | Concluido | A definir | A definir | 02/07/2026 | Migration oficial adicionada em backend/src/main/resources/db/migration/V5__servicos_mvp.sql |
| 2 | Fase 1 - Estrutura | Criar DDL da tabela eventos | Concluido | A definir | A definir | 02/07/2026 | Migration oficial adicionada em backend/src/main/resources/db/migration/V5__servicos_mvp.sql |
| 3 | Fase 1 - Estrutura | Criar DDL da tabela mentores | Concluido | A definir | A definir | 02/07/2026 | Migration oficial adicionada em backend/src/main/resources/db/migration/V5__servicos_mvp.sql |
| 4 | Fase 1 - Estrutura | Executar DDL sem erro no ambiente de desenvolvimento | Concluido | A definir | A definir | 02/07/2026 | Validado em ambiente limpo via AppbitApplicationTests com Flyway aplicando ate V5 |
| 5 | Fase 2 - Dados Iniciais | Criar seed da tabela trilhas | Concluido | A definir | A definir | 02/07/2026 | Dados em CSV + inserts no draft SQL |
| 6 | Fase 2 - Dados Iniciais | Criar seed da tabela eventos | Concluido | A definir | A definir | 02/07/2026 | Dados em CSV + inserts no draft SQL |
| 7 | Fase 2 - Dados Iniciais | Criar seed da tabela mentores | Concluido | A definir | A definir | 02/07/2026 | Dados em CSV + inserts no draft SQL |
| 8 | Fase 2 - Dados Iniciais | Executar seed completo sem falhas | Concluido | A definir | A definir | 02/07/2026 | Seed aplicado no fluxo oficial de migration (V5) em teste de inicializacao do backend |
| 9 | Fase 3 - Qualidade e Integracao | Validar consultas basicas por tabela | Concluido | A definir | A definir | 02/07/2026 | Validado via MigrationV5CountsTest com contagens 6/24/10 no banco apos Flyway |
| 10 | Fase 3 - Qualidade e Integracao | Validar local com as 24 regioes de Florianopolis | Concluido | A definir | A definir | 02/07/2026 | Validacao automatizada adicionada ao script BI com comparacao por label_regiao |
| 11 | Fase 3 - Qualidade e Integracao | Atualizar valida_integracao_bi.py | Concluido | A definir | A definir | 02/07/2026 | Incluidas checagens de formacoes, eventos, mentorias e consistencia de local |
| 12 | Fase 3 - Qualidade e Integracao | Rodar validacao local completa sem regressao | Concluido | A definir | A definir | 02/07/2026 | Execucao local do script concluida com sucesso |
| 13 | Fase 4 - Entrega | Verificar pipeline de CI sem quebra | Concluido | A definir | A definir | 02/07/2026 | Blocos backend, frontend e data-bi validados localmente com sucesso |
| 14 | Fase 4 - Entrega | Consolidar evidencias de execucao | Concluido | A definir | A definir | 02/07/2026 | Evidencias registradas na secao "Consolidado de Evidencias Tecnicas" |
| 15 | Fase 4 - Entrega | Revisar documentacao tecnica final | Concluido | A definir | A definir | 02/07/2026 | Documento docs/servicos_mvp/dados_servicos_1_3_4.md revisado para refletir status final |
| 16 | Fase 4 - Entrega | Realizar handoff para backend e frontend | Concluido | A definir | A definir | 02/07/2026 | Handoff formal registrado em docs/servicos_mvp/HANDOFF_BACKEND_FRONTEND_MVP.md |

Legenda de status sugerida:

1. Pendente
2. Em andamento
3. Bloqueado
4. Concluido

### Consolidado de Evidencias Tecnicas

Data de consolidacao: 02/07/2026

1. Migration oficial criada:
	- Arquivo: backend/src/main/resources/db/migration/V5__servicos_mvp.sql
	- Escopo: criacao de tabelas trilhas_formacao, eventos_estruturantes e mentores_diversidade + seed inicial.

2. Validacao BI atualizada:
	- Arquivo: scripts/valida_integracao_bi.py
	- Escopo: checagem de volumes (6/24/10) e consistencia de locais com as 24 regioes validas.
	- Comando executado: python scripts/valida_integracao_bi.py
	- Resultado: sucesso com todas as assercoes aprovadas.

3. Migracoes Flyway validadas em ambiente limpo:
	- Comando executado: .\\mvnw.cmd -Dtest=AppbitApplicationTests test (pasta backend)
	- Resultado: BUILD SUCCESS e aplicacao ate versao v5.

4. Contagens do banco validadas por teste automatizado:
	- Arquivo de teste: backend/src/test/java/br/com/appbit/appbit/MigrationV5CountsTest.java
	- Comando executado: .\\mvnw.cmd -Dtest=MigrationV5CountsTest test (pasta backend)
	- Resultado: BUILD SUCCESS.
	- Evidencia de contagem: trilhas_formacao=6, eventos_estruturantes=24, mentores_diversidade=10.

5. Verificacao local dos blocos de CI:
	- Backend: .\\mvnw.cmd test --no-transfer-progress (pasta backend) -> BUILD SUCCESS, 28 testes sem falhas.
	- Frontend: npm run build (raiz do projeto) -> build concluido com sucesso.
	- Data/BI: .\\.venv-ci\\Scripts\\python.exe -m pytest tests/test_score_match.py tests/test_score_regression.py tests/test_anonymization.py -q -> 7 passed.
	- Data/BI: .\\.venv-ci\\Scripts\\python.exe scripts/valida_integracao_bi.py -> validacao BI concluida com sucesso.

## 11. Responsabilidades do Analista de Dados

1. Liderar desenho e qualidade da camada de dados do MVP.
2. Garantir rastreabilidade entre requisito de negocio e estrutura tecnica.
3. Antecipar riscos de consistencia e integracao.
4. Apoiar time de desenvolvimento no consumo correto dos dados.
5. Sustentar criterios de qualidade para release do MVP.