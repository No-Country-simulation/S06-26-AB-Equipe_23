package br.com.appbit.appbit.dtos.error;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public record ErroValidacaoResponseDTO(
        @JsonProperty("status") Integer status,
        @JsonProperty("mensagem") String mensagem,
        @JsonProperty("erros") Map<String, String> erros
) {
}
