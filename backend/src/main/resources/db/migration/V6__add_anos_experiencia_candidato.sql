-- V6: Adiciona anos_experiencia em dim_candidato para suporte ao motor de match
ALTER TABLE dim_candidato ADD COLUMN anos_experiencia INT NULL DEFAULT 0;

-- Preenche com os valores do JSON de referência (candidatos_teste.json)
UPDATE dim_candidato SET anos_experiencia = 1 WHERE candidato_id = 1; -- Ana Souza
UPDATE dim_candidato SET anos_experiencia = 1 WHERE candidato_id = 2; -- Bruno Martins
UPDATE dim_candidato SET anos_experiencia = 0 WHERE candidato_id = 3; -- Carla Nunes
UPDATE dim_candidato SET anos_experiencia = 2 WHERE candidato_id = 4; -- Diego Almeida
UPDATE dim_candidato SET anos_experiencia = 1 WHERE candidato_id = 5; -- Elisa Rocha
UPDATE dim_candidato SET anos_experiencia = 2 WHERE candidato_id = 6; -- Felipe Costa
UPDATE dim_candidato SET anos_experiencia = 1 WHERE candidato_id = 7; -- Gabriela Lima
UPDATE dim_candidato SET anos_experiencia = 0 WHERE candidato_id = 8; -- Henrique Barros
