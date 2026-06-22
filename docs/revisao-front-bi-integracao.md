# Revisão Front + BI

## Fontes aceitas

- Shortlist: resposta de `POST /match`, derivada dos 8 registros de `mocks/candidatos_teste.json`.
- Regiões: resposta de `GET /insights/regioes`, derivada das antenas Anatel e sessões do dataset Vísent.

O dataset Vísent não contém candidatos. Os assinantes do dataset são usuários de telecomunicações e não podem ser convertidos em candidatos.

## Correções aplicadas

- removido o gerador local de candidatos adicionais;
- removidas as regiões hardcoded e o fallback silencioso para mocks inventados;
- contratos TypeScript alinhados aos payloads gerados pelas fontes oficiais;
- dashboard limitado a quantidade de candidatos, shortlist e score já fornecido pela fonte;
- painel regional limitado a antenas, coordenadas e sessões 3G/4G/5G observadas;
- removidas classificações arbitrárias de conectividade, alertas e recomendações de RH;
- métricas corporativas sem fonte, como turnover e meta ESG, não são exibidas.

## Dependências do backend

- `POST /match` deve retornar candidatos anonimizados e nunca expor `contato_pos_aprovacao` na triagem inicial.
- `GET /insights/regioes` deve servir o contrato documentado e derivado do Vísent.
- indisponibilidade da API deve aparecer como erro; o frontend não fabrica dados para encobrir a falha.

Os percentuais regionais representam participação das sessões observadas no dataset. Eles não comprovam velocidade, estabilidade ou cobertura garantida.
