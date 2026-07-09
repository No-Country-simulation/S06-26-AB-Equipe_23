package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import br.com.appbit.appbit.dtos.FiltroRequestDTO;
import br.com.appbit.appbit.dtos.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.MatchingResponseDTO;
import br.com.appbit.appbit.dtos.VagaRequestDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("MatchingService unit tests")
class MatchingServiceUnitTest {

    @Mock
    private CandidatoRepository candidatoRepository;

    @Mock
    private CandidatoMapper candidatoMapper;

    private MatchingService matchingService;
    private VagaRequestDTO vagaBase;
    private FiltroRequestDTO filtroBase;
    private MatchingRequestDTO requestBase;

    @BeforeEach
    void setup() {
        matchingService = new MatchingService(candidatoRepository, candidatoMapper);

        vagaBase = new VagaRequestDTO(
                "Analista de Dados",
                Arrays.asList("sql", "python"),
                "junior",
                "Florianopolis",
                "remoto"
        );

        filtroBase = new FiltroRequestDTO(null, null, 8);
        requestBase = new MatchingRequestDTO("emp_001", vagaBase, filtroBase);
    }

    private List<CandidatoMatchDTO> getMockCandidates() {
        return Arrays.asList(
                new CandidatoMatchDTO("cand_001", "Candidato 1", "Analista", "junior", "Florianopolis", "cluster1", "88000", new BigDecimal("-27.5969"), "-48.5494", "remoto", Arrays.asList("sql", "python"), 3, "badge1", 91),
                new CandidatoMatchDTO("cand_007", "Candidato 7", "Analista", "senior", "Sao Paulo", "cluster2", "01000", new BigDecimal("-23.5505"), "-46.6333", "presencial", Arrays.asList("java", "python"), 8, "badge2", 88),
                new CandidatoMatchDTO("cand_002", "Candidato 2", "Analista", "pleno", "Rio de Janeiro", "cluster3", "20000", new BigDecimal("-22.9068"), "-43.1729", "hibrido", Arrays.asList("sql", "python", "java"), 5, "badge3", 86),
                new CandidatoMatchDTO("cand_003", "Candidato 3", "Analista", "junior", "Florianopolis", "cluster1", "88100", new BigDecimal("-27.5969"), "-48.5494", "remoto", Arrays.asList("sql", "python"), 2, "badge4", 84),
                new CandidatoMatchDTO("cand_004", "Candidato 4", "Analista", "pleno", "Curitiba", "cluster4", "80000", new BigDecimal("-25.4284"), "-49.2733", "presencial", List.of("sql"), 4, "badge5", 82),
                new CandidatoMatchDTO("cand_005", "Candidato 5", "Analista", "senior", "Sao Paulo", "cluster2", "01100", new BigDecimal("-23.5505"), "-46.6333", "presencial", Arrays.asList("python", "java"), 7, "badge6", 79),
                new CandidatoMatchDTO("cand_008", "Candidato 8", "Analista", "junior", "Florianopolis", "cluster1", "88200", new BigDecimal("-27.5969"), "-48.5494", "remoto", Arrays.asList("python", "sql"), 3, "badge7", 76),
                new CandidatoMatchDTO("cand_006", "Candidato 6", "Analista", "junior", "Florianopolis", "cluster1", "88300", new BigDecimal("-27.5969"), "-48.5494", "remoto", Arrays.asList("sql", "python"), 2, "badge8", 73)
        );
    }

    private void mockRepositoryCandidates(List<CandidatoMatchDTO> candidates) {
        List<CandidatoEntity> entities = new ArrayList<>();

        for (CandidatoMatchDTO candidate : candidates) {
            CandidatoEntity entity = mock(CandidatoEntity.class);
            entities.add(entity);
            when(candidatoMapper.toMatchDTO(entity)).thenReturn(candidate);
        }

        when(candidatoRepository.findByAtivo(true)).thenReturn(entities);
    }

    @Test
    @DisplayName("Scores devem estar entre 0 e 100")
    void testScoreRange() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingResponseDTO response = matchingService.executarMatch(requestBase);
        assertNotNull(response);
        assertFalse(response.candidatos().isEmpty());
        response.candidatos().forEach(c ->
                assertTrue(c.scoreMatch() >= 0 && c.scoreMatch() <= 100)
        );
    }

    @Test
    @DisplayName("Resposta deve preservar regra de privacidade")
    void testSensitiveDataOmitted() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingResponseDTO response = matchingService.executarMatch(requestBase);
        assertNotNull(response.regraPrivacidade());
        assertTrue(response.regraPrivacidade().contains("omitido"));
    }

    @Test
    @DisplayName("Shortlist deve conter no maximo 8 candidatos")
    void testEightCandidates() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingResponseDTO response = matchingService.executarMatch(requestBase);
        assertTrue(response.candidatos().size() <= 8);
        assertEquals(8, response.totalAnalisados());
    }

    @Test
    @DisplayName("Skill inexistente deve retornar lista vazia")
    void testInexistentSkill() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingRequestDTO request = new MatchingRequestDTO(
                "emp_002",
                new VagaRequestDTO("Desenvolvedor", List.of("kotlin"), "pleno", "Sao Paulo", "presencial"),
                filtroBase
        );
        MatchingResponseDTO response = matchingService.executarMatch(request);
        assertNotNull(response);
        assertTrue(response.candidatos().isEmpty());
    }

    @Test
    @DisplayName("Ranking deve estar em ordem descendente por score")
    void testExpectedRanking() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingResponseDTO response = matchingService.executarMatch(requestBase);
        List<Integer> scores = response.candidatos().stream()
                .map(CandidatoMatchDTO::scoreMatch)
                .toList();
        for (int i = 0; i < scores.size() - 1; i++) {
            assertTrue(scores.get(i) >= scores.get(i + 1), "Scores devem estar em ordem descendente: " + scores);
        }
    }

    @Test
    @DisplayName("Filtro por nivel deve retornar candidatos")
    void testNivelMatch() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingResponseDTO response = matchingService.executarMatch(requestBase);
        assertFalse(response.candidatos().isEmpty());
        assertTrue(response.candidatos().stream().allMatch(c -> "junior".equals(c.nivel())));
    }

    @Test
    @DisplayName("Resultado respeita limite de candidatos")
    void testRespectsLimit() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingRequestDTO request = new MatchingRequestDTO("emp_001", vagaBase, new FiltroRequestDTO(null, null, 4));
        MatchingResponseDTO response = matchingService.executarMatch(request);
        assertTrue(response.candidatos().size() <= 4);
    }

    @Test
    @DisplayName("Response deve conter campos obrigatorios")
    void testRequiredFieldsPresent() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingResponseDTO response = matchingService.executarMatch(requestBase);
        assertNotNull(response.fonteCandidatos());
        assertNotNull(response.totalAnalisados());
        assertNotNull(response.totalRetorno());
        assertNotNull(response.regraPrivacidade());
        assertNotNull(response.candidatos());
        response.candidatos().forEach(c -> {
            assertNotNull(c.candidatoId());
            assertNotNull(c.nome());
            assertTrue(c.scoreMatch() >= 0);
            assertNotNull(c.nivel());
            assertNotNull(c.regiao());
            assertNotNull(c.skills());
        });
    }

    @Test
    @DisplayName("Teste com multiplas skills")
    void testMultipleSkills() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingRequestDTO request = new MatchingRequestDTO(
                "emp_001",
                new VagaRequestDTO("Desenvolvedor Full Stack", Arrays.asList("java", "python"), null, null, "presencial"),
                filtroBase
        );
        MatchingResponseDTO response = matchingService.executarMatch(request);
        assertNotNull(response);
        assertFalse(response.candidatos().isEmpty());
    }

    @Test
    @DisplayName("Metricas totais devem estar corretas")
    void testTotalMetrics() {
        mockRepositoryCandidates(getMockCandidates());
        MatchingResponseDTO response = matchingService.executarMatch(requestBase);
        assertEquals(8, response.totalAnalisados());
        assertTrue(response.totalRetorno() <= response.totalAnalisados());
    }
}
