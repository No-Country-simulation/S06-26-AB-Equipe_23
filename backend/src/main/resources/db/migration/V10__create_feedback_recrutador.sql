CREATE TABLE IF NOT EXISTS fact_feedback_candidato (
    feedback_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empresa_id VARCHAR(40) NOT NULL,
    vaga_id INT NULL,
    candidato_id VARCHAR(40) NOT NULL,
    decisao VARCHAR(20) NOT NULL,
    motivo_rejeicao VARCHAR(80) NULL,
    anotacoes_internas VARCHAR(1000) NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_vaga
        FOREIGN KEY (vaga_id) REFERENCES dim_vaga(vaga_id) ON DELETE SET NULL
);
