package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record ReprovacaoResponseDTO(

        @JsonProperty("status")
        String status,

        @JsonProperty("candidato_id")
        String candidatoId,

        @JsonProperty("motivo")
        String motivo,

        @JsonProperty("anotacoes")
        String anotacoes,

        @JsonProperty("registrado_em")
        LocalDateTime registradoEm
) {
}
