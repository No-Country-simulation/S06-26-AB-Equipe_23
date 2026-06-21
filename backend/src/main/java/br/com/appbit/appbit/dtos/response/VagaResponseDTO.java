package br.com.appbit.appbit.dtos.response;


import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VagaResponseDTO(

        Integer id,

        String empresaId,

        String titulo,

        String nivel,

        String regiaoAlvo,

        BigDecimal diversidadeMinima,

        Boolean antiVies,

        LocalDateTime criacao
) {
}
