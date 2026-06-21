package br.com.appbit.appbit.dtos.create;

import jakarta.validation.constraints.NotBlank;

public record SkillCreateDTO(

        @NotBlank(message = "O nome da skill é obrigatório")
        String nome,

        String categoria
) {
}
