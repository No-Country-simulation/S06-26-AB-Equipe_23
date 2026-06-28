package br.com.appbit.appbit.dtos;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record RegiaoUpdateDTO(

        @NotBlank(message = "O cluster é obrigatório")
        String cluster,

        @NotBlank(message = "O municipio é obrigatório")
        String municipio,

        BigDecimal lat,

        BigDecimal lon,

        String perfil,

        @NotBlank(message = "A fonte é obrigatória")
        String fonte
) {
}
