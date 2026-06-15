package br.com.appbit.appbit.dtos;

import java.util.List;

public record CandidatoMatchDTO(
        String candidatoId,

        String apelidoExibicao,

        String statusIdentificacao,

        String cargoAlvo,

        String nivel,

        String regiao,

        String clusterResidencia,

        Integer scoreMatch,

        List<String> skills,

        String badgeDiversidade,

        String explicacao

) {

}
