package br.com.appbit.appbit.dtos.createDTOs;

import jakarta.validation.constraints.NotBlank;

public record SkillCreateDTO(

        Integer id,

        @NotBlank(message = "O nome da skill é obrigatório")
        String nome,

        String categoria
) {
}
