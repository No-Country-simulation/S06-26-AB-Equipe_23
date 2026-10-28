ALTER TABLE dim_usuario
    ADD COLUMN tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'RECRUTADOR';

ALTER TABLE dim_usuario
    ADD COLUMN candidato_id INT NULL;

ALTER TABLE dim_usuario
    ADD CONSTRAINT uk_dim_usuario_candidato UNIQUE (candidato_id);

ALTER TABLE dim_usuario
    ADD CONSTRAINT fk_dim_usuario_candidato
        FOREIGN KEY (candidato_id) REFERENCES dim_candidato (candidato_id);
