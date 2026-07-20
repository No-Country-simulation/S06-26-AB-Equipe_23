package br.com.appbit.appbit.dtos;

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

        // CORRIGIDO: era String, mas regiaoAlvo é uma RegiaoEntity — recebe o ID (Integer)
        Integer regiaoAlvoId,

        BigDecimal diversidadeMinima,

        @NotNull(message = "O Antiviés é obrigatório")
        Boolean antiVies,

        java.util.List<String> skills,

        String descricao,

        String modalidade,

        String area,

        Boolean prioridadeMulheres,

        Boolean prioridadeNegros,

        Boolean prioridadePcd,

        Boolean prioridadeLgbt,

        Integer esgMatch

) {
}
