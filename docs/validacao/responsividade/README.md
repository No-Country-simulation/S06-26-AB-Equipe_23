# Validacao responsiva local

Execucao realizada em 2026-07-10 contra a branch `fix/mvp-hardening-completo`, com frontend Vite local e backend Spring Boot usando H2. O teste verificou overflow horizontal, erros de console, falhas de requisicao, login, logout e bloqueio de retorno a rotas protegidas.

| Resolucao | Rota | Resultado | Overflow | Console | Evidencia | Observacao |
|---|---|---|---|---|---|---|
| 390x844 | `/login` | APROVADO | Nao | 0 | [01-login.png](390x844/01-login.png) | Login antes do preenchimento |
| 390x844 | `/vagas` | APROVADO | Nao | 0 | [02-vagas.png](390x844/02-vagas.png) | Sidebar fechada por padrao |
| 390x844 | `/vagas#detalhe` | APROVADO | Nao | 0 | [03-vaga-detalhe.png](390x844/03-vaga-detalhe.png) | Detalhe empilhado |
| 390x844 | `/shortlist` | APROVADO | Nao | 0 | [04-shortlist.png](390x844/04-shortlist.png) | Oito aliases carregados |
| 390x844 | `/insights/regioes` | APROVADO | Nao | 0 | [05-insights.png](390x844/05-insights.png) | Grid empilhado |
| 390x844 | `/relatorio-esg` | APROVADO | Nao | 0 | [06-relatorio-esg.png](390x844/06-relatorio-esg.png) | Dados identificados como demonstrativos |
| 390x844 | `/saude-time` | APROVADO | Nao | 0 | [07-saude-time.png](390x844/07-saude-time.png) | Dados identificados como demonstrativos |
| 390x844 | `/trilhas-capacitacoes` | APROVADO | Nao | 0 | [08-formacoes.png](390x844/08-formacoes.png) | Cards carregados |
| 390x844 | `/eventos` | APROVADO | Nao | 0 | [09-eventos.png](390x844/09-eventos.png) | Cards carregados |
| 390x844 | `/mentorias` | APROVADO | Nao | 0 | [10-mentorias.png](390x844/10-mentorias.png) | Simulacao local identificada |
| 768x1024 | `/login` | APROVADO | Nao | 0 | [01-login.png](768x1024/01-login.png) | Login antes do preenchimento |
| 768x1024 | `/vagas` | APROVADO | Nao | 0 | [02-vagas.png](768x1024/02-vagas.png) | Sidebar fechada por padrao |
| 768x1024 | `/vagas#detalhe` | APROVADO | Nao | 0 | [03-vaga-detalhe.png](768x1024/03-vaga-detalhe.png) | Detalhe empilhado |
| 768x1024 | `/shortlist` | APROVADO | Nao | 0 | [04-shortlist.png](768x1024/04-shortlist.png) | Oito aliases carregados |
| 768x1024 | `/insights/regioes` | APROVADO | Nao | 0 | [05-insights.png](768x1024/05-insights.png) | Grid adaptado |
| 768x1024 | `/relatorio-esg` | APROVADO | Nao | 0 | [06-relatorio-esg.png](768x1024/06-relatorio-esg.png) | Grid adaptado |
| 768x1024 | `/saude-time` | APROVADO | Nao | 0 | [07-saude-time.png](768x1024/07-saude-time.png) | Grid adaptado |
| 768x1024 | `/trilhas-capacitacoes` | APROVADO | Nao | 0 | [08-formacoes.png](768x1024/08-formacoes.png) | Cards carregados |
| 768x1024 | `/eventos` | APROVADO | Nao | 0 | [09-eventos.png](768x1024/09-eventos.png) | Cards carregados |
| 768x1024 | `/mentorias` | APROVADO | Nao | 0 | [10-mentorias.png](768x1024/10-mentorias.png) | Cards carregados |
| 1366x768 | `/login` | APROVADO | Nao | 0 | [01-login.png](1366x768/01-login.png) | Layout desktop completo |
| 1366x768 | `/vagas` | APROVADO | Nao | 0 | [02-vagas.png](1366x768/02-vagas.png) | Sidebar e painel completos |
| 1366x768 | `/vagas#detalhe` | APROVADO | Nao | 0 | [03-vaga-detalhe.png](1366x768/03-vaga-detalhe.png) | Detalhe visivel |
| 1366x768 | `/shortlist` | APROVADO | Nao | 0 | [04-shortlist.png](1366x768/04-shortlist.png) | Oito aliases carregados |
| 1366x768 | `/insights/regioes` | APROVADO | Nao | 0 | [05-insights.png](1366x768/05-insights.png) | Dados regionais carregados |
| 1366x768 | `/relatorio-esg` | APROVADO | Nao | 0 | [06-relatorio-esg.png](1366x768/06-relatorio-esg.png) | Transparencia demonstrativa visivel |
| 1366x768 | `/saude-time` | APROVADO | Nao | 0 | [07-saude-time.png](1366x768/07-saude-time.png) | Transparencia demonstrativa visivel |
| 1366x768 | `/trilhas-capacitacoes` | APROVADO | Nao | 0 | [08-formacoes.png](1366x768/08-formacoes.png) | Cards carregados |
| 1366x768 | `/eventos` | APROVADO | Nao | 0 | [09-eventos.png](1366x768/09-eventos.png) | Cards carregados |
| 1366x768 | `/mentorias` | APROVADO | Nao | 0 | [10-mentorias.png](1366x768/10-mentorias.png) | Cards carregados |

O arquivo [results.json](results.json) contem o resultado estruturado produzido pelo teste. Nenhuma captura contem senha, token, cabecalho de autenticacao ou contato liberado apos aprovacao.
