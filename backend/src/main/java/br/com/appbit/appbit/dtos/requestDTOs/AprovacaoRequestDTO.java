package br.com.appbit.appbit.dtos.requestDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record AprovacaoRequestDTO(

        @NotBlank(message = "O candidato_id é obrigatório")
        @JsonProperty("candidato_id")
        String candidatoId,

        @NotBlank(message = "O empresa_id é obrigatório")
        @JsonProperty("empresa_id")
        String empresaId
) {
}
