package br.com.appbit.appbit.dtos.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MatchingRequestDTO(

        @JsonProperty("empresa_id")
        String empresaId,

        VagaRequestDTO vaga,

        FiltroRequestDTO filtros
) {
}
