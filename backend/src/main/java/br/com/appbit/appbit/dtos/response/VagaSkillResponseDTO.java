package br.com.appbit.appbit.dtos.response;

import java.math.BigDecimal;

public record VagaSkillResponseDTO(

        Integer vagaId,

        Integer skillId,

        BigDecimal peso


) {
}
