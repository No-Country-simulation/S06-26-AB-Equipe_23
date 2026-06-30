-- Minimal schema for testing MatchingService
-- Uses simple types compatible with H2

CREATE TABLE IF NOT EXISTS dim_candidato (
    candidato_id BIGINT PRIMARY KEY,
    nome VARCHAR(120),
    cargo_alvo VARCHAR(120),
    nivel VARCHAR(40),
    regiao_id INT,
    cluster_residencia VARCHAR(80),
    municipio_residencia VARCHAR(80),
    cep VARCHAR(10),
    lat DECIMAL(12,6),
    lon DECIMAL(12,6),
    badge_diversidade VARCHAR(120),
    disponibilidade VARCHAR(40),
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS dim_regiao (
    regiao_id INT PRIMARY KEY AUTO_INCREMENT,
    cluster VARCHAR(50),
    municipio VARCHAR(100),
    lat DOUBLE,
    lon DOUBLE,
    perfil_regiao VARCHAR(100),
    fonte VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS dim_antena (
    ecgi VARCHAR(50) PRIMARY KEY,
    cluster VARCHAR(50),
    municipio VARCHAR(100),
    lat DOUBLE,
    lon DOUBLE,
    regiao_id INT,
    FOREIGN KEY (regiao_id) REFERENCES dim_regiao(regiao_id)
);

CREATE TABLE IF NOT EXISTS fact_concentracao_regional (
    concentracao_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cluster VARCHAR(50),
    municipio VARCHAR(100),
    data_referencia DATE,
    periodo VARCHAR(50),
    n_usuarios INT,
    n_sessoes INT,
    download_bytes BIGINT,
    upload_bytes BIGINT,
    dur_media_s INT,
    congestionamento_medio DOUBLE,
    drop_pct_medio DOUBLE,
    ecgi VARCHAR(50),
    FOREIGN KEY (ecgi) REFERENCES dim_antena(ecgi)
);
