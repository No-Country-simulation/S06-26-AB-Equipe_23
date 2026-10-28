# Checklist Operacional — Próximos Passos (Pós-MVP)

Este documento centraliza as tarefas práticas, prioridades e critérios de aceite para a transição do **AppBiT** do estágio de MVP validado para a versão de produção comercial (*Production-Ready*).

---

## 🧭 Visão Geral das Fases

```text
[MVP Concluído v1.0.0]
        │
        ├── Fase 1: Infraestrutura, Estabilidade & Confiabilidade (Curto Prazo)
        ├── Fase 2: Portal do Candidato & Expansão de UX (Médio Prazo)
        ├── Fase 3: Segurança Avançada, Conformidade LGPD & Hardening
        └── Fase 4: Inteligência, Integrações B2B & Validação com o Mercado
```

---

## 📋 Checklist por Fase

### Fase 1 — Infraestrutura, Estabilidade & Nuvem (Curto Prazo: 1 a 2 semanas)
Foco: Garantir que a plataforma esteja 100% disponível para testes e demonstrações corporativas sem atrasos de *cold start*.

- [x] **1.1 Mitigação do Cold Start no Render:**
  - [x] Atualizar cron do workflow [keep-alive.yml](file:///c:/Repositorio/S06-26-AB-Equipe_23/.github/workflows/keep-alive.yml) para ping a cada 14 minutos no backend e frontend web.
  - [ ] Avaliar contratação de plano de instância contínua (ex: Render Starter ou Railway).
- [ ] **1.2 Pipeline de Staging vs Produção:**
  - [ ] Configurar branch `develop` conectada ao ambiente de testes (Staging).
  - [ ] Proteger branch `main` exigindo aprovação de PR e sucesso em todos os testes do CI.
- [ ] **1.3 Observabilidade & Alertas de Erros:**
  - [ ] Integrar **Sentry** no frontend React para captura de erros de tela em tempo real.
  - [ ] Integrar **Sentry** no Spring Boot para rastreamento de exceções e stack traces não tratados.
- [x] **1.4 Testes End-to-End (E2E) no CI:**
  - [x] Adicionar execução do Playwright ([responsive.spec.ts](file:///c:/Repositorio/S06-26-AB-Equipe_23/e2e/responsive.spec.ts)) como job obrigatório no GitHub Actions ([full-mvp-ci.yml](file:///c:/Repositorio/S06-26-AB-Equipe_23/.github/workflows/full-mvp-ci.yml)).


---

### Fase 2 — Produto, Candidatos & Experiência de Uso (Médio Prazo: 2 a 4 semanas)
Foco: Fechar o ciclo bidirecional da plataforma (Recrutador ⟷ Candidato).

- [x] **2.1 Portal do Candidato (Self-Service):**
  - [x] Criar tela pública de cadastro para candidatos ([CadastroCandidato.tsx](file:///c:/Repositorio/S06-26-AB-Equipe_23/frontend/app/pages/Candidato/CadastroCandidato.tsx)).
  - [x] Formulário de preenchimento de perfil: cargo alvo, nível de senioridade, anos de experiência e modalidade de trabalho.
  - [x] Multi-seleção de competências técnicas com chips interativos e adição de tags personalizadas.
  - [x] Associação e persistência automática de skills no banco relacional via backend (`bridge_candidato_skill`).
- [x] **2.2 Consentimento e Privacidade (LGPD do Candidato):**
  - [x] Checkbox obrigatório de aceite dos Termos de Uso e Política de Privacidade na inscrição.
  - [x] Explicação transparente sobre o processo de triagem cega (*Blind Screening*) e proteção de PII.

- [x] **2.3 Paginação Visual e Filtros Avançados no Frontend:**
  - [x] Consumir parâmetros `page` e `size` do [VagaController.java](file:///c:/Repositorio/S06-26-AB-Equipe_23/backend/src/main/java/br/com/appbit/appbit/controllers/VagaController.java) na tela de listagem de vagas.
  - [x] Implementar paginação ou rolagem infinita estruturada na visualização de candidatos da Shortlist.
  - [x] Adicionar filtros por cluster regional, modalidade (remoto/híbrido) e score mínimo.
- [x] **2.4 Ciclo de Feedback do Recrutador (Aprovação/Reprovação):**
  - [x] Modal de aprovação com opção de inclusão de anotações internas pelo recrutador.
  - [x] Botão de reprovação com coleta do motivo principal (ex: *fit técnico*, *salário*, *localidade*).

---

### Fase 3 — Segurança, Conformidade & Performance (Médio Prazo)
Foco: Adequação a normas corporativas rigorosas e proteção contra vazamento de dados sensíveis.

- [ ] **3.1 Criptografia em Repouso de Dados Pessoais (PII):**
  - [ ] Criar conversor Hibernate `@Convert` com AES-256 para campos como CPF, telefone e e-mail.
  - [ ] Configurar chave mestra de criptografia injetada exclusivamente por variável de ambiente (`ENCRYPTION_KEY`).
- [ ] **3.2 Rate Limiting e Proteção contra Abuso:**
  - [ ] Adicionar filtro de limitação de requisições (Bucket4j ou Spring Cloud Gateway) nos endpoints `/auth/login` e `POST /match`.
  - [ ] Configurar cabeçalhos de segurança HTTP (CSP, HSTS, X-Content-Type-Options).
- [ ] **3.3 Gestão de Direitos do Titular (LGPD):**
  - [ ] Criar endpoint e fluxo para exclusão/anonimização definitiva dos dados do candidato ("direito ao esquecimento").
- [ ] **3.4 Cache Distribuído com Redis:**
  - [ ] Ativar Redis na nuvem e configurar anotações `@Cacheable` para consultas agregadas em [InsightsController.java](file:///c:/Repositorio/S06-26-AB-Equipe_23/backend/src/main/java/br/com/appbit/appbit/controllers/InsightsController.java).

---

### Fase 4 — Inteligência, Métricas & Validação B2B (Longo Prazo)
Foco: Diferencial competitivo, validação comercial e geração de receita.

- [ ] **4.1 Testes Piloto com Empresas Parceiras:**
  - [ ] Selecionar de 3 a 5 empresas ou equipes de recrutamento em Florianópolis/SC para programa Beta.
  - [ ] Rodar vagas reais utilizando a shortlist da plataforma.
  - [ ] Coletar métricas de NPS (Net Promoter Score) e tempo médio até a contratação.
- [ ] **4.2 Notificações Transacionais:**
  - [ ] Disparo automático de e-mail (Resend, SendGrid ou Amazon SES) ao candidato quando seu perfil for selecionado para entrevista.
  - [ ] Lembretes de mentorias e eventos corporativos para mentores e inscritos.
- [ ] **4.3 Motor de Matching Semântico Avançado:**
  - [ ] Implementar busca vetorial com embeddings de IA (ex: OpenAI / Gemini / pgvector) para análise semântica de currículos vs descrição de vagas.
- [ ] **4.4 Exportação de Relatórios de Compliance ESG:**
  - [ ] Geração e download em PDF/XLSX dos indicadores de diversidade e conectividade para relatórios anuais de sustentabilidade das empresas.

---

## 📊 Quadro de Acompanhamento Operacional

| ID | Item | Fase | Prioridade | Responsável | Status | Critério de Aceite (DoD) |
|---|---|---|---|---|---|---|
| **OP-01** | Ajustar Ping / Keep-Alive de 14 min | Fase 1 | 🔴 Alta | DevOps | `[x] Concluído` | Workflow atualizado a cada 14 min para backend e frontend web. |
| **OP-02** | Configurar Sentry no Front e Back | Fase 1 | 🔴 Alta | Fullstack | `[ ] Pendente` | Erros não capturados geram alerta automático com stack trace completo. |
| **OP-03** | Incluir Playwright E2E no CI | Fase 1 | 🟡 Média | QA / DevOps | `[x] Concluído` | Workflow `full-mvp-ci.yml` executa job e2e com fallback de credenciais. |

| **OP-04** | Tela de Cadastro de Candidatos | Fase 2 | 🔴 Alta | Fullstack | `[x] Concluído` | Candidato cadastra perfil público com skills e recebe ID anônimo. |
| **OP-05** | Checkbox de Termos e LGPD | Fase 2 | 🔴 Alta | Fullstack | `[x] Concluído` | Consentimento explícito e banner de Blind Screening integrados. |

| **OP-06** | Paginação no Frontend de Vagas | Fase 2 | 🟡 Média | Frontend | `[x] Concluído` | Listagem consome `GET /vagas?page=X&size=Y` com navegação visual fluida. |
| **OP-07** | Motivo de Rejeição na Shortlist | Fase 2 | 🟡 Média | Fullstack | `[x] Concluído` | Ação de reprovação salva motivo no banco para análise de melhoria. |
| **OP-08** | Criptografia AES-256 de PII | Fase 3 | 🔴 Alta | Backend | `[ ] Pendente` | Campos CPF/Email/Telefone ficam cifrados na tabela `dim_candidato`. |
| **OP-09** | Rate Limiting em Login e Match | Fase 3 | 🟡 Média | Backend | `[ ] Pendente` | Mais de 10 tentativas de login por minuto por IP resultam em HTTP 429. |
| **OP-10** | Piloto com 3 empresas parceiras | Fase 4 | 🔴 Alta | Produto / PO | `[ ] Pendente` | Ao menos 3 processos seletivos reais executados e avaliados na plataforma. |
| **OP-11** | Envio de E-mails Transacionais | Fase 4 | 🟡 Média | Backend | `[ ] Pendente` | Candidato aprovado recebe e-mail automático com instruções da vaga. |
| **OP-12** | Exportação de Relatório ESG em PDF | Fase 4 | 🟢 Baixa | Fullstack | `[ ] Pendente` | Recrutador baixa PDF com gráficos e dados regionais de diversidade. |

---

## 💡 Como Usar Este Checklist no Dia a Dia

1. **Nas Dailies e Sprints:**
   - Atualizar o status de `[ ] Pendente` para `[ ] Em Andamento` e, após aprovação em PR, marcar `[x] Concluído`.
2. **Ao Criar uma Pull Request (PR):**
   - Referenciar o código do item (ex: `Fixes #OP-01 - Ajuste de Keep-Alive`) para rastreabilidade direta.
3. **Critério de Conclusão (Definition of Done):**
   - Um item só deve ser marcado como `[x]` se tiver código testado localmente, suite de CI aprovada e documentação atualizada.
