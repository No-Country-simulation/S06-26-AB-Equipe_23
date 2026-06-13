package br.com.appbit.appbit.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CandidatoCreateDTO(

        @NotBlank(message = "O nome é obrigatório")
        String nome,

        String cargo,

        @NotBlank(message = "O nivel é obrigatório")
        String nivel,

        String cluster,

        String municipio,

        String grupo,

        String diversidade,

        String disponibilidade,

        @NotNull(message = "O status é obrigatório")
        Boolean ativo,

        @NotNull(message = "A região é obrigatória")
        Integer regiaoId
) {
}
