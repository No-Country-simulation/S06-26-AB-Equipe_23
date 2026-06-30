package br.com.appbit.appbit.dtos;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MatchCreateDTO(
                
                @NotNull(message = "O Score match é obrigatório") BigDecimal scoreMatch,

                @NotNull(message = "O Score skill é obrigatório") BigDecimal scoreSkills,

                @NotNull(message = "O Score nivel é obrigatório") BigDecimal scoreNivel,

                @NotNull(message = "O Score regiao é obrigatório") BigDecimal scoreRegiao,

                @NotNull(message = "O Score diversidade é obrigatório") BigDecimal scoreDiversidade,

                String badgeDiversidade,

                String justificativa,

                @NotNull(message = "A vaga é obrigatória") Integer vagaId,

                @NotNull(message = "O candidato é obrigatório") String candidatoId,

                LocalDateTime dataCriacao
            ) {     
}
