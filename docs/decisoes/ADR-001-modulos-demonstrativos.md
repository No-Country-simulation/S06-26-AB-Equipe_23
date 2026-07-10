# ADR-001: Módulos demonstrativos do MVP

## Decisão

O MVP diferencia explicitamente dados funcionais de recortes demonstrativos. Power BI, ESG e Saúde do Time permanecem demonstrativos nesta versão. Formações, Eventos e Mentorias consomem dados de leitura da API; a solicitação de mentoria ainda não possui endpoint persistente.

## Estado funcional

- Login e sessão usam o backend e token JWT.
- Matching consome o backend e retorna oito candidatos anonimizados antes da aprovação.
- Formações, Eventos e Mentorias carregam seus catálogos pelos endpoints do MVP.
- A aprovação de candidato libera contato somente no fluxo autorizado existente.

## Estado demonstrativo

- Power BI exibe uma área reservada e não afirma existir um iframe publicado sem `VITE_POWERBI_URL`.
- ESG e Saúde do Time exibem recortes fixos identificados como demonstrativos.
- A ação de mentoria é uma simulação local; não deve ser apresentada como agendamento confirmado.
- Links de mídia fictícios não são abertos; quando não há mídia real, o card informa que o conteúdo é demonstrativo.
- Vagas continuam dependentes do fluxo e da persistência disponíveis no ambiente; a interface não deve afirmar gravação se a API não confirmar.

## Critério de evolução

Um módulo só pode ser apresentado como funcional quando houver endpoint, persistência quando aplicável, tratamento de erro e teste reproduzível. Até lá, a interface deve expor a limitação para evitar que a demo prometa uma operação inexistente.
