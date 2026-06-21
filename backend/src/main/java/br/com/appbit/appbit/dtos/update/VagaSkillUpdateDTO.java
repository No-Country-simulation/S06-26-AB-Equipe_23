package br.com.appbit.appbit.dtos.update;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record VagaSkillUpdateDTO(

        @NotNull(message = "O Peso é obrigatório")
        BigDecimal peso

) {
}
