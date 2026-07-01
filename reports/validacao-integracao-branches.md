# Validação de integração das branches

## Contrato consolidado

- `POST /match`: usa `mocks/candidatos_teste.json`, com 8 candidatos, e omite `contato_pos_aprovacao`.
- `GET /insights/regioes`: usa agregações de `antenas_flp.csv` e `tensor_mobilidade.csv` do Vísent.
- Frontend e BI não possuem fallback com registros inventados.

## Pendências de integração

- implementar a leitura real das fontes no backend;
- validar os dois endpoints com os contratos de `docs/contrato-api.md`;
- manter a liberação de contato em fluxo separado e autenticado;
- testar o frontend conectado à API, sem mocks silenciosos.

Os 8 candidatos pertencem ao mock oficial do projeto. O Vísent fornece dados de telecomunicações, não candidatos.
