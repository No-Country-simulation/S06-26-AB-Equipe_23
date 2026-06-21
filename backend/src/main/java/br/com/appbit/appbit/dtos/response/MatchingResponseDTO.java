package br.com.appbit.appbit.dtos.response;

import java.util.List;

import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import br.com.appbit.appbit.dtos.MetricaDiversidadeDTO;

public record MatchingResponseDTO(

        String vagaId,

        Integer totalAnalisados,

        Integer totalRetorno,

        MetricaDiversidadeDTO metricaDiversidade,

        List<CandidatoMatchDTO> candidatos
) {


}
