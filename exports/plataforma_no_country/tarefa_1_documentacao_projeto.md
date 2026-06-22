# App BiT - documentação do projeto

## Fontes e escopo

- Candidatos: `mocks/candidatos_teste.json`, arquivo de entrada oficial do projeto com 8 registros fictícios de teste.
- Infraestrutura: `antenas_flp.csv`, cadastro de 132 ERBs reais da Anatel distribuído no dataset Vísent.
- Sessões: `tensor_mobilidade.csv`, dataset Vísent de telecomunicações usado para agregar sessões 3G, 4G e 5G por antena e região.

Os assinantes do Vísent são usuários de telecomunicações e não podem ser transformados em candidatos. Nenhum candidato adicional, coordenada ausente, classificação de qualidade, turnover ou meta ESG é inventado.

## Rotas do MVP

- `POST /match`: lê a fonte oficial de candidatos e retorna a shortlist anonimizada.
- `GET /insights/regioes`: retorna agregações regionais derivadas das antenas e sessões Vísent.

O retorno inicial não expõe `contato_pos_aprovacao`. Os contatos somente podem ser liberados por uma ação explícita posterior.

## Indicadores disponíveis

- quantidade de regiões derivadas e antenas;
- latitude e longitude médias;
- sessões observadas por tecnologia;
- percentuais de sessões 3G, 4G, 5G e outros;
- tecnologia predominante por volume de sessões.

Percentuais de sessões não são teste de velocidade nem garantia de cobertura. Turnover, headcount e metas ESG dependem de uma fonte empresarial que ainda não foi entregue e não são exibidos como dados reais.

## Validação desta versão

- Candidatos na fonte: 8
- Candidatos no mock de resposta `/match`: 8
- Linhas da shortlist Power BI: 8
- Regiões derivadas: 24
- Linhas de regiões para Power BI: 24
- Cruzamentos candidato/região: 8

Consulte `docs/linhagem-dados-oficiais.md` para a linhagem completa.
