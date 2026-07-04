package br.com.appbit.appbit.dtos.createDTOs;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record VagaSkillCreateDTO(

                @NotNull(message = "A vaga é obrigatória") Integer vagaId,

                @NotNull(message = "A skill é obrigatória") Integer skillId,

                @NotNull(message = "O peso é obrigatório") @DecimalMin(value = "0.0", inclusive = false, message = "O peso deve ser maior que 0") @DecimalMax(value = "100.0", message = "O peso não pode exceder 100") BigDecimal peso

) {
}
