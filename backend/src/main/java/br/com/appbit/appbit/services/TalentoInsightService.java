package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoCompletoDTO;
import br.com.appbit.appbit.dtos.MapaTalentoDTO;
import br.com.appbit.appbit.dtos.MapaTalentosResponseDTO;
import br.com.appbit.appbit.dtos.RegiaoInsightDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TalentoInsightService {

    private final CandidatoMockService candidatoMockService;
    private final InsightService insightService;

    @SuppressWarnings("null")
public MapaTalentosResponseDTO obterMapaTalentos() {
        List<CandidatoCompletoDTO> candidatos = candidatoMockService.listarParaInsights();
        List<RegiaoInsightDTO> regioes = insightService.obterInsights().regioes();

        // agrupa candidatos por cluster de residência
        Map<String, List<CandidatoCompletoDTO>> porCluster = candidatos.stream()
                .filter(c -> c.clusterResidencia() != null)
                .collect(Collectors.groupingBy(CandidatoCompletoDTO::clusterResidencia));

        List<MapaTalentoDTO> mapa = regioes.stream()
                .map(regiao -> {
                    List<CandidatoCompletoDTO> doCluster =
                            porCluster.getOrDefault(regiao.cluster(), List.of());

                    List<String> perfis = doCluster.stream()
                            .map(CandidatoCompletoDTO::cargoAlvo)
                            .filter(Objects::nonNull)
                            .distinct()
                            .toList();

                    return new MapaTalentoDTO(
                            regiao.municipio(),
                            doCluster.size(),
                            regiao.tecnologiaPredominanteRegiao(),
                            perfis
                    );
                })
                // opcional: só mostra regiões que de fato têm algum talento mapeado
                .filter(m -> m.concentracao() > 0)
                .sorted(Comparator.comparing(MapaTalentoDTO::concentracao).reversed())
                .toList();

        return new MapaTalentosResponseDTO(mapa);
    }
}
