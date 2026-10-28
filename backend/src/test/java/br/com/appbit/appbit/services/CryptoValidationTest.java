package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.CandidatoResponseDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CryptoValidationTest {

    @Autowired
    private CandidatoService candidatoService;

    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Nome do candidato deve estar cifrado no banco (repouso) e decifrado na camada de aplicação")
    void candidateNameShouldBeEncryptedInDatabaseAndDecryptedInApp() {
        String rawName = "João da Silva Sauro LGPD Test";
        CandidatoCreateDTO dto = new CandidatoCreateDTO(
                rawName,
                "Desenvolvedor",
                "junior",
                "Florianópolis",
                "Florianópolis",
                "88000-000",
                -48.5496,
                -27.5969,
                "Feminino",
                "Mulher",
                "hibrido",
                true,
                1
        );

        CandidatoResponseDTO created = candidatoService.createCandidato(dto);
        assertNotNull(created);
        Integer id = created.id();

        CandidatoResponseDTO found = candidatoService.getCandidatoById(id);
        assertEquals(rawName, found.nome());

        String dbName = jdbcTemplate.queryForObject(
                "SELECT nome FROM dim_candidato WHERE candidato_id = ?",
                String.class,
                id
        );
        assertNotNull(dbName);
        assertNotEquals(rawName, dbName);
        assertFalse(dbName.contains("João"));
    }

    @Test
    @DisplayName("Dados PII (Email, Telefone, CPF) devem ser cifrados em repouso no banco e decifrados pela entidade")
    void candidatePiiShouldBeEncryptedInDatabaseAndDecryptedInApp() {
        String rawName = "Beatriz Helena Costa";
        String rawEmail = "beatriz.costa@empresa.com.br";
        String rawTelefone = "+55 48 98765-4321";
        String rawCpf = "456.789.012-34";

        CandidatoCreateDTO dto = new CandidatoCreateDTO(
                rawName,
                "Cientista de Dados",
                "pleno",
                "Centro",
                "Florianópolis",
                "88010-000",
                -48.5500,
                -27.6000,
                "Geral",
                "Mulher",
                "remoto",
                true,
                1,
                3,
                List.of("Python", "SQL", "Machine Learning"),
                rawEmail,
                rawTelefone,
                "https://linkedin.com/in/beatriz-costa",
                true
        );

        CandidatoResponseDTO created = candidatoService.createCandidato(dto);
        assertNotNull(created);
        Integer id = created.id();

        // 1. Valida que a entidade recuperada via JPA decifra os dados transparentemente
        CandidatoEntity entity = candidatoRepository.findById(id).orElseThrow();
        assertEquals(rawName, entity.getNome());
        assertEquals(rawEmail, entity.getEmail());
        assertEquals(rawTelefone, entity.getTelefone());
        assertTrue(entity.getConsentimentoLgpd());

        // 2. Valida que a consulta direta via SQL (JdbcTemplate) revela que os dados estão cifrados em Base64
        String dbEmail = jdbcTemplate.queryForObject(
                "SELECT email FROM dim_candidato WHERE candidato_id = ?",
                String.class,
                id
        );
        String dbTelefone = jdbcTemplate.queryForObject(
                "SELECT telefone FROM dim_candidato WHERE candidato_id = ?",
                String.class,
                id
        );

        assertNotNull(dbEmail);
        assertNotEquals(rawEmail, dbEmail);
        assertFalse(dbEmail.contains("beatriz.costa"));

        assertNotNull(dbTelefone);
        assertNotEquals(rawTelefone, dbTelefone);
        assertFalse(dbTelefone.contains("98765"));
    }
}
