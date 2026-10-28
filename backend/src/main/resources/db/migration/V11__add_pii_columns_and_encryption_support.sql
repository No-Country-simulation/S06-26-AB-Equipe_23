-- V11: Adiciona colunas para armazenamento de PII com suporte à criptografia AES-256 e consentimento LGPD
ALTER TABLE dim_candidato MODIFY COLUMN nome VARCHAR(255) NOT NULL;
ALTER TABLE dim_candidato ADD COLUMN email VARCHAR(255) NULL;
ALTER TABLE dim_candidato ADD COLUMN telefone VARCHAR(255) NULL;
ALTER TABLE dim_candidato ADD COLUMN cpf VARCHAR(255) NULL;
ALTER TABLE dim_candidato ADD COLUMN linkedin VARCHAR(500) NULL;
ALTER TABLE dim_candidato ADD COLUMN consentimento_lgpd BOOLEAN NOT NULL DEFAULT TRUE;

