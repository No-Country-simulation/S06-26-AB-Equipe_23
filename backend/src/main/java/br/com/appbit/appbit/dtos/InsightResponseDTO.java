package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public record InsightResponseDTO(
        Map<String, String> fontes,
        String metodologia,
        @JsonProperty("total_regioes") Integer totalRegioes,
        List<RegiaoInsightDTO> regioes
) {
}
