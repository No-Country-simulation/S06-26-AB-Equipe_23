package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public record EventoEstruturanteResponseDTO(
        @JsonProperty("evento_id")
        Integer eventoId,

        @JsonProperty("nome_evento")
        String nomeEvento,

        @JsonProperty("data")
        LocalDate data,

        @JsonProperty("horario")
        String horario,

        @JsonProperty("local")
        String local,

        @JsonProperty("detalhes")
        String detalhes,

        @JsonProperty("tema_palestra")
        String temaPalestra,

        @JsonProperty("palestrantes")
        String palestrantes
) {
}
