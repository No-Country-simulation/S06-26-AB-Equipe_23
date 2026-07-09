CREATE TABLE IF NOT EXISTS dim_regiao (
    regiao_id INT AUTO_INCREMENT PRIMARY KEY,
    cluster VARCHAR(80) NOT NULL,
    municipio VARCHAR(80) NOT NULL,
    lat DECIMAL(12,6) NULL,
    lon DECIMAL(12,6) NULL,
    perfil_regiao VARCHAR(120) NULL,
    fonte VARCHAR(80) NOT NULL DEFAULT 'Visent CDRView'
);

CREATE TABLE IF NOT EXISTS dim_antena (
    ecgi VARCHAR(20) PRIMARY KEY,
    regiao_id INT NULL,
    cluster VARCHAR(80) NOT NULL,
    municipio VARCHAR(80) NOT NULL,
    lat DECIMAL(12,6) NOT NULL,
    lon DECIMAL(12,6) NOT NULL,
    CONSTRAINT fk_dim_antena_regiao
        FOREIGN KEY (regiao_id) REFERENCES dim_regiao(regiao_id)
);

CREATE TABLE IF NOT EXISTS dim_candidato (
    candidato_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cargo_alvo VARCHAR(120) NULL,
    nivel VARCHAR(40) NOT NULL,
    regiao_id INT NULL,
    cluster_residencia VARCHAR(80) NULL,
    municipio_residencia VARCHAR(80) NULL,
    grupo_subrepresentado VARCHAR(120) NULL,
    badge_diversidade VARCHAR(120) NULL,
    disponibilidade VARCHAR(40) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_dim_candidato_regiao
        FOREIGN KEY (regiao_id) REFERENCES dim_regiao(regiao_id)
);

CREATE TABLE IF NOT EXISTS dim_skill (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_skill VARCHAR(80) NOT NULL UNIQUE,
    categoria VARCHAR(80) NULL
);

CREATE TABLE IF NOT EXISTS bridge_candidato_skill (
    candidato_id INT NOT NULL,
    skill_id INT NOT NULL,
    nivel_skill VARCHAR(40) NULL,
    PRIMARY KEY (candidato_id, skill_id),
    CONSTRAINT fk_bridge_candidato
        FOREIGN KEY (candidato_id) REFERENCES dim_candidato(candidato_id),
    CONSTRAINT fk_bridge_skill
        FOREIGN KEY (skill_id) REFERENCES dim_skill(skill_id)
);

CREATE TABLE IF NOT EXISTS dim_vaga (
    vaga_id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id VARCHAR(40) NOT NULL,
    titulo VARCHAR(160) NOT NULL,
    nivel VARCHAR(40) NOT NULL,
    regiao_alvo_id INT NULL, /* ! modificado e adicionado */
    CONSTRAINT fk_dim_vaga_regiao
    FOREIGN KEY (regiao_alvo_id) REFERENCES dim_regiao(regiao_id),
    diversidade_minima DECIMAL(5,2) NULL,
    anti_vies BOOLEAN NOT NULL DEFAULT TRUE,
    criada_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bridge_vaga_skill (
    vaga_id INT NOT NULL,
    skill_id INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    PRIMARY KEY (vaga_id, skill_id),
    CONSTRAINT fk_bridge_vaga
        FOREIGN KEY (vaga_id) REFERENCES dim_vaga(vaga_id),
    CONSTRAINT fk_bridge_vaga_skill
        FOREIGN KEY (skill_id) REFERENCES dim_skill(skill_id)
);

CREATE TABLE IF NOT EXISTS fact_concentracao_regional (
    concentracao_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ecgi VARCHAR(20) NOT NULL,
    cluster VARCHAR(80) NOT NULL,
    municipio VARCHAR(80) NOT NULL,
    data_referencia DATE NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    n_usuarios INT NOT NULL,
    n_sessoes INT NULL,
    download_bytes BIGINT NULL,
    upload_bytes BIGINT NULL,
    dur_media_s INT NULL,
    congestionamento_medio DECIMAL(12,6) NULL,
    drop_pct_medio DECIMAL(12,6) NULL,
    CONSTRAINT fk_fact_concentracao_antena
        FOREIGN KEY (ecgi) REFERENCES dim_antena(ecgi)
);

CREATE TABLE IF NOT EXISTS fact_fluxo_regional (
    fluxo_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cluster_origem VARCHAR(80) NOT NULL,
    municipio_origem VARCHAR(80) NOT NULL,
    cluster_destino VARCHAR(80) NOT NULL,
    municipio_destino VARCHAR(80) NOT NULL,
    n_usuarios INT NOT NULL,
    n_viagens INT NULL,
    dist_media_km DECIMAL(12,6) NULL,
    periodo_predominante VARCHAR(20) NULL
);

CREATE TABLE IF NOT EXISTS fact_match (
    match_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vaga_id INT NOT NULL,
    candidato_id INT NOT NULL,
    score_match DECIMAL(5,2) NOT NULL,
    score_skills DECIMAL(5,2) NOT NULL,
    score_nivel DECIMAL(5,2) NOT NULL,
    score_regiao DECIMAL(5,2) NOT NULL,
    score_diversidade DECIMAL(5,2) NOT NULL,
    badge_diversidade VARCHAR(120) NULL,
    justificativa VARCHAR(500) NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fact_match_vaga
        FOREIGN KEY (vaga_id) REFERENCES dim_vaga(vaga_id),
    CONSTRAINT fk_fact_match_candidato
        FOREIGN KEY (candidato_id) REFERENCES dim_candidato(candidato_id)
);