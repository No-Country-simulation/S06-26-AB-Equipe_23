# Relatório de Validação — Base de Antenas e Sinal

> Gerado automaticamente por `scripts/valida_base_antenas.py`
> Referência: `docs/entrega-para-andre.md` — Tarefas 1, 2 e 3

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

## Critério de aceite (entrega-para-andre.md)

| Critério | Status |
|---|---|
| Base tratada validada | ✅ |
| Dicionário coerente com o arquivo | ✅ |
| Lat/lon preenchidas e em faixa plausível | ✅ |
| Tecnologias válidas | ✅ |
| Sem sessões negativas | ✅ |
