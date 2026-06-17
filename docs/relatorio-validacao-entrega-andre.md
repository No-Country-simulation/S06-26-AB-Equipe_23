# Relatório de Validação — Entrega para André

> Referência: `docs/entrega-para-andre.md`
> Cobre as 9 tarefas listadas na seção "Tarefas sugeridas para o André"

---

## Tarefa 1 — Estrutura da base `antenas_sinal_tratadas.csv`

| Métrica | Valor |
|---|---|
| Total de linhas (registros) | 132 |
| Linhas completamente vazias | 0 |
| ECGIs duplicados | 0 |

Sem ECGIs duplicados. Base estruturalmente íntegra.

---

## Tarefa 2 — Coerência das colunas com o dicionário de dados

**Status:** ✅ OK

### Colunas esperadas (dicionário-antenas-sinal.md)

- ✅ `ecgi`
- ✅ `cluster`
- ✅ `municipio`
- ✅ `lat`
- ✅ `lon`
- ✅ `sessoes_3g`
- ✅ `sessoes_4g`
- ✅ `sessoes_5g`
- ✅ `sessoes_outros`
- ✅ `tecnologia_predominante`

**Ordem das colunas igual ao dicionário:** ✅ Sim

---

## Tarefa 3 — Latitude e Longitude

| Verificação | Resultado |
|---|---|
| Faixa esperada de latitude | `[-28.5, -26.5]` |
| Faixa esperada de longitude | `[-49.5, -47.5]` |
| Registros com coordenadas válidas | **132** / 132 |
| Latitudes vazias | ✅ OK |
| Longitudes vazias | ✅ OK |
| Latitudes fora da faixa | ✅ OK |
| Longitudes fora da faixa | ✅ OK |

---

## Validações complementares

### Municípios mapeados

Total: **4** município(s)

- Biguacu
- Florianopolis
- Palhoca
- Sao Jose

### Clusters mapeados

Total: **23** cluster(s)

- `AEROPORTO_HLZ`
- `BIGUACU_BR101_NORTE`
- `CAMPECHE`
- `CANASVIEIRAS`
- `CBD_BEIRAMAR`
- `CENTRO_HISTORICO`
- `COQUEIROS`
- `ESTREITO_CAPOEIRAS`
- `INGLESES`
- `JURERE`
- `LAGOA_CONCEICAO`
- `NORTE_ILHA`
- `PALHOCA_CENTRO`
- `PALHOCA_PEDRA_BRANCA`
- `RESIDENCIAL_NORTE`
- `SAO_JOSE_BARREIROS`
- `SAO_JOSE_CENTRO`
- `SAO_JOSE_KOBRASOL`
- `SAO_JOSE_ROÇADO`
- `SC401_CORREDOR`
- `TRINDADE`
- `UFSC`
- `VIA_EXPRESSA_CORREDOR`

### Tecnologias encontradas

Valores encontrados: `4G`

✅ Todas as tecnologias estão dentro do domínio esperado.

✅ Sem valores negativos nos campos de sessões.

---

---

## Tarefa 4 — Agregações por município, cluster e tecnologia

✅ **Concluído**. As agregações foram implementadas no script `scripts/gera_insights_regioes.py` e geraram com sucesso a base `data/processed/insights_regioes_agregado.csv`, contendo as totalizações por município e cluster.

---

## Tarefa 5 — Avaliação do payload de conectividade

Foi analisado o arquivo `mocks/insights_conectividade_payload.json` frente à base agregada real.

**Divergência Encontrada:**
- O mock atual possui apenas **3 pontos de mapa** cobrindo **2 clusters** (AEROPORTO_HLZ e BIGUACU_BR101_NORTE).
- A base agregada real (e a base de antenas) cobre **23 clusters** e **132 antenas**.
- Faltam 21 clusters no mock, o que o torna muito limitado para testes de frontend.

**Recomendação:**
Atualizar o arquivo `mocks/insights_conectividade_payload.json` gerando os pontos diretamente da base `insights_regioes_agregado.csv` para garantir que o frontend consiga testar o mapa completo com dados coerentes.

---

## Tarefas 6 e 8 — Cruzamento de Candidatos Fictícios e Regiões

✅ **Concluído**. O script `scripts/avalie_candidato_conectividade.py` foi executado para a massa de testes completa (`mocks/candidatos_teste.json`).

**Resultado do Cruzamento:**
Foram processados com sucesso todos os 8 candidatos. Como todos residem na Grande Florianópolis, as antenas mais próximas indicaram predominância de tecnologia **4G** com alto volume de sessões, garantindo um score de conectividade de **90 (Alta)** para todos.

Os detalhes do cruzamento e as antenas de referência foram exportados para o arquivo `data/processed/cruzamento_candidatos_regioes.json`. Este arquivo apoia a evolução do ETL, servindo de base para atualizar os mocks.

---

## Tarefa 7 — Sugestão de métricas regionais para o MVP

✅ **Concluído**. As métricas já foram bem definidas e isoladas das métricas de RH no documento `docs/separacao-metricas-dashboard.md`. Foram sugeridas métricas como: Quantidade de antenas, Sessões por tecnologia (3G/4G/5G) e o Indicador de conectividade. 

---

## Tarefa 9 — Validação da primeira versão de insights regionais

✅ **Concluído**. A base `data/processed/insights_regioes_agregado.csv` está íntegra e contém todas as totalizações requeridas (24 regiões agregadas). Este arquivo já pode ser considerado o "Golden Dataset" para fornecer os dados reais do endpoint `GET /insights/regioes`.

---

## Sumário Final de Aceite

| Tarefa | Status | Observação |
|---|---|---|
| 1. Validar a estrutura da base | ✅ Feito | Estrutura íntegra (132 registros). |
| 2. Conferir colunas vs dicionário | ✅ Feito | 100% de coerência. |
| 3. Verificar lat/lon | ✅ Feito | Todas as coordenadas válidas. |
| 4. Criar agregações | ✅ Feito | Base `insights_regioes_agregado.csv` gerada. |
| 5. Avaliar payload do mock | ⚠️ Pendente | Mock tem só 2 clusters de 23. Precisa de update. |
| 6. Evolução ETL (Candidatos x Regiões) | ✅ Feito | `cruzamento_candidatos_regioes.json` gerado. |
| 7. Métricas regionais | ✅ Feito | Documentadas em `separacao-metricas-dashboard.md`. |
| 8. Testar distância até antenas | ✅ Feito | Teste realizado com sucesso para 8 candidatos. |
| 9. Validar base de insights regionais | ✅ Feito | Base validada como fonte principal do endpoint. |
