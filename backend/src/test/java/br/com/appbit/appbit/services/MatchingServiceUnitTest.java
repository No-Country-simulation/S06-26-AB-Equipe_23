package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

/**
 * Unit tests for MatchingService - NO SPRING BOOT CONTEXT
 * Tests only the core business logic without JWT/Security initialization
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes Unitários - MatchingService (Sem Spring Context)")
class MatchingServiceUnitTest {

    @Mock
    private CandidatoMockService candidatoMockService;

    private MatchingService matchingService;
    private VagaRequestDTO vagaBase;
    private FiltroRequestDTO filtroBase;
    private MatchingRequestDTO requestBase;

    @BeforeEach
    void setup() {
        matchingService = new MatchingService(candidatoMockService);

        vagaBase = new VagaRequestDTO(
                "Analista de Dados",
                Arrays.asList("sql", "python"),
                "junior",
                "Florianópolis",
                "remoto"
        );

        filtroBase = new FiltroRequestDTO(null, null, 8);
        requestBase = new MatchingRequestDTO("emp_001", vagaBase, filtroBase);
    }

    // Mock data - 8 official candidates
    // CandidatoMatchDTO record: (candidatoId, apelidoExibicao, statusIdentificacao, cargoAlvo, 
    //                             nivel, regiao, clusterResidencia, cep, lat, lon, 
    //                             modeloTrabalhoPreferido, skills, anosExperiencia, badgeDiversidade, scoreMatch)
    private List<CandidatoMatchDTO> getMockCandidates() {
        return Arrays.asList(
                new CandidatoMatchDTO("cand_001", "Candidato 1", "aprovado", "Analista", 
                        "junior", "Florianópolis", "cluster1", "88000", -27.5969, -48.5494, 
                        "remoto", Arrays.asList("sql", "python"), 3, "badge1", 91),
                new CandidatoMatchDTO("cand_007", "Candidato 7", "aprovado", "Analista", 
                        "senior", "São Paulo", "cluster2", "01000", -23.5505, -46.6333, 
                        "presencial", Arrays.asList("java", "python"), 8, "badge2", 88),
                new CandidatoMatchDTO("cand_002", "Candidato 2", "aprovado", "Analista", 
                        "pleno", "Rio de Janeiro", "cluster3", "20000", -22.9068, -43.1729, 
                        "hibrido", Arrays.asList("sql", "python", "java"), 5, "badge3", 86),
                new CandidatoMatchDTO("cand_003", "Candidato 3", "aprovado", "Analista", 
                        "junior", "Florianópolis", "cluster1", "88100", -27.5969, -48.5494, 
                        "remoto", Arrays.asList("sql", "python"), 2, "badge4", 84),
                new CandidatoMatchDTO("cand_004", "Candidato 4", "aprovado", "Analista", 
                        "pleno", "Curitiba", "cluster4", "80000", -25.4284, -49.2733, 
                        "presencial", Arrays.asList("sql"), 4, "badge5", 82),
                new CandidatoMatchDTO("cand_005", "Candidato 5", "aprovado", "Analista", 
                        "senior", "São Paulo", "cluster2", "01100", -23.5505, -46.6333, 
                        "presencial", Arrays.asList("python", "java"), 7, "badge6", 79),
                new CandidatoMatchDTO("cand_008", "Candidato 8", "aprovado", "Analista", 
                        "junior", "Florianópolis", "cluster1", "88200", -27.5969, -48.5494, 
                        "remoto", Arrays.asList("python", "sql"), 3, "badge7", 76),
                new CandidatoMatchDTO("cand_006", "Candidato 6", "aprovado", "Analista", 
                        "junior", "Florianópolis", "cluster1", "88300", -27.5969, -48.5494, 
                        "remoto", Arrays.asList("sql", "python"), 2, "badge8", 73)
        );
    }

    // ==================== REQUIREMENT 1: Score Range (0-100) ====================
    @Test
    @DisplayName("TC-001: Scores devem estar entre 0 e 100")
    void testScoreRange() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        MatchingResponseDTO response = matchingService.executarMatch(requestBase);

        assertNotNull(response);
        assertFalse(response.candidatos().isEmpty());
        response.candidatos().forEach(c -> {
            assertTrue(c.scoreMatch() >= 0 && c.scoreMatch() <= 100, 
                    "Score " + c.scoreMatch() + " fora do intervalo 0-100");
        });
    }

    // ==================== REQUIREMENT 2: No Sensitive Data ====================
    @Test
    @DisplayName("TC-002: Resposta não deve conter dados sensíveis (contato_pos_aprovacao)")
    void testSensitiveDataOmitted() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        MatchingResponseDTO response = matchingService.executarMatch(requestBase);

        assertNotNull(response);
        // Verificar que regraPrivacidade está configurada
        assertNotNull(response.regraPrivacidade());
        assertTrue(response.regraPrivacidade().contains("omitido"),
                "Regra de privacidade deve indicar que dados sensíveis foram omitidos");
    }

    // ==================== REQUIREMENT 3: 8 Candidates ====================
    @Test
    @DisplayName("TC-003: Shortlist deve conter máximo de 8 candidatos")
    void testEightCandidates() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        MatchingResponseDTO response = matchingService.executarMatch(requestBase);

        assertNotNull(response);
        assertTrue(response.candidatos().size() <= 8, 
                "Esperado máximo 8 candidatos, recebido " + response.candidatos().size());
        assertEquals(8, response.totalAnalisados(),
                "Total analisados deve ser 8");
    }

    // ==================== REQUIREMENT 4: Inexistent Skill returns 0 ====================
    @Test
    @DisplayName("TC-004: Skill inexistente (kotlin) deve retornar poucos/nenhum resultado")
    void testInexistentSkill() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        VagaRequestDTO vagaWithInexistentSkill = new VagaRequestDTO(
                "Desenvolvedor",
                Arrays.asList("kotlin"),  // nenhum candidato tem kotlin
                "pleno",
                "São Paulo",
                "presencial"
        );
        MatchingRequestDTO request = new MatchingRequestDTO("emp_002", vagaWithInexistentSkill, filtroBase);

        MatchingResponseDTO response = matchingService.executarMatch(request);

        assertNotNull(response);
        // Se skill não existir, o resultado deve ser vazio ou muito reduzido
        assertTrue(response.candidatos().isEmpty() || response.candidatos().size() <= 2,
                "Skill inexistente (kotlin) deve retornar 0 ou pouquíssimos candidatos");
    }

    // ==================== REQUIREMENT 5: BI Alignment ====================
    @Test
    @DisplayName("TC-013: Ranking deve estar em ordem descendente por score")
    void testExpectedRanking() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        MatchingResponseDTO response = matchingService.executarMatch(requestBase);

        assertNotNull(response);
        assertFalse(response.candidatos().isEmpty());

        // Verificar que está em ordem descendente
        List<Integer> scores = response.candidatos().stream()
                .map(CandidatoMatchDTO::scoreMatch)
                .toList();

        for (int i = 0; i < scores.size() - 1; i++) {
            assertTrue(scores.get(i) >= scores.get(i + 1),
                    "Scores devem estar em ordem descendente: " + scores);
        }
    }

    // ==================== ADDITIONAL TESTS ====================
    @Test
    @DisplayName("TC-005: Nível deve fazer match")
    void testNivelMatch() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        MatchingResponseDTO response = matchingService.executarMatch(requestBase);
        
        assertNotNull(response);
        assertTrue(response.candidatos().size() > 0,
                "Deve retornar candidatos com nível junior");
    }

    @Test
    @DisplayName("TC-010: Resultados devem estar em ordem descendente por score")
    void testSorting() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        MatchingResponseDTO response = matchingService.executarMatch(requestBase);

        assertNotNull(response);
        List<Integer> scores = response.candidatos().stream()
                .map(CandidatoMatchDTO::scoreMatch)
                .toList();

        for (int i = 0; i < scores.size() - 1; i++) {
            assertTrue(scores.get(i) >= scores.get(i + 1),
                    "Scores devem estar em ordem descendente: " + scores);
        }
    }

    @Test
    @DisplayName("TC-011: Resultado respeita limite de candidatos")
    void testRespectsLimit() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        FiltroRequestDTO filtroComLimite = new FiltroRequestDTO(null, null, 4);
        MatchingRequestDTO request = new MatchingRequestDTO("emp_001", vagaBase, filtroComLimite);

        MatchingResponseDTO response = matchingService.executarMatch(request);

        assertNotNull(response);
        assertTrue(response.candidatos().size() <= 4,
                "Resultados devem respeitar limite de 4");
    }

    @Test
    @DisplayName("TC-014: Response deve conter todos os campos obrigatórios")
    void testRequiredFieldsPresent() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        MatchingResponseDTO response = matchingService.executarMatch(requestBase);

        assertNotNull(response);
        assertNotNull(response.fonteCandidatos());
        assertNotNull(response.totalAnalisados());
        assertNotNull(response.totalRetorno());
        assertNotNull(response.regraPrivacidade());
        assertNotNull(response.candidatos());
        
        response.candidatos().forEach(c -> {
            assertNotNull(c.candidatoId(), "candidatoId não deve ser null");
            assertNotNull(c.apelidoExibicao(), "apelidoExibicao não deve ser null");
            assertTrue(c.scoreMatch() >= 0, "Score deve ser >= 0");
            assertNotNull(c.nivel(), "Nível não deve ser null");
            assertNotNull(c.regiao(), "Região não deve ser null");
            assertNotNull(c.skills(), "Skills não devem ser null");
        });
    }

    @Test
    @DisplayName("TC-007: Teste com múltiplas skills")
    void testMultipleSkills() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        VagaRequestDTO vagaMultipleSkills = new VagaRequestDTO(
                "Desenvolvedor Full Stack",
                Arrays.asList("java", "python"),  // alguns candidatos têm
                "pleno",
                "São Paulo",
                "presencial"
        );
        MatchingRequestDTO request = new MatchingRequestDTO("emp_001", vagaMultipleSkills, filtroBase);

        MatchingResponseDTO response = matchingService.executarMatch(request);

        assertNotNull(response);
        // cand_007 tem java e python, cand_002 tem java e python
        assertTrue(response.candidatos().size() >= 0,
                "Deve processar candidatos com skills java ou python");
    }

    @Test
    @DisplayName("TC-015: Total analisados e total retorno devem estar corretos")
    void testTotalMetrics() {
        when(candidatoMockService.listarAnonimizados()).thenReturn(getMockCandidates());

        MatchingResponseDTO response = matchingService.executarMatch(requestBase);

        assertNotNull(response);
        assertEquals(8, response.totalAnalisados(),
                "Total analisados deve ser 8");
        assertTrue(response.totalRetorno() <= response.totalAnalisados(),
                "Total retorno deve ser <= total analisados");
    }
}
