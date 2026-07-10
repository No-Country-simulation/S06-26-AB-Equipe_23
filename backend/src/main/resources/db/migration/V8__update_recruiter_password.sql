-- V8: Atualiza a senha do usuário recrutador padrão para uma mais forte
-- Nova senha em texto claro: Recrutador@Bit2026!
-- Hash gerada via Pbkdf2PasswordEncoder: ecd91a55f5c1d9d83a0d9ad9dfe7728ed2436b30a5bfa82f52a0f410d643aa65d9e7f6b27526d470f5c7fbac5f4f44b9

UPDATE dim_usuario
SET senha_hash = 'ecd91a55f5c1d9d83a0d9ad9dfe7728ed2436b30a5bfa82f52a0f410d643aa65d9e7f6b27526d470f5c7fbac5f4f44b9'
WHERE email = 'recrutador@appbit.com.br';
