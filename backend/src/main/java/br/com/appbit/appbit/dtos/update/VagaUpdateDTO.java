package br.com.appbit.appbit.dtos.update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record VagaUpdateDTO(


        @NotBlank(message = "A empresa é obrigatória")
        String empresaId,

        @NotBlank(message = "O titulo é obrigatório")
        String titulo,

        @NotBlank(message = "O nivel é obrigatório")
        String nivel,

        String regiaoAlvo,

        BigDecimal diversidadeMinima,

        @NotNull(message = "O Antiviés é obrigatório")
        Boolean antiVies
) {
}
