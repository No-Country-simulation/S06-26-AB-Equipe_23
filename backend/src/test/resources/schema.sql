-- Minimal schema for testing MatchingService
-- Uses simple types compatible with H2

CREATE TABLE IF NOT EXISTS dim_candidato (
    candidato_id BIGINT PRIMARY KEY,
    apelido_exibicao VARCHAR(255),
    status_identificacao VARCHAR(50),
    cargo_alvo VARCHAR(100),
    nivel VARCHAR(50),
    regiao VARCHAR(100),
    cluster_residencia VARCHAR(100),
    cep VARCHAR(10),
    lat DOUBLE,
    lon DOUBLE,
    modelo_trabalho_preferido VARCHAR(50),
    anos_experiencia INT,
    badge_diversidade VARCHAR(255),
    skills VARCHAR(1000)
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
