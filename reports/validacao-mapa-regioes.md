# Validacao do Mapa de Regioes

## Base validada

- Arquivo: `data/processed/insights_regioes_agregado.csv`
- Total de regioes: 24
- Municipios: Biguacu, Florianopolis, Palhoca, Sao Jose
- Latitude media: -27.693087 a -27.432597
- Longitude media: -48.690179 a -48.395133

## Distribuicao dos indicadores

- `alta`: 24
- `media`: 0
- `baixa`: 0
- `alerta_exclusao_digital`: 0
- `sem_dado`: 0

## Leitura analitica

Todas as 24 regioes ficaram classificadas como `alta` no output atual.
Isso ocorre porque a regra validada considera `5G >= 20%` ou `4G + 5G >= 75% com 4G >= 50%`, e todos os clusters atuais atendem a esse criterio.

Com essa distribuicao, o mapa nao deve exibir diferenca de cores entre regioes no dataset atual.
A legenda deve permanecer preparada para `media`, `baixa`, `alerta_exclusao_digital` e `sem_dado`, porque essas categorias podem aparecer com outra base ou com novas regioes.

## Artefato visual local

- Guia oficial Power BI: `docs/guia-power-bi-validacao-regioes.md`
- HTML: `exports/validacao_mapa_regioes.html`

O Power BI e a ferramenta principal para validacao grafica do projeto.
O HTML e apenas uma previa local versionavel para conferencia rapida.

## Tabela de conferencia

| Municipio | Cluster | Lat media | Lon media | Indicador | 4G | 5G |
|---|---|---:|---:|---|---:|---:|
| Biguacu | BIGUACU_BR101_NORTE | -27.516721 | -48.645949 | alta | 60.18% | 22.48% |
| Florianopolis | AEROPORTO_HLZ | -27.689101 | -48.55135 | alta | 60.25% | 22.61% |
| Florianopolis | CAMPECHE | -27.693087 | -48.503058 | alta | 60.16% | 22.72% |
| Florianopolis | CANASVIEIRAS | -27.432597 | -48.459966 | alta | 60.24% | 22.72% |
| Florianopolis | CBD_BEIRAMAR | -27.588457 | -48.546862 | alta | 60.19% | 22.7% |
| Florianopolis | CENTRO_HISTORICO | -27.60395 | -48.546242 | alta | 60.23% | 22.62% |
| Florianopolis | COQUEIROS | -27.594117 | -48.571572 | alta | 60.14% | 22.57% |
| Florianopolis | ESTREITO_CAPOEIRAS | -27.596671 | -48.589301 | alta | 60.19% | 22.73% |
| Florianopolis | INGLESES | -27.44702 | -48.395133 | alta | 60.2% | 22.79% |
| Florianopolis | JURERE | -27.451011 | -48.507101 | alta | 60.4% | 22.53% |
| Florianopolis | LAGOA_CONCEICAO | -27.603791 | -48.457382 | alta | 60.31% | 22.71% |
| Florianopolis | NORTE_ILHA | -27.477624 | -48.459756 | alta | 60.22% | 22.61% |
| Florianopolis | RESIDENCIAL_NORTE | -27.537876 | -48.507835 | alta | 60.26% | 22.78% |
| Florianopolis | SC401_CORREDOR | -27.568806 | -48.516554 | alta | 60.25% | 22.61% |
| Florianopolis | TRINDADE | -27.597023 | -48.52391 | alta | 60.27% | 22.6% |
| Florianopolis | UFSC | -27.593599 | -48.5541 | alta | 60.25% | 22.63% |
| Florianopolis | VIA_EXPRESSA_CORREDOR | -27.609272 | -48.585003 | alta | 60.0% | 22.95% |
| Palhoca | PALHOCA_CENTRO | -27.637456 | -48.666794 | alta | 60.14% | 22.58% |
| Palhoca | PALHOCA_PEDRA_BRANCA | -27.632075 | -48.690179 | alta | 60.03% | 22.82% |
| Palhoca | SAO_JOSE_BARREIROS | -27.673358 | -48.656689 | alta | 60.16% | 22.67% |
| Sao Jose | ESTREITO_CAPOEIRAS | -27.581231 | -48.606435 | alta | 60.23% | 22.65% |
| Sao Jose | SAO_JOSE_CENTRO | -27.609003 | -48.62332 | alta | 60.2% | 22.56% |
| Sao Jose | SAO_JOSE_KOBRASOL | -27.594154 | -48.626605 | alta | 60.23% | 22.69% |
| Sao Jose | SAO_JOSE_ROÇADO | -27.569376 | -48.640131 | alta | 60.2% | 22.72% |
