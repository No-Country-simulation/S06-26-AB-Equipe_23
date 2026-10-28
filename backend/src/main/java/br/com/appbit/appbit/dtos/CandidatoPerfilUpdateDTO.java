package br.com.appbit.appbit.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CandidatoPerfilUpdateDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O cargo desejado é obrigatório")
        String cargo,

        @NotBlank(message = "O nível é obrigatório")
        String nivel,

        @NotNull(message = "Os anos de experiência são obrigatórios")
        @Min(0)
        @Max(40)
        Integer anosExperiencia,

        @NotBlank(message = "A modalidade de trabalho é obrigatória")
        String disponibilidade,

        @NotNull(message = "A região é obrigatória")
        Integer regiaoId,

        String telefone,
        String linkedin,
        String grupo,
        String diversidade,
        List<String> skills
) {
}
