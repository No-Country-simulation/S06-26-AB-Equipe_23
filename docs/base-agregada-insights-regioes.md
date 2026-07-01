# Base agregada de regiões

Arquivo: `data/processed/insights_regioes_agregado.csv`.

Cada linha representa um par `municipio` + `cluster` derivado do cadastro de antenas. Os campos são:

- `lat_media`, `lon_media`;
- `qtd_antenas`;
- `total_sessoes_3g`, `total_sessoes_4g`, `total_sessoes_5g`, `total_sessoes_outros`;
- `total_sessoes`;
- percentuais por tecnologia;
- `tecnologia_predominante_regiao`;
- `qualidade_sinal` (muito_alta, alta, media, baixa, sem_dado);
- `indicador_conectividade` (idêntico a qualidade_sinal);
- `usuarios_observados_total`, `periodo_pico` e `usuarios_observados_periodo_pico`;
- `indice_concentracao_relativa`, normalizado pelo maior volume regional observado;
- fontes das antenas e sessões.

A base não mede velocidade direta, latência ou disponibilidade; as categorias de qualidade representam uma derivação baseada em tecnologia predominante e volume de sessões.
