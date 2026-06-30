-- Insert test candidates data
-- This must match the candidatos_teste.json structure

INSERT INTO dim_candidato (candidato_id, apelido_exibicao, status_identificacao, cargo_alvo, nivel, regiao, cluster_residencia, cep, lat, lon, modelo_trabalho_preferido, anos_experiencia, badge_diversidade, skills)
VALUES 
(1, 'Candidato 1', 'identificado', 'Backend Developer', 'junior', 'Florianópolis', 'SC-Santa Catarina', '88000', -27.5973, -48.5495, 'híbrido', 3, 'mulher', 'sql,python'),
(2, 'Candidato 2', 'identificado', 'Full Stack', 'pleno', 'São Paulo', 'SP-Metropolitana', '01000', -23.5505, -46.6333, 'presencial', 5, 'negro', 'javascript,react,nodejs'),
(3, 'Candidato 3', 'identificado', 'Backend Developer', 'junior', 'Florianópolis', 'SC-Santa Catarina', '88000', -27.5973, -48.5495, 'remoto', 2, 'lgbtq', 'python,sql,java'),
(4, 'Candidato 4', 'identificado', 'Data Analyst', 'pleno', 'Rio de Janeiro', 'RJ-Metropolitan', '20000', -22.9068, -43.1729, 'híbrido', 4, 'mulher', 'sql,tableau,excel'),
(5, 'Candidato 5', 'identificado', 'Frontend Developer', 'senior', 'Belo Horizonte', 'MG-Centro', '30000', -19.9167, -43.9345, 'remoto', 8, 'disabled', 'javascript,react,typescript'),
(6, 'Candidato 6', 'identificado', 'DevOps Engineer', 'junior', 'Florianópolis', 'SC-Santa Catarina', '88000', -27.5973, -48.5495, 'remoto', 1, 'negro', 'docker,kubernetes,aws'),
(7, 'Candidato 7', 'identificado', 'Backend Developer', 'pleno', 'São Paulo', 'SP-Metropolitana', '01000', -23.5505, -46.6333, 'híbrido', 6, 'mulher', 'java,spring,microservices'),
(8, 'Candidato 8', 'identificado', 'Full Stack', 'junior', 'Florianópolis', 'SC-Santa Catarina', '88000', -27.5973, -48.5495, 'remoto', 2, 'lgbtq', 'python,sql,javascript');
