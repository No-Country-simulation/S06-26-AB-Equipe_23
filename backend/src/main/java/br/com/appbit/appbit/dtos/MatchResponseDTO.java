package br.com.appbit.appbit.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MatchResponseDTO(

        Long id,

        BigDecimal scoreMatch,

        BigDecimal scoreSkills,

        BigDecimal scoreNivel,

        BigDecimal scoreRegiao,

        BigDecimal scoreDiversidade,

        String badgeDiversidade,

        String justificativa,

        Integer vagaId,

        Integer candidatoId

) {
}
