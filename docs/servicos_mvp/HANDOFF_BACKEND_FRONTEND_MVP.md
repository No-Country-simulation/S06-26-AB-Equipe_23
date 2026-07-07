# Handoff Backend e Frontend - Servicos MVP

Data: 02/07/2026
Escopo: Formacoes, Experiencias Estruturantes e Mentorias.

## 1. Objetivo do handoff

Garantir que backend e frontend consumam os novos dados com contrato claro, evidencias de validacao e passos de verificacao rapidos.

## 2. Entregas tecnicas concluidas

1. Migration oficial publicada:
   - backend/src/main/resources/db/migration/V5__servicos_mvp.sql
2. Validacao BI atualizada:
   - scripts/valida_integracao_bi.py
3. Teste de contagem pos-migration:
   - backend/src/test/java/br/com/appbit/appbit/MigrationV5CountsTest.java

## 3. Contrato de dados (camada banco)

### 3.1 Tabela trilhas_formacao

Campos:
- trilha_id
- nome_trilha
- descricao_conteudo
- carga_horaria
- link_midia

Volume inicial esperado: 6 registros.

### 3.2 Tabela eventos_estruturantes

Campos:
- evento_id
- nome_evento
- data
- horario
- local
- detalhes
- tema_palestra
- palestrantes

Volume inicial esperado: 24 registros.
Regra de local: valor deve existir na lista de regioes validas do dataset de BI.

### 3.3 Tabela mentores_diversidade

Campos:
- mentor_id
- nome_mentor
- empresa_origem
- cargo
- especialidade_esg
- disponibilidade

Volume inicial esperado: 10 registros.

## 4. Sugestao de contratos de API para backend

Endpoints de leitura sugeridos:
1. GET /api/formacoes
2. GET /api/experiencias
3. GET /api/mentorias

Regras minimas:
1. Retornar listas ordenadas por id ascendente no MVP.
2. Manter nomes de campos alinhados ao contrato de banco nesta primeira entrega.
3. Garantir serializacao de data e horario em formato consistente para frontend.

## 5. Consumo esperado para frontend

1. Tela Formacoes:
   - usar nome_trilha, descricao_conteudo, carga_horaria, link_midia.
2. Tela Experiencias:
   - usar nome_evento, data, horario, local, tema_palestra, palestrantes e detalhes.
3. Tela Mentorias:
   - usar nome_mentor, empresa_origem, cargo, especialidade_esg, disponibilidade.

Observacao:
- Se o frontend aplicar filtros, iniciar por filtros simples em memoria (ex.: disponibilidade e local), sem regras complexas de negocio neste MVP.

## 6. Evidencias de validacao

1. Flyway em ambiente limpo:
   - comando: .\\mvnw.cmd -Dtest=AppbitApplicationTests test
   - resultado: migration aplicada ate V5 sem falhas.
2. Contagens no banco:
   - comando: .\\mvnw.cmd -Dtest=MigrationV5CountsTest test
   - resultado: trilhas=6, eventos=24, mentores=10.
3. Validacao BI (executada em 07/07/2026):
   - comando: python scripts/valida_integracao_bi.py
   - saida obtida:
     - OK: candidatos=8, privacidade preservada
     - OK: antenas=132, regioes=24, sessoes e concentracao reconciliadas
     - OK: metricas empresariais demonstrativas=1152, segmentos=8
     - OK: servicos_mvp formacoes=6, eventos=24, mentorias=10
     - OK: locais de eventos mapeados para 24 regioes validas
     - OK: artefatos artificiais de candidatos ausentes
   - exit code: 0 (todas as assertivas passaram)
4. DTOs de backend padronizados (07/07/2026):
   - EventoEstruturanteResponseDTO: todos os 8 campos com @JsonProperty explicito.
   - MentorDiversidadeResponseDTO: todos os 6 campos com @JsonProperty explicito.

## 7. Checklist de aceite do handoff

- [x] Backend disponibiliza endpoints de leitura para os 3 modulos.
- [x] Frontend renderiza listas com dados reais do banco.
- [x] Data/BI confirma consistencia de local com as 24 regioes.
- [ ] Time valida comportamento em ambiente de homologacao.

## 8. Responsaveis sugeridos

1. Backend: implementacao/ajuste de endpoints.
2. Frontend: integracao e renderizacao das telas.
3. Dados/BI: validacao final de consistencia e monitoramento de regressao.
