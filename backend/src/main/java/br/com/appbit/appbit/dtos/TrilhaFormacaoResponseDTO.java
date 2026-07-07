package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TrilhaFormacaoResponseDTO(
        @JsonProperty("trilha_id")
        Integer trilhaId,

        @JsonProperty("nome_trilha")
        String nomeTrilha,

        @JsonProperty("descricao_conteudo")
        String descricaoConteudo,

        @JsonProperty("carga_horaria")
        String cargaHoraria,

        @JsonProperty("link_midia")
        String linkMidia
) {
}
