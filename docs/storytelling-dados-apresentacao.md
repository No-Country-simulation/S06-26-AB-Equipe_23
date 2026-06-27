# Storytelling dos Dados para apresentação

## Mensagem central

O App BiT usa dados para apoiar uma triagem mais objetiva, transparente e segura: calcula aderência técnica do candidato, preserva anonimização na shortlist inicial e usa indicadores regionais como contexto de inclusão, sem transformar região ou conectividade em fator discriminatório.

## Narrativa sugerida

### 1. Problema

Processos de recrutamento podem ser lentos, pouco transparentes e sujeitos a vieses. Ao mesmo tempo, decisões baseadas só em currículo ou contato direto podem expor dados sensíveis cedo demais.

### 2. Solução

O MVP organiza a triagem em três camadas:

- match técnico calculado por skills, experiência, modelo de trabalho e diversidade;
- shortlist anonimizada para reduzir exposição e viés na primeira análise;
- painel de BI para explicar distribuição de candidatos, score e contexto regional.

### 3. Como o score funciona

O `score_match` é calculado de 0 a 100:

- skills: 50%;
- experiência: 25%;
- modelo de trabalho: 15%;
- diversidade: 10%.

Na versão atual, a região é exibida para análise e filtros, mas não entra no score numérico.

### 4. O que o painel mostra

O Power BI deve responder:

- quantos candidatos foram analisados;
- quais candidatos anonimizados têm maior aderência;
- como os scores se distribuem;
- quais skills aparecem na shortlist;
- como os candidatos estão distribuídos por região;
- quais indicadores regionais ajudam a contextualizar acesso e conectividade.

### 5. Privacidade e anti-viés

A shortlist inicial não transporta nome, e-mail, telefone ou LinkedIn. Esses dados só devem aparecer após aprovação explícita em etapa posterior.

Essa decisão mostra que a privacidade não é um detalhe técnico: é parte da proposta de valor do produto.

### 6. Limites assumidos

- O algoritmo atual é um protótipo com pesos configuráveis.
- A regra legal de diversidade/fairness precisa validação jurídica/compliance.
- Métricas corporativas de ESG e saúde do time são demonstrativas até entrada de fonte empresarial validada.
- Dados de conectividade contextualizam regiões, mas não devem excluir candidatos.

## Roteiro de fala curto

> "Nesta entrega, o time transformou a shortlist em uma camada explicável de decisão. O score agora é recalculado a partir de critérios objetivos, o painel mostra o impacto desses critérios e a anonimização protege o candidato antes da aprovação. A proposta não é substituir a decisão humana, mas dar uma base auditável, inclusiva e segura para a triagem."

## Slides sugeridos

1. Dor do processo: triagem lenta, vieses e exposição precoce de dados.
2. Arquitetura da solução: backend, dados, BI e frontend.
3. Score match: critérios e pesos.
4. Shortlist anonimizada: exemplo de campos permitidos.
5. Painel BI: ranking, distribuição e regiões.
6. Privacidade: contato só após aprovação.
7. Limites e próximos passos: validação jurídica, produção e integração Power BI.

