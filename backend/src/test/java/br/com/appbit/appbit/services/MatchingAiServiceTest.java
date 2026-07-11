package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.AiMatchResultDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MatchingAiServiceTest {

    private MatchingAiService matchingAiService;

    @BeforeEach
    void setUp() {
        matchingAiService = new MatchingAiService();
    }

    @Test
    void shouldCalculateJaroWinklerSimilarityCorrectly() {
        // Test identical strings
        assertEquals(1.0, matchingAiService.calcularJaroWinkler("java", "java"), 0.001);

        // Test completely different strings
        assertEquals(0.0, matchingAiService.calcularJaroWinkler("java", "python"), 0.001);

        // Test similar strings (prefix match Winkler bonus)
        double sim = matchingAiService.calcularJaroWinkler("spring", "springboot");
        assertTrue(sim > 0.8 && sim < 1.0);
    }

    @Test
    void shouldMapSynonymsToPerfectMatchInOfflineFallback() {
        // Required skill is "React", Candidate has "ReactJS" (should match as 1.0 / 100%)
        AiMatchResultDTO result = matchingAiService.calcularSimilaridadeSemantica(
            List.of("ReactJS"),
            List.of("React")
        );

        assertEquals(100.0, result.score(), 0.001);
        assertTrue(result.justificativa().contains("NLP Fallback"));
        assertTrue(result.justificativa().contains("1 das 1 skills"));
    }

    @Test
    void shouldCalculateOverallSemanticSimilarityCorrectly() {
        // Candidate has 1 perfect match and 1 partially similar skill
        AiMatchResultDTO result = matchingAiService.calcularSimilaridadeSemantica(
            List.of("Spring Boot", "JQuery"),
            List.of("Spring", "Javascript")
        );

        // Spring Boot is equivalent to Spring (1.0). JQuery vs Javascript is partial.
        // Overall score should be high but less than 100%
        assertTrue(result.score() > 50.0 && result.score() < 100.0);
        assertTrue(result.justificativa().contains("NLP Fallback"));
    }
}
