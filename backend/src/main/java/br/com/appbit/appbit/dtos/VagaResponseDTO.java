package br.com.appbit.appbit.dtos;

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

        java.util.List<String> skills,

        String descricao,

        String modalidade,

        String area,

        Boolean prioridadeMulheres,

        Boolean prioridadeNegros,

        Boolean prioridadePcd,

        Boolean prioridadeLgbt,

        Integer esgMatch,

        LocalDateTime criacao

) {
}
