package br.com.appbit.appbit.dtos.error;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ErroPadraoResponseDTO(
        @JsonProperty("status") Integer status,
        @JsonProperty("mensagem") String mensagem
) {
}
