ALTER TABLE dim_vaga ADD COLUMN descricao VARCHAR(1000) NULL;
ALTER TABLE dim_vaga ADD COLUMN modalidade VARCHAR(50) NOT NULL DEFAULT 'Hibrido';
ALTER TABLE dim_vaga ADD COLUMN area VARCHAR(100) NULL;
ALTER TABLE dim_vaga ADD COLUMN prioridade_mulheres BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE dim_vaga ADD COLUMN prioridade_negros BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE dim_vaga ADD COLUMN prioridade_pcd BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE dim_vaga ADD COLUMN prioridade_lgbt BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE dim_vaga ADD COLUMN esg_match INT NULL;

INSERT IGNORE INTO dim_skill (skill_id, nome_skill, categoria) VALUES
(9,  'spark',          'engenharia'),
(10, 'dbt',            'engenharia'),
(11, 'bigquery',       'dados'),
(12, 'react',          'frontend'),
(13, 'typescript',     'frontend'),
(14, 'tailwind',       'frontend'),
(15, 'acessibilidade', 'frontend'),
(16, 'roadmap',        'produto'),
(17, 'okrs',           'produto'),
(18, 'discovery',      'produto'),
(19, 'stakeholders',   'produto');

INSERT IGNORE INTO dim_vaga (vaga_id, empresa_id, titulo, nivel, regiao_alvo_id, diversidade_minima, anti_vies, descricao, modalidade, area, prioridade_mulheres, prioridade_negros, prioridade_pcd, prioridade_lgbt, esg_match, criada_em) VALUES
(1, 'emp_001', 'Engenheira de Dados Sênior', 'senior', NULL, 60.00, TRUE, 'Buscamos profissional para estruturar pipelines de dados e liderar iniciativas de analytics na área de diversidade e impacto social.', 'Remoto', 'Dados', TRUE, TRUE, FALSE, FALSE, 92, '2025-06-10 10:00:00'),
(2, 'emp_001', 'Desenvolvedora Frontend React', 'pleno', NULL, 50.00, TRUE, 'Criação de interfaces acessíveis e performáticas para o produto principal da empresa, com foco em design system e acessibilidade WCAG.', 'Híbrido', 'Tecnologia', FALSE, FALSE, TRUE, TRUE, 78, '2025-06-08 10:00:00'),
(3, 'emp_001', 'Product Manager — Inclusão', 'senior', NULL, 70.00, TRUE, 'Liderar a estratégia de produto com foco em impacto social e metas ESG da empresa, conectando negócio e propósito.', 'Remoto', 'Produto', TRUE, TRUE, FALSE, TRUE, 95, '2025-06-05 10:00:00');

INSERT IGNORE INTO bridge_vaga_skill (vaga_id, skill_id, peso) VALUES
(1, 2, 1.00),
(1, 9, 1.00),
(1, 10, 1.00),
(1, 11, 1.00),
(2, 12, 1.00),
(2, 13, 1.00),
(2, 14, 1.00),
(2, 15, 1.00),
(3, 16, 1.00),
(3, 17, 1.00),
(3, 18, 1.00),
(3, 19, 1.00);
