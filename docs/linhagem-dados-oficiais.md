# Linhagem dos dados oficiais

## Regra do projeto

Nenhum registro ou indicador pode ser criado para aumentar volume visual. Toda saída deve apontar para um arquivo de entrada existente.

## Candidatos

- Entrada: `mocks/candidatos_teste.json`
- Quantidade atual: 8 candidatos
- Natureza: mock oficial do projeto, declarado como fictício no próprio arquivo
- Uso: shortlist, contrato do `POST /match` e testes do MVP
- Restrição: `contato_pos_aprovacao` não pode aparecer na shortlist inicial

O dataset Vísent não contém candidatos de recrutamento. O arquivo `assinantes.csv` contém assinantes sintéticos de telecomunicações e não pode ser convertido em candidato.

## Dados Vísent

| Saída | Entrada oficial |
|---|---|
| Cadastro de antenas | `dataset-visent/referencias/antenas_flp.csv` |
| Perfil agregado de assinantes | `dataset-visent/referencias/assinantes.csv` |
| Concentração por antena/período | `dataset-visent/tensores/tensor_concentracao.csv` |
| Origem e destino | `dataset-visent/tensores/tensor_od.csv` |
| Fluxo em vias | `dataset-visent/tensores/tensor_fluxo_vias.csv` |
| Tempo/distância entre zonas | `dataset-visent/tensores/tensor_tempo_deslocamento.csv` |
| Sessões 3G/4G/5G | `dataset-visent/tensores/tensor_mobilidade.csv` |

## Derivações permitidas

- soma e percentual de sessões por tecnologia;
- média de coordenadas das antenas por município e cluster;
- tecnologia predominante pelo maior volume de sessões;
- distância Haversine entre coordenada informada e antenas cadastradas;
- contagens, médias e distribuições calculadas diretamente dos oito candidatos.

## Derivações proibidas sem nova fonte oficial

- criar candidatos adicionais;
- transformar assinantes Vísent em candidatos;
- inventar coordenadas ou geocodificar por fallback;
- classificar conectividade como alta, média ou baixa com limites não fornecidos;
- afirmar velocidade ou cobertura a partir de volume de sessões;
- inventar turnover, headcount, desligamentos ou metas ESG;
- recalcular `score_match` sem fórmula oficial validada pelo time.
