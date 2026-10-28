package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record ReprovacaoRequestDTO(

        @NotBlank(message = "O candidato_id é obrigatório")
        @JsonProperty("candidato_id")
        String candidatoId,

        @NotBlank(message = "O empresa_id é obrigatório")
        @JsonProperty("empresa_id")
        String empresaId,

        @JsonProperty("vaga_id")
        Integer vagaId,

        @NotBlank(message = "O motivo da reprovação é obrigatório")
        @JsonProperty("motivo")
        String motivo,

        @JsonProperty("anotacoes")
        String anotacoes
) {
}
