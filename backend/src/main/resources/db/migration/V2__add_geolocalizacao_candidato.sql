ALTER TABLE dim_candidato
    ADD COLUMN cep VARCHAR(10)          NULL AFTER cluster_residencia,
    ADD COLUMN lat DECIMAL(12, 6)       NULL AFTER cep,
    ADD COLUMN lon DECIMAL(12, 6)       NULL AFTER lat;