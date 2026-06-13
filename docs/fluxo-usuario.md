## Fluxo de Navegação e Regras de Negócio — BiT App (B2B)

Este documento especifica o fluxo do usuário (Recrutador/RH) no ecossistema do BiT App. O objetivo é orientar o desenvolvimento das telas no React, a construção dos endpoints no Spring Boot e as regras de tratamento de dados.


## Visão Geral do Fluxo

[ Início ] ──► [ Login ] ──► [ Perfil/Metas ESG ]

┌─────────────────────────┴────────────────────────┐
▼ (Criar Vaga)                                     ▼ (não criar)
[ Forms de Vagas ]                                  [ Dashboard Inicial ]
│                                                    │                     |
▼                                                    │                     |
[ Lista de Triagem ] ◄──────────────────────────┘                     |
│                                                                          | 
├──► (Botão: Insights de Rede) ────► [ Painel de Conectividade Anatel ]   |
└──► (Botão: Aprovar Entrevista) ──► [ Informações Ocultas Reveladas ]  ◄─┘

## 📋 Detalhamento das Etapas e Regras Técnicas

### 1. Entrada e Autenticação
  Tela 1: Entrada no App
    Ação: O usuário acessa a URL da plataforma.
    Destino:Direciona automaticamente para a tela de autenticação.
  Tela 2: Página de Login
   Componentes:Campos de e-mail, senha e opção de primeiro cadastro da empresa.
   Destino: Após validação, direciona para as configurações institucionais.

### 2. Configurações e Gestão da Empresa
  Tela 3: Página de Perfil Institucional**
    Objetivo: Estabelecer o posicionamento ESG da empresa antes da operação.
    Componentes:O usuário configura o perfil de diversidade e define as metas ESG globais da corporação.
   **Bifurcação de Fluxo:**
     Cenário A (Criar uma vaga imediata):O usuário opta por abrir um processo seletivo e vai direto para o **Forms de vagas**.
     Cenário B (Não criar uma vaga ainda):O usuário opta por visualizar a situação atual da empresa e vai para o **Dashboard Inicial**.

  Tela 4: Dashboard Inicial (Painel Corporativo)**
    Objetivo:Exibir o andamento das métricas organizacionais.
    Componentes: Gráficos mostrando o cumprimento das metas de diversidade e ESG.
    Ações Disponíveis:
      Botão "Criar Vaga": Direciona para o **Forms de vagas**.
      Seção "Ver Vagas Criadas": Lista os processos seletivos em andamento. Ao clicar em uma vaga existente, direciona diretamente para a **Lista de Triagem** correspondente.
      Botão "Mudar Metas": Retorna para a **Página de Perfil** caso o usuário queira reconfigurar os objetivos.

### 3. Operação do Processo Seletivo (Core Business)
  Tela 5: Forms de Vagas (Cadastro e Filtros)
    Objetivo:Entrada de requisitos para o motor de match.
    Componentes:Formulário contendo cargo, nível, hard skills exigidas e localização.
      Controles Especiais (Mecanismo Anti-Viés): Chave seletora (*toggle switch*) para ativar o **Filtro Anti-Viés** e campo numérico para definir o percentual de diversidade mínima para a Shortlist.
    Ação:Ao clicar em "Buscar Candidatos", dispara um `POST /api/v1/match` e envia o usuário para a próxima página.

  Tela 6: Lista de Triagem (Shortlist Fabric)
    Objetivo:Apresentar os profissionais compatíveis de forma justa.
    Regra Anti-Viés Crítica: Se o filtro anti-viés estiver ativo no backend, o campo `nome` do candidato não é renderizado  (exibe-se "Candidato Anonimizado" ou a ID correspondente).
    Componentes: Exibição do Score de Match (%), competências do perfil, badges de diversidade e a justificativa gerada pelo sistema explicando a aderência.
    Ações Disponíveis:
      Botão "Voltar para o Dashboard Inicial": Aborta a visualização atual.
      Botão "Ver Insights de Rede": Direciona para o **Painel de Conectividade**.
      Botão "Aprovar para Entrevista": Direciona para a **Página de Informações do Candidato**.

### 4. Tomada de Decisão e Insights
  Tela 7: Painel de Conectividade (Insights Geográficos)
    Objetivo: Mitigar barreiras digitais de infraestrutura através dos dados da Anatel.
    Componentes:Mapa interativo ou gráficos por cluster (derivados do endpoint `GET /insights/regioes`) mostrando a densidade demográfica, período de pico de uso da rede e a cobertura local (3G/4G/5G).
    Regra de Negócio:Permite ao RH avaliar se o profissional precisará de apoio logístico de infraestrutura ou auxílio-conectividade para o trabalho híbrido/remoto.
    Ação (Botão "Voltar"):Retorna o usuário exatamente para a **Lista de Triagem** mantendo o estado da busca.

  Tela 8: Página com as Informações dos Candidatos (Quebra do Anonimato)**
    Objetivo:Exibir os dados completos do profissional selecionado para agendamento da entrevista.
    Componentes:Revelação do nome real, e-mail, telefone e histórico completo de competências.
    Ações de Navegação (Retornos):
      Botão "Voltar para Vaga": Retorna para a **Lista de Triagem** para que o recrutador possa avaliar os demais candidatos na fila.
      Botão "Voltar para Dashboard Inicial": Finaliza a operação e retorna ao painel corporativo principal.
