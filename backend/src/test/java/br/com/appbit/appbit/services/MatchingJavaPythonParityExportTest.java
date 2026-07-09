package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import br.com.appbit.appbit.dtos.FiltroRequestDTO;
import br.com.appbit.appbit.dtos.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.MatchingResponseDTO;
import br.com.appbit.appbit.dtos.VagaRequestDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MatchingJavaPythonParityExportTest {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Test
    void exportJavaReferenceForPythonParity() throws IOException {
        CandidatoRepository candidatoRepository = mock(CandidatoRepository.class);
        CandidatoMapper candidatoMapper = mock(CandidatoMapper.class);
        MatchingService matchingService = new MatchingService(candidatoRepository, candidatoMapper);

        List<CandidatoMatchDTO> sourceCandidates = List.of(
                new CandidatoMatchDTO("cand_001", "Candidato 1", "Analista", "junior", "Florianopolis", "cluster1", "88000", new BigDecimal("-27.5969"), "-48.5494", "remoto", List.of("sql", "python"), 3, "badge1", 91),
                new CandidatoMatchDTO("cand_002", "Candidato 2", "Analista", "pleno", "Sao Paulo", "cluster2", "01000", new BigDecimal("-23.5505"), "-46.6333", "presencial", List.of("java", "python"), 5, "badge2", 86)
        );

        List<CandidatoEntity> entities = sourceCandidates.stream()
                .map(candidate -> mock(CandidatoEntity.class))
                .toList();

        when(candidatoRepository.findByAtivo(true)).thenReturn(entities);
        for (int i = 0; i < entities.size(); i++) {
            when(candidatoMapper.toMatchDTO(entities.get(i))).thenReturn(sourceCandidates.get(i));
        }

        MatchingRequestDTO biProfileRequest = new MatchingRequestDTO(
                "emp_001",
                new VagaRequestDTO("Analista de Dados", List.of("sql", "python"), "junior", "Florianopolis", "remoto"),
                new FiltroRequestDTO(null, null, 8)
        );

        MatchingRequestDTO inexistentSkillRequest = new MatchingRequestDTO(
                "emp_002",
                new VagaRequestDTO("Desenvolvedor", List.of("kotlin"), "pleno", "Sao Paulo", "presencial"),
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
