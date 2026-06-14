package br.com.appbit.appbit.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CandidatoSkillCreateDTO(

        @NotNull(message = "O candidato é obrigatório")
        Integer candidatoId,

        @NotNull(message = "A skill é obrigatória")
        Integer skillId,

        @NotBlank(message = "O nível é obrigatório")
        String nivel

) {
}
