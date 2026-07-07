package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MentorDiversidadeResponseDTO(
        @JsonProperty("mentor_id")
        Integer mentorId,

        @JsonProperty("nome_mentor")
        String nomeMentor,

        @JsonProperty("empresa_origem")
        String empresaOrigem,

        String cargo,

        @JsonProperty("especialidade_esg")
        String especialidadeEsg,

        String disponibilidade
) {
}
