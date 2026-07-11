package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.CandidatoResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CryptoValidationTest {

    @Autowired
    private CandidatoService candidatoService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
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
        assertEquals(false, dbName.contains("João"));
    }
}
