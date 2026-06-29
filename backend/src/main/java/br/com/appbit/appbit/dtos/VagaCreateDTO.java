package br.com.appbit.appbit.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import br.com.appbit.appbit.entities.RegiaoEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VagaCreateDTO(

                Integer id,

                @NotBlank(message = "A empresa é obrigatória") String empresaId,

                @NotBlank(message = "O titulo é obrigatório") String titulo,

                @NotBlank(message = "O nivel é obrigatório") String nivel,

                Integer regiaoAlvoId,

                RegiaoEntity regiaoAlvo,

                BigDecimal diversidadeMinima,

                @NotNull(message = "O Antiviés é obrigatório") Boolean antiVies,

                LocalDateTime criacao

) {
}
