package br.com.appbit.appbit.dtos;

import java.math.BigDecimal;
import java.util.List;

public record CandidatoMatchDTO(
                String candidatoId,

                String apelidoExibicao,

                String statusIdentificacao,

                String cargoAlvo,

                String nivel,

                String regiao,

                String clusterResidencia,

                BigDecimal scoreMatch,

                List<String> skills,

                String badgeDiversidade,

                String explicacao

) {

}
