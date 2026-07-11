# Roadmap de Evolução Técnica — Do MVP para Produção

Este documento detalha o planejamento das melhorias arquiteturais, de infraestrutura e de produto necessárias para elevar o **AppBiT** do estado atual de MVP (Produto Mínimo Viável) para um produto comercial estável, seguro e escalável (*Production-Ready*).

---

## 1. Segurança e Hardening Corporativo
Para atender às exigências de segurança de grandes empresas (B2B) e conformidade legal:

* **Autenticação com Chaves Assimétricas (JWKS):**
  * **O quê:** Migrar a assinatura de tokens JWT de chave simétrica (chave compartilhada) para chaves pública/privada (RSA ou ECDSA).
  * **Como:** O backend assina o token com a chave privada, e o frontend (ou outros microsserviços) valida o token usando a chave pública exposta em uma rota pública padronizada `/.well-known/jwks.json`.
* **Criptografia de Dados Pessoais (Conformidade LGPD):**
  * **O quê:** Garantir que informações de identificação pessoal (PII) dos candidatos (como CPF, e-mail, telefone e nome completo) não fiquem salvas em texto claro no banco de dados.
  * **Como:** Implementar criptografia simétrica AES-256 transparente na camada do JPA (utilizando conversores Hibernate `@Convert(AttributeConverter.class)` ou Spring Data JPA Encryption).
* **Integração com Provedores de Identidade (SSO/OAuth2):**
  * **O quê:** Permitir que recrutadores façam login usando contas corporativas existentes (Google Workspace, Microsoft Entra ID/Office 365, LinkedIn).
  * **Como:** Integrar o módulo `spring-boot-starter-oauth2-client` nas configurações do Spring Security.

---

## 2. Escalabilidade e Performance (Alta Escala)
Garantir estabilidade à medida que o número de vagas e candidatos crescer:

* **Paginação Nativa de APIs:**
  * **O quê:** Evitar que rotas de listagem de candidatos e vagas retornem milhares de registros de uma só vez, o que causa estouro de memória e lentidão.
  * **Como:** Refatorar as assinaturas dos Controllers e Repositories do Spring Data JPA para aceitar parâmetros `Pageable` e retornar objetos do tipo `Page<T>`, permitindo paginação e ordenação nativa pelo banco.
* **Cache em Memória e Distribuído (Redis):**
  * **O quê:** Armazenar temporariamente em cache os resultados do motor de matching de candidatos/vagas e os consolidados de relatórios ESG/Saúde do Time (dados com alto custo de processamento que mudam com pouca frequência).
  * **Como:** Habilitar `@EnableCaching` no Spring Boot e integrar com um serviço Redis na nuvem.
* **Segregação de Conexões (Read/Write Splitting):**
  * **O quê:** Separar as requisições de escrita no banco de dados das consultas pesadas de relatórios e dashboards.
  * **Como:** Configurar múltiplos DataSources no HikariCP, roteando consultas `GET` para réplicas de leitura do MySQL e operações de escrita (`POST`, `PUT`, `DELETE`) para o banco de dados principal (Master).

---

## 3. DevOps, Monitoramento e Observabilidade
Para que a equipe consiga prever falhas e monitorar a saúde da aplicação na nuvem:

* **Métricas com Prometheus & Grafana:**
  * **O quê:** Monitorar em tempo real métricas de desempenho do servidor (uso de CPU, consumo de memória heap, tempo médio de resposta das rotas HTTP, conexões ativas no pool de banco).
  * **Como:** Adicionar a dependência do Micrometer Registry Prometheus no `pom.xml`, coletar os dados na rota `/actuator/prometheus` e configurar painéis visuais no Grafana.
* **Ingestão de Logs Estruturados:**
  * **O quê:** Padronizar a saída de logs do sistema para facilitar a indexação e busca rápida em caso de bugs na produção.
  * **Como:** Configurar o Logback para gerar logs em formato estruturado (JSON) e direcionar a saída para ferramentas de centralização de logs (ex: Loki, ELK Stack, ou Datadog).
* **Ambiente de Homologação (Staging):**
  * **O quê:** Garantir que novas funcionalidades sejam testadas na nuvem antes de irem a público.
  * **Como:** Configurar no Render/Vercel um segundo conjunto de serviços com pipeline de deploy atrelado à branch `develop` (Staging), e manter a branch `main` exclusivamente para produção estável.

---

## 4. Inteligência e Recursos de Produto
Adicionar valor tecnológico e diferenciais competitivos ao ecossistema do **AppBiT**:

* **Motor de Matching Inteligente (Inteligência Artificial):**
  * **O quê:** Substituir o matching de termos exatos (onde o candidato precisa ter a skill descrita exatamente da mesma forma que na vaga) por busca semântica inteligente.
  * **Como:** Integrar APIs de Machine Learning/NLP (como embeddings do Cohere ou OpenAI) para entender a intenção do currículo do candidato e compará-lo com a vaga, compreendendo sinônimos e experiências equivalentes.
* **Geração Automática de Insights ESG:**
  * **O quê:** Oferecer sugestões proativas aos recrutadores e gestores de ESG com base nos dados consolidados de cobertura de sinal e formação educacional regionais.
  * **Como:** Um assistente integrado que alerta: *"Identificamos carência de sinal de internet e escassez de desenvolvedores Java na Região X. Sugerimos criar uma trilha de capacitação local de Java para suprir as 5 vagas abertas."*
* **Relatórios e Auditoria ESG:**
  * **O quê:** Permitir a exportação dos dados e gráficos gerados pela plataforma.
  * **Como:** Rota para download de PDFs assinados digitalmente e planilhas formatadas (.xlsx) dos indicadores de diversidade, saúde do time e impacto de capacitações regionais para fins de compliance das empresas.
