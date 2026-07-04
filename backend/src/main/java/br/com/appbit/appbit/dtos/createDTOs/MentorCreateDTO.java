package br.com.appbit.appbit.dtos.createDTOs;

import jakarta.validation.constraints.NotNull;

public record MentorCreateDTO(
                @NotNull(message = "A skill é obrigatória") String nome,

                @NotNull(message = "A skill é obrigatória") String empresaOrigem,

                @NotNull(message = "A skill é obrigatória") String cargo,

                @NotNull(message = "A skill é obrigatória") String especialidadeEsg,

                @NotNull(message = "A skill é obrigatória") String disponibilidade) {
}
