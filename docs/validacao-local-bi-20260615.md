# Validação local - Entregas BI Pedro

## Escopo solicitado

1. Apoiar o time de desenvolvimento no entendimento da modelagem conceitual do SQL Server.
2. Finalizar extração e limpeza do dataset Vísent/Anatel via Python/Excel, isolando coordenadas das antenas e faixas 3G/4G/5G.
3. Fazer o Score Match, a fórmula matemática para calcular o match da vaga com candidatos.

## Status local

| Item | Status |
|---|---|
| Modelagem SQL Server explicada para devs | Feito localmente |
| Extração de antenas/coordenadas | Feito localmente |
| Extração 3G/4G/5G | Feito localmente com o `tensor_mobilidade.csv` |
| Score Match | Feito localmente |

## Observação importante

O repositório do hackathon não versiona o `tensor_mobilidade.csv` por ser grande. Ele está indicado no `LARGE_FILES.md` via Google Drive. O arquivo bruto foi usado apenas no processamento local e não deve ser enviado ao GitHub.

A tecnologia 3G/4G/5G depende do campo `rat_type` desse arquivo:

- `WCDMA` = 3G
- `LTE` = 4G
- `NR` = 5G

O resultado leve gerado para validação está em `data/processed/antenas_sinal_tratadas.csv`.

## Como rodar localmente

```powershell
python .\scripts\processa_dataset_visent_local.py `
  --dataset-root ..\..\external\appbit-hackathon\dataset-visent `
  --out-dir .\data\processed
```

Se o `tensor_mobilidade.csv` estiver disponível:

```powershell
python .\scripts\processa_dataset_visent_local.py `
  --dataset-root ..\..\external\appbit-hackathon\dataset-visent `
  --out-dir .\data\processed `
  --mobility-path "CAMINHO\PARA\tensor_mobilidade.csv"
```
