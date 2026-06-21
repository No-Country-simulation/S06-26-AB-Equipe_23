package br.com.appbit.appbit.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record InsightsRegioesResponseDTO(
                @JsonProperty("total_regioes") Integer totalRegioes,
                @JsonProperty("regioes") List<RegiaoInsightDTO> regioes) {
}
