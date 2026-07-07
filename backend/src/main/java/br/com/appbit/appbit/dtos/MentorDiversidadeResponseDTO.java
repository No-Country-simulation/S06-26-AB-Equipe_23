package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MentorDiversidadeResponseDTO(
        @JsonProperty("mentor_id")
        Integer mentorId,

        @JsonProperty("nome_mentor")
        String nomeMentor,

        @JsonProperty("empresa_origem")
        String empresaOrigem,

        @JsonProperty("cargo")
        String cargo,

        @JsonProperty("especialidade_esg")
        String especialidadeEsg,

        @JsonProperty("disponibilidade")
        String disponibilidade
) {
}
