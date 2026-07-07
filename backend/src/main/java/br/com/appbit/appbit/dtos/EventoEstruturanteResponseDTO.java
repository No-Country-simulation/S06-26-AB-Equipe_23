package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public record EventoEstruturanteResponseDTO(
        @JsonProperty("evento_id")
        Integer eventoId,

        @JsonProperty("nome_evento")
        String nomeEvento,

        LocalDate data,

        String horario,

        String local,

        String detalhes,

        @JsonProperty("tema_palestra")
        String temaPalestra,

        String palestrantes
) {
}
