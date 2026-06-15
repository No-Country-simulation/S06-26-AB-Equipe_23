package br.com.appbit.appbit.dtos;

public record FiltroRequestDTO(
        Boolean antiVies,

        Integer diversidadeMinima,

        Integer limiteResultados

) {
}
