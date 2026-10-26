package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.CandidatoResponseDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.CandidatoSkillEntity;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import br.com.appbit.appbit.repositories.CandidatoSkillRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class CandidatoServiceSkillsTest {

    @Autowired
    private CandidatoService candidatoService;

    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    private CandidatoSkillRepository candidatoSkillRepository;

    @Test
    void shouldCreateCandidateWithSkillsAndPersistRelationship() {
        CandidatoCreateDTO dto = new CandidatoCreateDTO(
                "Mariana Costa Dev",
                "Desenvolvedora Front-end",
                "Pleno",
                "Centro",
                "Florianópolis",
                "88010-000",
                -48.55,
                -27.59,
                "Mulheres",
                "Mulher na Tecnologia",
                "Híbrido",
                true,
                1,
                4,
                List.of("React", "TypeScript", "TailwindCSS"),
                "mariana.costa@example.com",
                "+55 48 98888-7777",
                "https://linkedin.com/in/mariana-costa-dev",
                true
        );

        CandidatoResponseDTO response = candidatoService.createCandidato(dto);
        assertNotNull(response);
        assertNotNull(response.id());

        CandidatoEntity saved = candidatoRepository.findById(response.id()).orElse(null);
        assertNotNull(saved);
        assertEquals("Desenvolvedora Front-end", saved.getCargo());
        assertEquals(4, saved.getAnosExperiencia());

        List<CandidatoSkillEntity> skills = candidatoSkillRepository.findByCandidato(saved);
        assertFalse(skills.isEmpty());
        assertTrue(skills.stream().anyMatch(s -> s.getSkill().getNome().equalsIgnoreCase("React")));
        assertTrue(skills.stream().anyMatch(s -> s.getSkill().getNome().equalsIgnoreCase("TypeScript")));
    }
}
