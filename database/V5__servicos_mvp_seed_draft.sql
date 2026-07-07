-- Draft de seed para os servicos 1, 3 e 4 do MVP App BiT.
-- Julio pode mover este conteudo para backend/src/main/resources/db/migration/
-- apos revisar nomes de tabela, padrao de entidade e compatibilidade H2/MySQL.

CREATE TABLE IF NOT EXISTS trilhas_formacao (
    trilha_id INT PRIMARY KEY,
    nome_trilha VARCHAR(160) NOT NULL,
    descricao_conteudo VARCHAR(700) NOT NULL,
    carga_horaria VARCHAR(20) NOT NULL,
    link_midia VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS eventos_estruturantes (
    evento_id INT PRIMARY KEY,
    nome_evento VARCHAR(180) NOT NULL,
    data DATE NOT NULL,
    horario VARCHAR(10) NOT NULL,
    local VARCHAR(140) NOT NULL,
    detalhes VARCHAR(700) NOT NULL,
    tema_palestra VARCHAR(180) NOT NULL,
    palestrantes VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS mentores_diversidade (
    mentor_id INT PRIMARY KEY,
    nome_mentor VARCHAR(140) NOT NULL,
    empresa_origem VARCHAR(140) NOT NULL,
    cargo VARCHAR(160) NOT NULL,
    especialidade_esg VARCHAR(180) NOT NULL,
    disponibilidade VARCHAR(80) NOT NULL
);

INSERT INTO trilhas_formacao
    (trilha_id, nome_trilha, descricao_conteudo, carga_horaria, link_midia)
VALUES
    (1, 'Recrutamento inclusivo com dados', 'Capacitacao para RH usar score shortlist anonimizada e criterios objetivos sem reforcar vieses', '4h', 'https://example.com/appbit/formacoes/recrutamento-inclusivo-dados'),
    (2, 'Lideranca inclusiva', 'Trilha para liderancas conduzirem times diversos com escuta ativa seguranca psicologica e metas ESG', '6h', 'https://example.com/appbit/formacoes/lideranca-inclusiva'),
    (3, 'Cultura antidiscriminatoria na pratica', 'Conteudo sobre linguagem inclusiva politicas internas e tomada de decisao responsavel em processos de pessoas', '3h', 'https://example.com/appbit/formacoes/cultura-antidiscriminatoria'),
    (4, 'ESG aplicado ao RH', 'Capacitacao para conectar diversidade indicadores humanos e metas ESG dentro da rotina de recrutamento e desenvolvimento', '4h', 'https://example.com/appbit/formacoes/esg-aplicado-rh'),
    (5, 'Entrevistas estruturadas e anti-vies', 'Trilha para padronizar entrevistas reduzir discriminacao inconsciente e registrar evidencias de avaliacao', '5h', 'https://example.com/appbit/formacoes/entrevistas-estruturadas'),
    (6, 'Uso responsavel de score e shortlist', 'Conteudo para interpretar score_match badges e dados regionais como apoio a decisao sem substituir avaliacao humana', '3h', 'https://example.com/appbit/formacoes/uso-responsavel-score');

INSERT INTO mentores_diversidade
    (mentor_id, nome_mentor, empresa_origem, cargo, especialidade_esg, disponibilidade)
VALUES
    (1, 'Marina Costa', 'DiversaTech', 'Head de Diversidade e Inclusao', 'Recrutamento inclusivo', 'Quinzenal'),
    (2, 'Rafael Lima', 'Horizonte Energia', 'Gerente de People Analytics', 'Indicadores ESG e pessoas', 'Mensal'),
    (3, 'Camila Rocha', 'Ponte Digital', 'Coordenadora de Cultura', 'Cultura antidiscriminatoria', 'Quinzenal'),
    (4, 'Fernando Alves', 'Nova Rede', 'Diretor de RH', 'Lideranca inclusiva', 'Mensal'),
    (5, 'Beatriz Nunes', 'Impacto Social Labs', 'Especialista ESG', 'Metas sociais e diversidade', 'Quinzenal'),
    (6, 'Lucas Pereira', 'Trama Corporativa', 'Gerente de Talentos', 'Entrevistas estruturadas', 'Mensal'),
    (7, 'Renata Martins', 'Elo Inclusivo', 'Consultora Senior de D&I', 'Inclusao regional e acessibilidade', 'Quinzenal'),
    (8, 'Thiago Barros', 'Mapa Humano', 'People Partner', 'Saude do time e pertencimento', 'Mensal'),
    (9, 'Ana Claudia Freitas', 'Vetor ESG', 'Coordenadora ESG', 'Governanca de indicadores humanos', 'Mensal'),
    (10, 'Joao Mendes', 'Caminhos Digitais', 'Lider de Comunidades', 'Networking corporativo por impacto', 'Quinzenal');

INSERT INTO eventos_estruturantes
    (evento_id, nome_evento, data, horario, local, detalhes, tema_palestra, palestrantes)
VALUES
    (1, 'Painel Contratacao inclusiva com dados', '2026-08-05', '09:00', 'Biguacu - BIGUACU_BR101_NORTE', 'Painel para RH sobre score_match shortlist anonimizada e decisao segura', 'Contratacao inclusiva com dados', 'Marina Costa; Rafael Lima'),
    (2, 'Workshop Lideranca inclusiva regional', '2026-08-06', '10:00', 'Florianopolis - AEROPORTO_HLZ', 'Oficina para liderancas conectarem diversidade metas ESG e realidade regional', 'Lideranca inclusiva em operacoes distribuidas', 'Fernando Alves; Renata Martins'),
    (3, 'Palestra Cultura antidiscriminatoria na pratica', '2026-08-07', '14:00', 'Florianopolis - CAMPECHE', 'Palestra sobre linguagem inclusiva politicas internas e vies inconsciente', 'Cultura inclusiva de dentro para fora', 'Camila Rocha'),
    (4, 'Roda Executiva Inclusao e trabalho remoto', '2026-08-08', '09:30', 'Florianopolis - CANASVIEIRAS', 'Conversa sobre barreiras regionais conectividade e acesso a oportunidades', 'Inclusao regional e trabalho remoto', 'Renata Martins; Joao Mendes'),
    (5, 'Painel ESG e indicadores humanos', '2026-08-09', '11:00', 'Florianopolis - CBD_BEIRAMAR', 'Painel para transformar metricas de diversidade e saude do time em plano de acao', 'ESG aplicado ao RH', 'Beatriz Nunes; Ana Claudia Freitas'),
    (6, 'Workshop Entrevistas estruturadas', '2026-08-10', '15:00', 'Florianopolis - CENTRO_HISTORICO', 'Oficina para reduzir subjetividade na avaliacao de candidatos e registrar criterios', 'Entrevistas justas e anti-vies', 'Lucas Pereira'),
    (7, 'Palestra Pertencimento e saude do time', '2026-08-11', '10:30', 'Florianopolis - COQUEIROS', 'Palestra sobre sinais de exclusao burnout e seguranca psicologica em equipes diversas', 'Saude do time e pertencimento', 'Thiago Barros'),
    (8, 'Painel Talentos diversos em areas tecnicas', '2026-08-12', '09:00', 'Florianopolis - ESTREITO_CAPOEIRAS', 'Painel com liderancas sobre acesso a carreiras digitais e desenvolvimento inclusivo', 'Diversidade em tecnologia', 'Marina Costa; Joao Mendes'),
    (9, 'Workshop Plano de acao inclusivo', '2026-08-13', '13:30', 'Florianopolis - INGLESES', 'Atividade para transformar diagnosticos do dashboard em iniciativas praticas', 'Do diagnostico a acao inclusiva', 'Beatriz Nunes; Camila Rocha'),
    (10, 'Roda Executiva Mentorias por impacto', '2026-08-14', '16:00', 'Florianopolis - JURERE', 'Discussao sobre networking corporativo orientado por impacto e boas praticas de D&I', 'Mentorias e redes de apoio', 'Fernando Alves; Renata Martins'),
    (11, 'Palestra Shortlist anonima e decisao humana', '2026-08-15', '10:00', 'Florianopolis - LAGOA_CONCEICAO', 'Palestra para explicar limites do score_match e papel da avaliacao humana', 'Uso responsavel de IA e dados', 'Rafael Lima'),
    (12, 'Workshop Diversidade para gestores', '2026-08-16', '09:30', 'Florianopolis - NORTE_ILHA', 'Oficina para gestores praticarem rituais inclusivos feedback e escuta ativa', 'Lideranca de times diversos', 'Fernando Alves; Thiago Barros'),
    (13, 'Painel Contratacao fora dos grandes centros', '2026-08-17', '14:00', 'Florianopolis - RESIDENCIAL_NORTE', 'Painel sobre oportunidades regionais e reducao de barreiras no recrutamento', 'Inclusao territorial no recrutamento', 'Renata Martins; Joao Mendes'),
    (14, 'Workshop Indicadores ESG no recrutamento', '2026-08-18', '11:00', 'Florianopolis - SC401_CORREDOR', 'Oficina para conectar dados de diversidade turnover e saude do time a metas de RH', 'Metas ESG e People Analytics', 'Ana Claudia Freitas; Rafael Lima'),
    (15, 'Palestra Recrutamento inclusivo com dados', '2026-08-19', '09:00', 'Florianopolis - TRINDADE', 'Palestra introdutoria sobre dados como apoio a triagem justa e explicavel', 'Score_match e privacidade', 'Marina Costa; Rafael Lima'),
    (16, 'Workshop Comunidades universitarias e inclusao', '2026-08-20', '15:30', 'Florianopolis - UFSC', 'Oficina sobre entrada de talentos junior grupos sub-representados e formacao tecnica', 'Pipeline diverso de talentos', 'Camila Rocha; Joao Mendes'),
    (17, 'Painel Mobilidade conectividade e trabalho', '2026-08-21', '10:00', 'Florianopolis - VIA_EXPRESSA_CORREDOR', 'Painel sobre como dados regionais podem apoiar politicas de trabalho hibrido', 'Conectividade e inclusao produtiva', 'Renata Martins; Thiago Barros'),
    (18, 'Workshop Jornada inclusiva do colaborador', '2026-08-22', '09:30', 'Palhoca - PALHOCA_CENTRO', 'Oficina para desenhar jornada de contratacao onboarding e acompanhamento inclusivo', 'Jornada inclusiva de ponta a ponta', 'Beatriz Nunes; Fernando Alves'),
    (19, 'Palestra Cultura inclusiva em crescimento', '2026-08-23', '14:30', 'Palhoca - PALHOCA_PEDRA_BRANCA', 'Palestra para empresas em expansao alinharem diversidade e crescimento sustentavel', 'Cultura inclusiva escalavel', 'Camila Rocha'),
    (20, 'Roda Executiva Equidade no acesso', '2026-08-24', '16:00', 'Palhoca - SAO_JOSE_BARREIROS', 'Conversa sobre acesso a oportunidades capacitacao e redes corporativas', 'Equidade e empregabilidade inclusiva', 'Marina Costa; Joao Mendes'),
    (21, 'Painel Inclusao e indicadores de territorio', '2026-08-25', '11:00', 'Sao Jose - ESTREITO_CAPOEIRAS', 'Painel sobre leitura territorial para apoiar decisoes de RH sem discriminar candidatos', 'Indicadores regionais com responsabilidade', 'Rafael Lima; Renata Martins'),
    (22, 'Workshop Politicas internas inclusivas', '2026-08-26', '09:00', 'Sao Jose - SAO_JOSE_CENTRO', 'Oficina para revisar politicas internas comunicacao e rituais de tomada de decisao', 'Governanca inclusiva', 'Ana Claudia Freitas; Camila Rocha'),
    (23, 'Palestra Times diversos e performance', '2026-08-27', '13:30', 'Sao Jose - SAO_JOSE_KOBRASOL', 'Palestra executiva sobre impacto de times diversos em inovacao retencao e decisao', 'Times diversos e resultados', 'Fernando Alves; Beatriz Nunes'),
    (24, 'Workshop Boas praticas entre empresas', '2026-08-28', '10:30', 'Sao Jose - SAO_JOSE_ROÇADO', 'Oficina para troca de boas praticas de inclusao entre liderancas corporativas', 'Networking corporativo por impacto', 'Joao Mendes; Ana Claudia Freitas');
