package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.requestDTOs.FiltroRequestDTO;
import br.com.appbit.appbit.dtos.requestDTOs.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.requestDTOs.VagaRequestDTO;
import br.com.appbit.appbit.dtos.responseDTOs.MatchingResponseDTO;
import br.com.appbit.appbit.dtos.utilDTOs.CandidatoMatchDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Exporta um "gabarito" da saída do MatchingService em JSON, para comparação
 * de paridade com a implementação equivalente em Python.
 *
 * CandidatoMockService foi descontinuado — a fonte de candidatos agora é
 * simulada via CandidatoRepository + CandidatoMapper mockados, refletindo
 * o fluxo real de produção baseado em banco de dados.
 */
class MatchingJavaPythonParityExportTest {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    // CandidatoMatchDTO record atual:
    // (candidatoId, nome, cargoAlvo, nivel, regiao, clusterResidencia, cep, lat, lon,
    //  modeloTrabalhoPreferido, skills, anosExperiencia, badgeDiversidade, scoreMatch)
    private List<CandidatoMatchDTO> candidatosDeReferencia() {
        return List.of(
                new CandidatoMatchDTO("cand_001", "Candidato 1", "Analista",
                        "junior", "Florianópolis", "cluster1", "88000", -27.5969, -48.5494,
                        "remoto", List.of("sql", "python"), 3, "badge1", 91),
                new CandidatoMatchDTO("cand_007", "Candidato 7", "Analista",
                        "senior", "São Paulo", "cluster2", "01000", -23.5505, -46.6333,
                        "presencial", List.of("java", "python"), 8, "badge2", 88),
                new CandidatoMatchDTO("cand_002", "Candidato 2", "Analista",
                        "pleno", "Rio de Janeiro", "cluster3", "20000", -22.9068, -43.1729,
                        "hibrido", List.of("sql", "python", "java"), 5, "badge3", 86),
                new CandidatoMatchDTO("cand_003", "Candidato 3", "Analista",
                        "junior", "Florianópolis", "cluster1", "88100", -27.5969, -48.5494,
                        "remoto", List.of("sql", "python"), 2, "badge4", 84),
                new CandidatoMatchDTO("cand_004", "Candidato 4", "Analista",
                        "pleno", "Curitiba", "cluster4", "80000", -25.4284, -49.2733,
                        "presencial", List.of("sql"), 4, "badge5", 82),
                new CandidatoMatchDTO("cand_005", "Candidato 5", "Analista",
                        "senior", "São Paulo", "cluster2", "01100", -23.5505, -46.6333,
                        "presencial", List.of("python", "java"), 7, "badge6", 79),
                new CandidatoMatchDTO("cand_008", "Candidato 8", "Analista",
                        "junior", "Florianópolis", "cluster1", "88200", -27.5969, -48.5494,
                        "remoto", List.of("python", "sql"), 3, "badge7", 76),
                new CandidatoMatchDTO("cand_006", "Candidato 6", "Analista",
                        "junior", "Florianópolis", "cluster1", "88300", -27.5969, -48.5494,
                        "remoto", List.of("sql", "python"), 2, "badge8", 73)
        );
    }

    /**
     * Monta um MatchingService com CandidatoRepository + CandidatoMapper mockados,
     * de forma que findByAtivo(true) + toMatchDTO(entity) reproduzam exatamente
     * a lista de CandidatoMatchDTO passada.
     */
    private MatchingService construirMatchingServiceComFonte(List<CandidatoMatchDTO> candidatos) {
        CandidatoRepository candidatoRepository = mock(CandidatoRepository.class);
        CandidatoMapper candidatoMapper = mock(CandidatoMapper.class);

        List<CandidatoEntity> entidades = new ArrayList<>();
        for (int i = 0; i < candidatos.size(); i++) {
            CandidatoEntity entidade = new CandidatoEntity();
            entidade.setId(i + 1);
            entidade.setAtivo(true);
            entidades.add(entidade);
            when(candidatoMapper.toMatchDTO(entidade)).thenReturn(candidatos.get(i));
        }
        when(candidatoRepository.findByAtivo(true)).thenReturn(entidades);

        return new MatchingService(candidatoRepository, candidatoMapper);
    }

    @Test
    void exportJavaReferenceForPythonParity() throws IOException {
        List<CandidatoMatchDTO> sourceCandidates = candidatosDeReferencia();
        MatchingService matchingService = construirMatchingServiceComFonte(sourceCandidates);

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