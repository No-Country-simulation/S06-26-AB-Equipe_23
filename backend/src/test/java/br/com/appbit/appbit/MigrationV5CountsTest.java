package br.com.appbit.appbit;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class MigrationV5CountsTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void shouldHaveExpectedV5SeedCounts() {
        Integer trilhas = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM trilhas_formacao", Integer.class);
        Integer eventos = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM eventos_estruturantes", Integer.class);
        Integer mentores = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM mentores_diversidade", Integer.class);

        assertEquals(6, trilhas);
        assertEquals(24, eventos);
        assertEquals(10, mentores);

        System.out.println("OK: trilhas_formacao=" + trilhas + ", eventos_estruturantes=" + eventos + ", mentores_diversidade=" + mentores);
    }
}
