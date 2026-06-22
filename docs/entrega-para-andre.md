# Entrega para André

## Arquivos válidos

- `mocks/candidatos_teste.json`: entrada oficial do projeto com 8 candidatos.
- `data/processed/antenas_sinal_tratadas.csv`: 132 antenas Anatel e sessões Vísent tratadas.
- `data/processed/insights_regioes_agregado.csv`: 24 regiões derivadas por município/cluster.
- `data/powerbi/insights_regioes_powerbi.csv`: importação regional no Power BI.
- `data/powerbi/shortlist_candidatos_powerbi.csv`: shortlist anonimizada dos 8 candidatos.

## Regras

- Não transformar os 200.000 assinantes de telecomunicações do Vísent em candidatos.
- Não criar candidatos, coordenadas ou classificações sem fonte.
- Tratar sessões 3G/4G/5G como volume observado, não como teste de velocidade.
- Preservar a anonimização até a aprovação explícita do candidato.

Consulte `docs/linhagem-dados-oficiais.md` para a linhagem completa.
