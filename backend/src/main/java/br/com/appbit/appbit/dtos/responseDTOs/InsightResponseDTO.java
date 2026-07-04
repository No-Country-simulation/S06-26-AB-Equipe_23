package br.com.appbit.appbit.dtos.responseDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.com.appbit.appbit.dtos.medidasDTOs.RegiaoInsightDTO;

import java.util.List;
import java.util.Map;

public record InsightResponseDTO(
        Map<String, String> fontes,
        String metodologia,
        @JsonProperty("total_regioes") Integer totalRegioes,
        List<RegiaoInsightDTO> regioes
) {
}
