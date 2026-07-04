package br.com.appbit.appbit.dtos.updateDTOs;

import jakarta.validation.constraints.NotBlank;

public record CandidatoSkillUpdateDTO(

        @NotBlank(message = "O nível é obrigatório")
        String nivel

) {
}
