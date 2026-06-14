package br.com.appbit.appbit.dtos;

import java.math.BigDecimal;

public record VagaSkillResponseDTO(

        Integer vagaId,

        Integer skillId,

        BigDecimal peso


) {
}
