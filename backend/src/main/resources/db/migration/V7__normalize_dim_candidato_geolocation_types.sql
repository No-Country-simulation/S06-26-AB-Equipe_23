-- V7: normaliza tipos de geolocalizacao para manter compatibilidade com validacao JPA
ALTER TABLE dim_candidato MODIFY COLUMN lat DECIMAL(12,6) NULL;
ALTER TABLE dim_candidato MODIFY COLUMN lon DECIMAL(12,6) NULL;
