# Guia de Contribuição — App BiT

Este documento explica como qualquer membro do time pode clonar, rodar, alterar e publicar o projeto.

---

## Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Clonar e configurar o projeto](#2-clonar-e-configurar-o-projeto)
3. [Rodar localmente](#3-rodar-localmente)
4. [Estrutura do projeto](#4-estrutura-do-projeto)
5. [Como fazer alterações](#5-como-fazer-alterações)
6. [Fluxo Git](#6-fluxo-git)
7. [Deploy em produção](#7-deploy-em-produção)
8. [Variáveis de ambiente](#8-variáveis-de-ambiente)
9. [Credenciais de acesso](#9-credenciais-de-acesso)
10. [Dúvidas frequentes](#10-dúvidas-frequentes)

---

## 1. Pré-requisitos

Instale antes de começar:

| Ferramenta | Versão mínima | Para quê |
|---|---|---|
| Git | qualquer | controle de versão |
| Java (JDK) | 21 | backend Spring Boot |
| Node.js | 18 | frontend React |
| npm | 9 | pacotes do frontend |
| MySQL | 8+ | banco de dados local |
| Python | 3.10+ | scripts de BI e validação |

---

## 2. Clonar e configurar o projeto

```bash
git clone https://github.com/No-Country-simulation/S06-26-AB-Equipe_23.git
cd S06-26-AB-Equipe_23
```

### Configurar o banco local

Abra o MySQL Workbench ou terminal MySQL e execute:

```sql
CREATE DATABASE IF NOT EXISTS appbit
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Configurar as variáveis do backend

Crie o arquivo `backend/.env` com suas credenciais locais:

```env
DB_HOST_APPBIT=localhost
DB_PORT_APPBIT=3306
DB_NAME_APPBIT=appbit
DB_USER_APPBIT=root
DB_PASSWORD_APPBIT=SUA_SENHA_MYSQL
JWT_SECRET=97c4e511488e02bf17dbec1451d0879e64e526487e411ea3ad858db4d94cd2f3
JWT_EXPIRATION_MS=86400000
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

> O Spring Boot lê essas variáveis do sistema, não diretamente do arquivo `.env`.
> No Windows, defina-as no terminal antes de rodar:
> ```powershell
> $env:DB_PASSWORD_APPBIT="SUA_SENHA"
> ```
> Ou configure no seu IDE (IntelliJ → Run Configuration → Environment Variables).

---

## 3. Rodar localmente

### Terminal 1 — Backend

```bash
cd backend
.\mvnw.cmd spring-boot:run        # Windows
./mvnw spring-boot:run            # Linux/Mac
```

Na primeira execução o Flyway cria todas as tabelas e insere os dados automaticamente (migrations V1 a V8).

Saída esperada:
```
Successfully validated 8 migrations
Tomcat started on port 8080
Started AppbitApplication in X seconds
```

### Terminal 2 — Frontend

```bash
npm install     # apenas na primeira vez
npm run dev
```

Frontend disponível em: `http://localhost:5173`

### Validação BI (opcional)

```bash
python scripts/valida_integracao_bi.py
```

---

## 4. Estrutura do projeto

```
S06-26-AB-Equipe_23/
├── backend/                  API Spring Boot (Java 21)
│   ├── src/main/java/        código fonte
│   ├── src/main/resources/
│   │   ├── application.yaml  configurações
│   │   ├── db/migration/     migrations Flyway (V1–V8)
│   │   └── mocks/            dados mock (insights, candidatos)
│   ├── src/test/             testes Java (50 testes)
│   └── Dockerfile            imagem Docker para deploy
├── frontend/                 React + TypeScript + Vite
│   ├── app/pages/            telas (Login, Home, Vagas, etc.)
│   ├── components/           componentes reutilizáveis
│   ├── lib/
│   │   ├── axios.ts          cliente HTTP com interceptor JWT
│   │   ├── appbitApi.ts      funções de chamada à API
│   │   └── appbitTypes.ts    tipos TypeScript
│   └── stores/               estado global
├── data/                     datasets CSV para BI e Power BI
├── scripts/                  scripts Python de geração e validação
├── tests/                    testes Python (7 testes)
├── mocks/                    payloads JSON de referência
├── docs/                     documentação técnica
└── vercel.json               configuração de roteamento SPA
```

---

## 5. Como fazer alterações

### Backend (Java)

- Entities ficam em `backend/src/main/java/.../entities/`
- DTOs em `.../dtos/`
- Controllers em `.../controllers/`
- Services em `.../services/`
- Migrations SQL em `backend/src/main/resources/db/migration/`

**Para criar uma nova migration:**

Siga o padrão de versionamento:
```
V9__descricao_curta.sql
```

O Flyway aplica automaticamente na ordem numérica ao subir a aplicação.

**Rodar os testes do backend:**
```bash
cd backend
.\mvnw.cmd test
```

### Frontend (React/TypeScript)

- Novas telas em `frontend/app/pages/`
- Componentes reutilizáveis em `frontend/components/`
- Para chamar um novo endpoint, adicione a função em `frontend/lib/appbitApi.ts`
- Para adicionar um tipo novo, edite `frontend/lib/appbitTypes.ts`

**Para adicionar uma nova rota:**

Edite `frontend/app/routes/router.tsx`.

### Scripts Python / BI

- Scripts de geração de dados ficam em `scripts/`
- Testes ficam em `tests/`
- Dados processados em `data/processed/` e `data/powerbi/`

---

## 6. Fluxo Git

O time usa o fluxo de branches por feature:

```
main                ← branch de produção (Render faz deploy automático)
└── feature/minha-feature   ← crie aqui suas alterações
```

### Passo a passo

```bash
# 1. Sempre parta da main atualizada
git checkout main
git pull

# 2. Crie sua branch
git checkout -b feature/nome-da-sua-feature

# 3. Faça suas alterações e commite
git add arquivo-alterado.java
git commit -m "feat: descreva o que foi feito"

# 4. Suba para o remoto
git push -u origin feature/nome-da-sua-feature

# 5. Abra um Pull Request no GitHub apontando para main
```

### Padrão de mensagem de commit

```
tipo: descrição curta no imperativo

tipos: feat | fix | docs | refactor | test | chore
```

Exemplos:
```
feat: adiciona endpoint de exportação de relatório PDF
fix: corrige validação de email no cadastro
docs: atualiza guia de contribuição
```

### Regras importantes

- **Nunca faça push direto na `main`** — use Pull Request
- Rode os testes antes de abrir PR: `.\mvnw.cmd test`
- O Render faz deploy automático quando um PR é mergeado na `main`

---

## 7. Deploy em produção

O projeto está hospedado em três serviços:

| Serviço | Plataforma | URL |
|---|---|---|
| Frontend | Render (Static Site) | https://appbit-frontend.onrender.com |
| Backend | Render (Web Service / Docker) | https://appbit-backend-0v3u.onrender.com |
| Banco de dados | Aiven (MySQL 8.4) | mysql-ad4643d-app-bit-26.i.aivencloud.com |

### Deploy é automático

Qualquer push ou merge na branch `main` dispara o deploy automático nos dois serviços do Render.

Tempo estimado de deploy:
- Frontend: ~2 minutos
- Backend (Docker): ~5 minutos

### Se precisar forçar um deploy manualmente

No painel do Render → serviço desejado → **Manual Deploy** → **Deploy latest commit**.

---

## 8. Variáveis de ambiente

### Backend (Render — serviço `appbit-backend`)

| Variável | Descrição |
|---|---|
| `DB_HOST_APPBIT` | Host do banco Aiven |
| `DB_PORT_APPBIT` | Porta do banco Aiven |
| `DB_NAME_APPBIT` | Nome do schema (`appbit`) |
| `DB_USER_APPBIT` | Usuário do banco (`avnadmin`) |
| `DB_PASSWORD_APPBIT` | Senha do banco Aiven |
| `DB_SSL_MODE` | Modo SSL (`REQUIRED` para Aiven) |
| `JWT_SECRET` | Chave HMAC-SHA512 para JWT (mín. 64 chars) |
| `JWT_EXPIRATION_MS` | Tempo de expiração do token (86400000 = 24h) |
| `APP_CORS_ALLOWED_ORIGINS` | URL do frontend (`https://appbit-frontend.onrender.com`) |
| `GOOGLE_CLIENT_ID` | (opcional) Client ID do Google OAuth2 |
| `GOOGLE_CLIENT_SECRET` | (opcional) Client Secret do Google OAuth2 |
| `SPRING_AUTOCONFIGURE_EXCLUDE` | Usado para desabilitar módulos (não altere) |

### Frontend (Render — serviço `appbit-frontend`)

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL do backend (`https://appbit-backend-0v3u.onrender.com`) |

---

## 9. Credenciais de acesso

### Usuário demo (para testes)

```
Email:  recrutador@appbit.com.br
Senha:  Recrutador@Bit2026!
```

### Testes automatizados

```bash
# Backend (Java) — 50 testes
cd backend && .\mvnw.cmd test

# Python — 7 testes
.\.venv-ci\Scripts\python.exe -m pytest tests/ -q

# Validação BI
python scripts/valida_integracao_bi.py
```

---

## 10. Dúvidas frequentes

**O backend não sobe localmente — erro de conexão com banco**

Verifique se o MySQL está rodando e se as variáveis de ambiente estão definidas no terminal. Confirme que o banco `appbit` existe.

**Erro `Schema validation failed` ao subir o backend**

Algum campo na entidade JPA não bate com o banco. Verifique se o tipo Java está correto (`BigDecimal` para `DECIMAL`, `String` para `VARCHAR`, etc.).

**Erro `ClientRegistrationRepository not found`**

OAuth2 está tentando inicializar sem as credenciais do Google. Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão definidos, ou deixe-os ausentes — o sistema funciona sem eles.

**O frontend mostra 403 em todas as chamadas**

O token JWT não está sendo enviado. Verifique se o login foi realizado e se o `localStorage` tem o item `token`. Limpe o cache do navegador e tente novamente.

**Flyway reclamou de checksum divergente**

Alguém editou uma migration que já foi aplicada no banco. Execute:
```bash
cd backend
.\mvnw.cmd flyway:repair -Dflyway.url=jdbc:mysql://localhost:3306/appbit -Dflyway.user=root -Dflyway.password=SUA_SENHA
```

**O Render não detecta as mudanças**

Verifique se o push foi feito na branch `main`. Se o deploy não disparou automaticamente, use **Manual Deploy** no painel.
