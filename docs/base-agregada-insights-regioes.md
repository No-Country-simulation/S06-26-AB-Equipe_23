# Base agregada de regiões

Arquivo: `data/processed/insights_regioes_agregado.csv`.

Cada linha representa um par `municipio` + `cluster` derivado do cadastro de antenas. Os campos são:

- `lat_media`, `lon_media`;
- `qtd_antenas`;
- `total_sessoes_3g`, `total_sessoes_4g`, `total_sessoes_5g`, `total_sessoes_outros`;
- `total_sessoes`;
- percentuais por tecnologia;
- `tecnologia_predominante_regiao`;
- `usuarios_observados_total`, `periodo_pico` e `usuarios_observados_periodo_pico`;
- `indice_concentracao_relativa`, normalizado pelo maior volume regional observado;
- fontes das antenas e sessões.

A base não mede velocidade, latência ou disponibilidade e não atribui nota subjetiva de conectividade.
