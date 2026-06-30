-- Insert candidates data compatible with the Flyway schema (dim_candidato)

INSERT INTO dim_candidato (
	candidato_id,
	nome,
	cargo_alvo,
	nivel,
	cluster_residencia,
	municipio_residencia,
	cep,
	lat,
	lon,
	badge_diversidade,
	disponibilidade,
	ativo
)
VALUES
(1, 'Candidato 1', 'Backend Developer', 'junior', 'SC-Santa Catarina', 'Florianopolis', '88000', -27.5973, -48.5495, 'mulher', 'hibrido', TRUE),
(2, 'Candidato 2', 'Full Stack', 'pleno', 'SP-Metropolitana', 'Sao Paulo', '01000', -23.5505, -46.6333, 'negro', 'presencial', TRUE),
(3, 'Candidato 3', 'Backend Developer', 'junior', 'SC-Santa Catarina', 'Florianopolis', '88000', -27.5973, -48.5495, 'lgbtq', 'remoto', TRUE),
(4, 'Candidato 4', 'Data Analyst', 'pleno', 'RJ-Metropolitan', 'Rio de Janeiro', '20000', -22.9068, -43.1729, 'mulher', 'hibrido', TRUE),
(5, 'Candidato 5', 'Frontend Developer', 'senior', 'MG-Centro', 'Belo Horizonte', '30000', -19.9167, -43.9345, 'disabled', 'remoto', TRUE),
(6, 'Candidato 6', 'DevOps Engineer', 'junior', 'SC-Santa Catarina', 'Florianopolis', '88000', -27.5973, -48.5495, 'negro', 'remoto', TRUE),
(7, 'Candidato 7', 'Backend Developer', 'pleno', 'SP-Metropolitana', 'Sao Paulo', '01000', -23.5505, -46.6333, 'mulher', 'hibrido', TRUE),
(8, 'Candidato 8', 'Full Stack', 'junior', 'SC-Santa Catarina', 'Florianopolis', '88000', -27.5973, -48.5495, 'lgbtq', 'remoto', TRUE);
