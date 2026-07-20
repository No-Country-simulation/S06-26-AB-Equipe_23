# Relatório de Evolução Arquitetural e Garantia de Qualidade

Este documento detalha o conjunto de melhorias técnicas, resolução de gargalos operacionais e elevação da maturidade de código realizadas na plataforma **AppBiT Jobs**.

---

## 📋 Sumário
1. [Visão Geral do Salto de Qualidade](#1-visão-geral-do-salto-de-qualidade)
2. [Persistência Relacional de Vagas no Backend](#2-persistência-relacional-de-vagas-no-backend)
3. [Diagnóstico e Resolução de Indisponibilidade no Login (Render Cold Start)](#3-diagnóstico-e-resolução-de-indisponibilidade-no-login-render-cold-start)
4. [Métricas de Validação e Cobertura de Testes](#4-métricas-de-validação-e-cobertura-de-testes)
5. [Próximos Passos Recomendados](#5-próximos-passos-recomendados)

---

## 1. Visão Geral do Salto de Qualidade

A plataforma passou por uma transição fundamental: da dependência de mocks locais no frontend para um modelo verdadeiramente desacoplado, resiliente e persistente na nuvem.

### Destaques da Evolução:
- **Arquitetura Baseada em Dados Realistas:** Eliminação de simulações estáticas em memória no cliente (`VAGAS_MOCK`). Todas as vagas agora possuem ciclo de vida completo (criação, listagem, busca por ID e exclusão) persistido no MySQL/H2.
- **Resiliência em Ambientes de Nuvem (Serverless / Render):** Mitigação de timeouts e erros de indisponibilidade causados pelo modo de hibernação da hospedagem gratuita.
- **Triagem Dinâmica (Motor de Matching):** O motor de matching (`POST /match`) passou a consumir critérios diretamente do modelo de vaga recuperado do banco relacional.

---

## 2. Persistência Relacional de Vagas no Backend

### 2.1. Modelagem do Banco de Dados (Flyway Migration V9)
Criada a migration `V9__extend_dim_vaga_and_seed.sql` para estender a tabela `dim_vaga` com os atributos essenciais de vagas corporativas ESG:
- `descricao`: Texto detalhado dos requisitos da vaga.
- `modalidade`: `Presencial`, `Híbrido` ou `Remoto`.
- `area`: Área de atuação (ex: *Tecnologia*, *Dados*, *Produto*).
- `prioridade_mulheres`, `prioridade_negros`, `prioridade_pcd`, `prioridade_lgbt`: Banderas booleanas de preferência afirmativa.
- `esg_match`: Indicador percentual calculado de alinhamento com a agenda ESG da empresa.
- **Bridge Table (`bridge_vaga_skill`):** Associação de N:N entre `dim_vaga` e `dim_skill`, incluindo seed de 11 novas competências e vagas iniciais de demonstração.

### 2.2. Camada de Domínio e Serviços (Spring Boot)
- **`VagaEntity.java`:** Mapeamento JPA com os novos atributos e relacionamento.
- **`VagaCreateDTO.java`, `VagaUpdateDTO.java`, `VagaResponseDTO.java`:** Atualização dos contratos REST para trafegar a lista de `skills` e parâmetros de diversidade.
- **`VagaService.java` & `VagaMapper.java`:** Injeção de repositórios relacionais para persistência relacional transacional de habilidades em `bridge_vaga_skill`.

### 2.3. Integração no Frontend (React / TypeScript)
- **`appbitApi.ts` & `appbitTypes.ts`:** Exportação dos métodos da API REST (`buscarVagas()`, `buscarVagaPorId()`, `criarVaga()`, `deletarVaga()`).
- **`useVagas.ts`:** Refatorado para carregar vagas assincronamente via `GET /vagas` e publicar novas vagas com envio HTTP `POST /vagas`.
- **`shortlist.tsx`:** Atualizado para extrair o `vagaId` da URL e buscar dinamicamente os parâmetros de triagem no backend.

---

## 3. Diagnóstico e Resolução de Indisponibilidade no Login (Render Cold Start)

### 3.1. Causa Raiz do Problema
Ao tentar efetuar login na plataforma hospedada no Render (plano gratuito), usuários frequentemente viam a mensagem:
> `"Serviço temporariamente indisponível. Tente novamente."`

**Causas Técnicas:**
1. **Render Cold Start:** O container Docker do backend hiberna após 15 minutos sem tráfego. O startup do Spring Boot + Flyway leva de 45 a 60 segundos.
2. **Requisição Reativa e Timeout Curto:** O acionamento do backend só ocorria no momento do clique do usuário em "Entrar". O tempo limite da requisição (timeout do Axios) expirava antes do container concluir a inicialização, disparando erro de rede (`ECONNABORTED` / `!error.response`).
3. **Inconsistência de URL Fallback:** O fallback secundário de URL em partes do código apontava para `http://localhost:8080`.

### 3.2. Solução Implementada

| Mecanismo | O que faz | Benefício |
|---|---|---|
| **Pre-Warm Silencioso** | Dispara `api.get('/actuator/health')` assim que a página de Login carrega | O servidor acorda na nuvem enquanto o usuário digita o e-mail/senha. |
| **Auto-Retry Inteligente** | Em caso de falha de conexão inicial, tenta automaticamente reenviar a requisição após 3 segundos | Evita que o usuário precise clicar várias vezes manualmente. |
| **Timeout de 90 segundos** | Ajustado no `axios.ts` de 50s para 90s | Acomoda a inicialização completa do Spring Boot sem derrubar a conexão. |
| **Mensagens Orientadas** | Informa com clareza: *"Conectando ao servidor (inicialização no Render)..."* | Melhora a transparência e experiência do usuário (UX). |
| **URL Base Padronizada** | Aponta para `https://appbit-backend-0v3u.onrender.com` em todos os fallbacks | Elimina redirecionamentos para localhost em produção. |

---

## 4. Métricas de Validação e Cobertura de Testes

Todas as alterações passaram por uma bateria de validação contínua:

| Suite de Testes | Componente | Resultado |
|---|---|---|
| **Backend Java (JUnit/Spring Boot)** | Entidades, Mappers, Serviços e Matching | **50 / 50 Aprovados** (100%) ✅ |
| **Python CI/CD (Pytest)** | Reconciliação BI e contratos | **7 / 7 Aprovados** (100%) ✅ |
| **Validação BI (`valida_integracao_bi.py`)** | Antenas, Regiões e Candidatos | **Contratos Reconciliados** ✅ |
| **ESLint Frontend (`npm run lint`)** | Análise estática de código React/TS | **0 Erros / 0 Avisos** ✅ |
| **Vite Build (`npm run build`)** | Compilação de produção do frontend | **Sucesso em 3.62s** ✅ |

---

## 5. Próximos Passos Recomendados

1. **Dashboard de Métricas ESG:** Expandir os gráficos do painel de empregabilidade para exibir o alinhamento ESG em tempo real baseado no banco de dados.
2. **Ping Periódico (Keep-Alive Cron):** Configurar um ping HTTP simples (via GitHub Actions ou UptimeRobot) no endpoint `/actuator/health` a cada 10 minutos para manter o backend no Render permanentemente aquecido durante o horário comercial.
