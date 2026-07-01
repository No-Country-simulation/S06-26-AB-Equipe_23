# Validação local - Dataset Vísent/Anatel

## Arquivos gerados

- `antenas_tratadas.csv`
- `concentracao_regional.csv`
- `fluxos_regionais.csv`
- `antenas_sinal_tratadas.csv` somente se `tensor_mobilidade.csv` estiver disponível

## Status 3G/4G/5G

- Status: processado
- Arquivo esperado: `NoCountry_BiT_App\local_development\validacao_alessandra_20260615\tmp_large\tensor_mobilidade.csv`

A tecnologia de rede depende do campo `rat_type` no `tensor_mobilidade.csv`:

- `WCDMA` = 3G
- `LTE` = 4G
- `NR` = 5G