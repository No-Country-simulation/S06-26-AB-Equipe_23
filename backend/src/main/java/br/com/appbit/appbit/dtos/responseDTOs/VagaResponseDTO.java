package br.com.appbit.appbit.dtos.responseDTOs;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VagaResponseDTO(

        Integer id,

        String empresaId,

        String titulo,

        String nivel,

        RegiaoResponseDTO regiaoAlvo,

        BigDecimal diversidadeMinima,

        Boolean antiVies,

        LocalDateTime criacao

) {
}
