package br.com.appbit.appbit.dtos;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record VagaSkillCreateDTO(

        @NotNull(message = "A vaga é obrigatória")
        Integer vagaId,

        @NotNull(message = "A skill é obrigatória")
        Integer skillId,

        @NotNull(message = "o peso é obrigatório")
        BigDecimal peso

) {
}
