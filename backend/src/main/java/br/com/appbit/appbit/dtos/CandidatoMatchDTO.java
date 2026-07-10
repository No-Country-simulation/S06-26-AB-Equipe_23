package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CandidatoMatchDTO(
        @JsonProperty("candidato_id") String candidatoId,
        @JsonProperty("apelido_exibicao") String apelidoExibicao,
        @JsonProperty("cargo_alvo") String cargoAlvo,
        String nivel,
        String regiao,
        @JsonProperty("modelo_trabalho_preferido") String modeloTrabalhoPreferido,
        List<String> skills,
        @JsonProperty("anos_experiencia") Integer anosExperiencia,
        @JsonProperty("badge_diversidade") String badgeDiversidade,
        @JsonProperty("score_match") Integer scoreMatch
) {
}
