package br.com.appbit.appbit.dtos.responseDTOs;

import java.math.BigDecimal;

public record RegiaoResponseDTO(

        Integer id,

        String cluster,

        String municipio,

        BigDecimal lat,

        BigDecimal lon,

        String perfil,

        String fonte
) {
}
