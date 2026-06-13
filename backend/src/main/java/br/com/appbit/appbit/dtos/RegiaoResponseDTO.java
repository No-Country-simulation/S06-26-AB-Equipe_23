package br.com.appbit.appbit.dtos;

import java.math.BigDecimal;

public record RegiaoResponseDTO(

        Integer id,

        String cluster,

        String municipio,

        BigDecimal latitude,

        BigDecimal longitude,

        String perfil,

        String fonte
) {
}
