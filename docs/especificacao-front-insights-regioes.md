# Especificação do frontend regional

Fonte: `GET /insights/regioes`.

## Cards

- regiões derivadas;
- municípios;
- antenas;
- sessões observadas.
- usuários observados no tensor, identificados como observações agregadas.

## Filtros

- município;
- cluster;
- tecnologia predominante.

## Mapa e tabela

O mapa usa `lat_media`, `lon_media`, `qtd_antenas` e `tecnologia_predominante_regiao`. A tabela exibe totais e percentuais 3G/4G/5G, índice relativo de concentração e período de pico. Não há alerta ou recomendação automática sem regra de negócio oficial.
