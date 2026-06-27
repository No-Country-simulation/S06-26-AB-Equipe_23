-- V4: tabela de usuários (recrutadores) com senha em PBKDF2
-- O hash é armazenado no formato que o Spring Security PasswordEncoder espera:
--   {pbkdf2@SpringSecurity_5_8}... — gerado pelo Pbkdf2PasswordEncoder

CREATE TABLE dim_usuario (
    usuario_id   BIGINT        AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(180)  NOT NULL UNIQUE,
    senha_hash   VARCHAR(255)  NOT NULL,           -- hash PBKDF2 via Spring Security
    nome         VARCHAR(120)  NOT NULL,
    empresa_id   VARCHAR(60)   NULL,          
    ativo        BOOLEAN       NOT NULL DEFAULT TRUE,
    criado_em    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO dim_usuario (email, senha_hash, nome, empresa_id, ativo) VALUES (
    'recrutador@appbit.com.br',
    '{pbkdf2@SpringSecurity_v5_8}',
    'Recrutador Demo',
    'emp_001',
    TRUE
);
