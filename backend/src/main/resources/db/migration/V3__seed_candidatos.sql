
INSERT IGNORE INTO dim_regiao (regiao_id, cluster, municipio, lat, lon, perfil_regiao, fonte) VALUES
(1,  'TRINDADE',             'Florianopolis', -27.596111, -48.525528, 'Universitario',          'seed_v3'),
(2,  'UFSC',                 'Florianopolis', -27.593478, -48.552089, 'Universitario',          'seed_v3'),
(3,  'CBD_BEIRAMAR',         'Florianopolis', -27.586028, -48.547444, 'Centro comercial',       'seed_v3'),
(4,  'CONTINENTE',           'Florianopolis', -27.597667, -48.585108, 'Residencial misto',      'seed_v3'),
(5,  'SAO_JOSE_KOBRASOL',    'Sao Jose',      -27.594458, -48.619528, 'Comercial/residencial',  'seed_v3'),
(6,  'CAMPINAS_SAO_JOSE',    'Sao Jose',      -27.608008, -48.626850, 'Residencial',            'seed_v3'),
(7,  'BIGUACU_BR101_NORTE',  'Biguacu',       -27.508108, -48.654131, 'Periferica',             'seed_v3'),
(8,  'PALHOCA_CENTRO',       'Palhoca',       -27.637456, -48.666794, 'Centro municipal',       'seed_v3');

INSERT IGNORE INTO dim_skill (skill_id, nome_skill, categoria) VALUES
(1,  'sql',         'dados'),
(2,  'python',      'dados'),
(3,  'power bi',    'visualizacao'),
(4,  'excel',       'visualizacao'),
(5,  'estatistica', 'dados'),
(6,  'etl',         'engenharia'),
(7,  'tableau',     'visualizacao'),
(8,  'git',         'engenharia');


INSERT IGNORE INTO dim_candidato
    (candidato_id, nome, cargo_alvo, nivel,
     regiao_id, cluster_residencia, municipio_residencia,
     cep, lat, lon,
     badge_diversidade, disponibilidade, ativo)
VALUES
(1, 'Ana Souza',    'Analista de Dados Junior', 'junior',
    1, 'TRINDADE',            'Florianopolis',
    '88036-000', -27.596111, -48.525528,
    'Mulher negra em tecnologia',                    'hibrido',    TRUE),

(2, 'Bruno Martins','Analista de Dados Junior', 'junior',
    5, 'SAO_JOSE_KOBRASOL',   'Sao Jose',
    '88102-000', -27.594458, -48.619528,
    'Talento de regiao com menor acesso',            'presencial', TRUE),

(3, 'Carla Nunes',  'Analista de Dados Junior', 'junior',
    2, 'UFSC',                'Florianopolis',
    '88040-000', -27.593478, -48.552089,
    'Perfil junior em formacao tecnica',             'remoto',     TRUE),

(4, 'Diego Almeida','Analista de Dados Junior', 'junior',
    7, 'BIGUACU_BR101_NORTE', 'Biguacu',
    '88160-000', -27.508108, -48.654131,
    'Pessoa com deficiencia',                        'hibrido',    TRUE),

(5, 'Elisa Rocha',  'Analista de Dados Junior', 'junior',
    8, 'PALHOCA_CENTRO',      'Palhoca',
    '88130-000', -27.637456, -48.666794,
    'Mulher em transicao de carreira para tecnologia','hibrido',   TRUE),

(6, 'Felipe Costa', 'Analista de Dados Junior', 'junior',
    3, 'CBD_BEIRAMAR',        'Florianopolis',
    '88015-000', -27.586028, -48.547444,
    'Sem badge informada',                           'presencial', TRUE),

(7, 'Gabriela Lima','Analista de Dados Junior', 'junior',
    6, 'CAMPINAS_SAO_JOSE',   'Sao Jose',
    '88101-000', -27.608008, -48.626850,
    'Primeira geracao no ensino superior',           'remoto',     TRUE),

(8, 'Henrique Barros','Analista de Dados Junior','junior',
    4, 'CONTINENTE',          'Florianopolis',
    '88070-000', -27.597667, -48.585108,
    'Talento de baixa renda',                        'hibrido',    TRUE);


INSERT IGNORE INTO bridge_candidato_skill (candidato_id, skill_id, nivel_skill) VALUES
-- cand_001: sql, python, power bi, excel
(1, 1, 'intermediario'), (1, 2, 'basico'), (1, 3, 'intermediario'), (1, 4, 'intermediario'),
-- cand_002: sql, python, excel
(2, 1, 'basico'),        (2, 2, 'basico'), (2, 4, 'basico'),
-- cand_003: power bi, sql, estatistica
(3, 3, 'basico'),        (3, 1, 'basico'), (3, 5, 'basico'),
-- cand_004: sql, power bi, etl
(4, 1, 'intermediario'), (4, 3, 'basico'), (4, 6, 'basico'),
-- cand_005: python, excel, power bi
(5, 2, 'basico'),        (5, 4, 'intermediario'), (5, 3, 'basico'),
-- cand_006: sql, tableau, excel
(6, 1, 'intermediario'), (6, 7, 'intermediario'), (6, 4, 'avancado'),
-- cand_007: sql, python, power bi, git
(7, 1, 'intermediario'), (7, 2, 'intermediario'), (7, 3, 'intermediario'), (7, 8, 'basico'),
-- cand_008: excel, power bi, sql
(8, 4, 'basico'),        (8, 3, 'basico'),        (8, 1, 'basico');