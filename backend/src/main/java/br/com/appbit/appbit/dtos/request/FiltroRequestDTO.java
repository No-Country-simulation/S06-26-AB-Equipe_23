package br.com.appbit.appbit.dtos.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record FiltroRequestDTO(
        @JsonProperty("anti_vies")
        Boolean antiVies,

        @JsonProperty("diversidade_minima")
        Integer diversidadeMinima,

        @JsonProperty("limite_resultados")
        Integer limiteResultados

) {
}
