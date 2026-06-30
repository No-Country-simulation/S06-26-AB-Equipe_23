package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import br.com.appbit.appbit.dtos.FiltroRequestDTO;
import br.com.appbit.appbit.dtos.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.MatchingResponseDTO;
import br.com.appbit.appbit.dtos.VagaRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

class MatchingJavaPythonParityExportTest {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Test
    void exportJavaReferenceForPythonParity() throws IOException {
        CandidatoMockService candidatoMockService = new CandidatoMockService();
        MatchingService matchingService = new MatchingService(candidatoMockService);

        List<CandidatoMatchDTO> sourceCandidates = candidatoMockService.listarAnonimizados();

        MatchingRequestDTO biProfileRequest = new MatchingRequestDTO(
                "emp_001",
                new VagaRequestDTO(
                        "Analista de Dados",
                        List.of("sql", "python"),
                        "junior",
                        "Florianopolis",
                        "remoto"
                ),
                new FiltroRequestDTO(null, null, 8)
        );

        MatchingRequestDTO inexistentSkillRequest = new MatchingRequestDTO(
                "emp_002",
                new VagaRequestDTO(
                        "Desenvolvedor",
                        List.of("kotlin"),
                        "pleno",
                        "Sao Paulo",
                        "presencial"
                ),
                new FiltroRequestDTO(null, null, 8)
        );

        MatchingResponseDTO biProfileResponse = matchingService.executarMatch(biProfileRequest);
        MatchingResponseDTO inexistentSkillResponse = matchingService.executarMatch(inexistentSkillRequest);

        Map<String, Object> output = new LinkedHashMap<>();
        output.put("source_candidates", sourceCandidates);
        output.put("scenarios", List.of(
                buildScenario("bi_profile", biProfileRequest, biProfileResponse),
                buildScenario("inexistent_skill", inexistentSkillRequest, inexistentSkillResponse)
        ));

        Path outputPath = Path.of("target", "parity", "java_parity_output.json");
        Files.createDirectories(outputPath.getParent());
        MAPPER.writerWithDefaultPrettyPrinter().writeValue(outputPath.toFile(), output);
    }

    private static Map<String, Object> buildScenario(
            String name,
            MatchingRequestDTO request,
            MatchingResponseDTO response
    ) {
        Map<String, Object> scenario = new LinkedHashMap<>();
        scenario.put("name", name);
        scenario.put("request", request);
        scenario.put("java_response", response);
        return scenario;
    }
}
