package br.com.appbit.appbit.dtos;

public record CandidatoResponseDTO(

        Integer id,

        String nome,

        String cargo,

        String nivel,

        String cluster,

        String municipio,

        String cep,

        Double lat,

        Double lon,

        String grupo,

        String diversidade,

        String disponibilidade,

        Boolean ativo,

        Integer regiaoId

) {
}
