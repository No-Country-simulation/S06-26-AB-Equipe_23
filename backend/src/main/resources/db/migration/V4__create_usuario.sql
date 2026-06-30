-- V4: Tabela de usuários (recrutadores) com autenticação
-- Senha armazenada em PBKDF2 via Spring Security PasswordEncoder
-- Formato: {pbkdf2@SpringSecurity_v5_8}$salt$iterations$hash

CREATE TABLE dim_usuario (
    usuario_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    empresa_id VARCHAR(60) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_dim_usuario_email UNIQUE KEY (email)
);

CREATE INDEX idx_dim_usuario_email ON dim_usuario(email);
CREATE INDEX idx_dim_usuario_ativo ON dim_usuario(ativo);

INSERT IGNORE INTO dim_usuario (email, senha_hash, nome, empresa_id, ativo) VALUES (
    'recrutador@appbit.com.br',
    '{pbkdf2@SpringSecurity_v5_8}e5d79b6d6bb5360b99cd519249f120ce7a28ce0d46b96e29145ecc64fbf242a80df010ee1cc21e2e5887fb',
    'Recrutador Demo',
    'emp_001',
    TRUE
);
