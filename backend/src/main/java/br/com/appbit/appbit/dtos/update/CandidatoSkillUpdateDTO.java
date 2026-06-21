package br.com.appbit.appbit.dtos.update;

import jakarta.validation.constraints.NotBlank;

public record CandidatoSkillUpdateDTO(

        @NotBlank(message = "O nível é obrigatório")
        String nivel

) {
}
