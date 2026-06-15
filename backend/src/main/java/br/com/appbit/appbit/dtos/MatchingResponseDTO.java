package br.com.appbit.appbit.dtos;

import java.util.List;

public record MatchingResponseDTO(

        String vagaId,

        Integer totalAnalisados,

        Integer totalRetorno,

        MetricaDiversidadeDTO metricaDiversidade,

        List<CandidatoMatchDTO> candidatos
) {


}
