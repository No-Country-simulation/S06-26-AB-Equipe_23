# AppBit — Backend

API REST para matching inteligente de candidatos a vagas com base em skills, geolocalização e diversidade.

Construída com **Spring Boot 4.1 · Java 21 · MySQL · Flyway · Spring Security + JWT**.

---

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Rodando localmente](#rodando-localmente)
- [Migrações de banco (Flyway)](#migrações-de-banco-flyway)
- [Autenticação](#autenticação)
- [Endpoints principais](#endpoints-principais)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Variáveis de ambiente — referência completa](#variáveis-de-ambiente--referência-completa)

---

## Visão geral

O AppBit conecta candidatos a vagas considerando:

- **Skills** e nível de proficiência
- **Geolocalização** (cluster/município de residência vs. localização da vaga)
- **Diversidade** (grupos sub-representados e badges de diversidade)
- **Matching** configurável com aprovação manual ou automática

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 4.1 (Web MVC, Data JPA, Security, Validation) |
| Banco de dados | MySQL 8+ |
| Migrations | Flyway |
| Autenticação | JWT via jjwt 0.12.x (HMAC-SHA256) |
| Mapeamento | MapStruct 1.6.3 |
| Boilerplate | Lombok |
| Build | Maven (Wrapper incluído) |
| Testes | JUnit 5 + H2 (in-memory) |

---

## Pré-requisitos

- **JDK 21+** — [Adoptium](https://adoptium.net/) ou similar
- **MySQL 8+** rodando localmente (ou via Docker)
- Maven não precisa ser instalado — use o wrapper `./mvnw`

### MySQL rápido com Docker

```bash
docker run -d \
  --name appbit-db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=appbit \
  -e MYSQL_USER=appbit_user \
  -e MYSQL_PASSWORD=sua_senha_aqui \
  -p 3306:3306 \
  mysql:8
```

---

## Configuração do ambiente

O projeto lê suas credenciais exclusivamente de **variáveis de ambiente** — nenhum segredo é hardcoded.

### 1. Crie o arquivo `.env`

```bash
cp backend/.env.example backend/.env
```

### 2. Preencha os valores reais

```env
DB_HOST_APPBIT=localhost
DB_PORT_APPBIT=3306
DB_NAME_APPBIT=appbit
DB_USER_APPBIT=appbit_user
DB_PASSWORD_APPBIT=sua_senha_aqui

JWT_SECRET=troque-por-uma-chave-super-secreta-com-pelo-menos-32-chars
JWT_EXPIRATION_MS=86400000

APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

> **Gerar uma `JWT_SECRET` segura:**
> ```bash
> openssl rand -base64 48
> ```

> O arquivo `.env` já está no `.gitignore` — nunca o commite.

### Como o Spring Boot encontra as variáveis

O `application.yaml` usa a sintaxe `${NOME_DA_VARIAVEL}` do Spring:

```yaml
datasource:
  url: jdbc:mysql://${DB_HOST_APPBIT}:${DB_PORT_APPBIT}/${DB_NAME_APPBIT}
  username: ${DB_USER_APPBIT}
  password: ${DB_PASSWORD_APPBIT}

jwt:
  secret: ${JWT_SECRET}
  expiration-ms: ${JWT_EXPIRATION_MS:86400000}   # valor após ':' é o default
```

O Spring resolve essas expressões na seguinte ordem de prioridade (maior → menor):

1. Argumentos de linha de comando (`--DB_HOST_APPBIT=...`)
2. **Variáveis de ambiente do sistema operacional** ← o mais comum
3. Arquivo `application.yaml` (valores default após `:`)

Ou seja: basta exportar as variáveis no shell antes de rodar, ou deixá-las no ambiente do container/servidor, que o Spring as encontra automaticamente — sem nenhuma biblioteca extra.

---

## Rodando localmente

```bash
cd backend

# Carregue as variáveis do .env no shell atual
export $(grep -v '^#' .env | xargs)

# Compile e suba a aplicação
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

---

## Migrações de banco (Flyway)

O Flyway roda automaticamente ao iniciar a aplicação e aplica os scripts em `src/main/resources/db/migration/` em ordem:

| Versão | Descrição |
|---|---|
| V1 | Schema inicial (regiões, antenas, candidatos, skills, vagas, matches) |
| V2 | Adiciona geolocalização (lat/lon) ao candidato |
| V3 | Seed de candidatos de teste |
| V4 | Cria tabela de usuários para autenticação |

Nenhuma ação manual é necessária — basta ter o banco criado e as variáveis configuradas.

---

## Autenticação

A API usa **JWT stateless**. O token deve ser enviado em todas as rotas protegidas no header:

```
Authorization: Bearer <token>
```

### Fazer login

```http
POST /login
Content-Type: application/json

{
  "email": "usuario@empresa.com",
  "senha": "senha123"
}
```

Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 86400000
}
```

Rotas públicas (sem token): `POST /login` e `GET /actuator/health`.

---

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/login` | Autenticação e geração de token |
| `GET` | `/candidatos` | Lista candidatos |
| `POST` | `/candidatos` | Cadastra candidato |
| `PUT` | `/candidatos/{id}` | Atualiza candidato |
| `GET` | `/vagas` | Lista vagas |
| `POST` | `/vagas` | Cadastra vaga |
| `GET` | `/skills` | Lista skills disponíveis |
| `POST` | `/matching` | Executa matching candidatos × vaga |
| `GET` | `/matches` | Lista matches realizados |
| `PUT` | `/matches/{id}/aprovacao` | Aprova ou rejeita um match |
| `GET` | `/regioes` | Lista regiões/clusters |
| `GET` | `/insights` | Métricas de diversidade e distribuição regional |

---

## Estrutura do projeto

```
backend/
├── src/main/java/br/com/appbit/appbit/
│   ├── config/          # Security, CORS, JWT, filtros
│   ├── controllers/     # Camada HTTP (REST)
│   ├── dtos/            # Objetos de transferência de dados
│   ├── entities/        # Entidades JPA
│   ├── repositories/    # Interfaces Spring Data
│   ├── services/        # Lógica de negócio
│   └── AppbitApplication.java
├── src/main/resources/
│   ├── application.yaml
│   └── db/migration/    # Scripts Flyway (V1…Vn)
├── .env.example         # Template de variáveis de ambiente
├── pom.xml
└── mvnw / mvnw.cmd
```

---

## Variáveis de ambiente — referência completa

| Variável | Obrigatória | Default | Descrição |
|---|---|---|---|
| `DB_HOST_APPBIT` | ✅ | — | Host do MySQL |
| `DB_PORT_APPBIT` | ✅ | — | Porta do MySQL |
| `DB_NAME_APPBIT` | ✅ | — | Nome do banco/schema |
| `DB_USER_APPBIT` | ✅ | — | Usuário do banco |
| `DB_PASSWORD_APPBIT` | ✅ | — | Senha do banco |
| `JWT_SECRET` | ✅ | — | Chave secreta JWT (mín. 32 chars) |
| `JWT_EXPIRATION_MS` | ❌ | `86400000` (24h) | Expiração do token em ms |
| `APP_CORS_ALLOWED_ORIGINS` | ❌ | `http://localhost:5173,http://localhost:4173` | Origens CORS permitidas (separadas por vírgula) |