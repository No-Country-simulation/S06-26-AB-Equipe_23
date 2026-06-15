package br.com.appbit.appbit.dtos;

public record MatchingRequestDTO(

        String empresaId,

        VagaRequestDTO vaga,

        FiltroRequestDTO filtros
) {
}
