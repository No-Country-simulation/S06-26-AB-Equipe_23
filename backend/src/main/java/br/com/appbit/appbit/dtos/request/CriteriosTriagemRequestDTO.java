package br.com.appbit.appbit.dtos.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * * Critérios de triagem enviados pelo Front-end em POST /match.
 * * Contrato estrito: requisições sem os campos obrigatórios, ou com
 * * score_minimo fora da faixa 0-100, são rejeitadas com 400 antes de
 * * qualquer processamento (ver GlobalExceptionHandler).
 */
public record CriteriosTriagemRequestDTO(

        @NotBlank(message = "regiao é obrigatória")
        @JsonProperty("regiao")
        String regiao,

        @NotBlank(message = "cargo_alvo é obrigatório")
        @JsonProperty("cargo_alvo")
        String cargoAlvo,

        @NotNull(message = "score_minimo é obrigatório")
        @Min(value = 0, message = "score_minimo deve ser maior ou igual a 0")
        @Max(value = 100, message = "score_minimo deve ser menor ou igual a 100")
        @JsonProperty("score_minimo")
        Integer scoreMinimo,

        @JsonProperty("modelo_trabalho_preferido")
        String modeloTrabalhoPreferido

) {
}
