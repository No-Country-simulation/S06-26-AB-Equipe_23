# Deploy no Render

Este projeto ja esta preparado para deploy com o arquivo render.yaml na raiz.

## O que foi preparado

- Backend (Spring Boot) como Web Service Docker
- Frontend (Vite/React) como Static Site
- Rewrite SPA para index.html
- Healthcheck no backend em /actuator/health
- Porta dinamica no backend via variavel PORT

## Arquivos relevantes

- render.yaml
- backend/Dockerfile

## Passo a passo

1. Suba o repositorio no GitHub com as alteracoes.
2. No Render, clique em New + e selecione Blueprint.
3. Escolha o repositorio e confirme o arquivo render.yaml.
4. Antes do primeiro deploy, ajuste os env vars sensiveis:
   - DB_HOST_APPBIT
   - DB_NAME_APPBIT
   - DB_USER_APPBIT
   - DB_PASSWORD_APPBIT
5. Ajuste APP_CORS_ALLOWED_ORIGINS para a URL real do frontend no Render.
6. Ajuste VITE_API_URL para a URL real do backend no Render.
7. Rode o deploy.

## Variaveis de ambiente obrigatorias

### Backend

- DB_HOST_APPBIT: host do MySQL
- DB_PORT_APPBIT: porta do MySQL (default 3306)
- DB_NAME_APPBIT: schema da aplicacao
- DB_USER_APPBIT: usuario do banco
- DB_PASSWORD_APPBIT: senha do banco
- DB_SSL_MODE: DISABLED ou REQUIRED conforme seu provedor
- JWT_SECRET: segredo JWT (32+ caracteres)
- JWT_EXPIRATION_MS: 86400000
- APP_CORS_ALLOWED_ORIGINS: URL publica do frontend

### Frontend

- VITE_API_URL: URL publica do backend

## Checklist rapido

- Backend retornando 200 em /actuator/health
- Frontend carregando sem erro de CORS
- Login funcionando no endpoint /login
- API acessivel via VITE_API_URL

## Observacoes

- O Render nao oferece MySQL nativo neste fluxo. Use um MySQL externo.
- Se seu provedor exigir SSL, altere DB_SSL_MODE para REQUIRED.
- O backend usa Flyway e aplicara migrations automaticamente no startup.
