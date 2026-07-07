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
    '95e01c3094415e1378e2bbe78b5df791e89bc44b05696aac8c6c182808d21586ec5561d665d19e1b4a0ad44443e36cad',
    'Recrutador Demo',
    'emp_001',
    TRUE
);
