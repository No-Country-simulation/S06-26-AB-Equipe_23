package br.com.appbit.appbit.dtos.responseDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.com.appbit.appbit.dtos.medidasDTOs.MetricaDiversidadeDTO;
import br.com.appbit.appbit.dtos.utilDTOs.CandidatoMatchDTO;

import java.util.List;

public record MatchingResponseDTO(
                @JsonProperty("fonte_candidatos") String fonteCandidatos,
                @JsonProperty("total_analisados") Integer totalAnalisados,
                @JsonProperty("total_retorno") Integer totalRetorno,
                @JsonProperty("regra_privacidade") String regraPrivacidade,
                @JsonProperty("metrica_diversidade") MetricaDiversidadeDTO metricaDiversidade,
                List<CandidatoMatchDTO> candidatos) {
}
