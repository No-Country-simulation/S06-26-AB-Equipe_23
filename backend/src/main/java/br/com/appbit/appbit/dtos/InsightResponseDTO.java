package br.com.appbit.appbit.dtos;

import java.util.List;

public record InsightResponseDTO(
        String fonte,

        List<RegiaoInsightDTO> regioes
) {
}
