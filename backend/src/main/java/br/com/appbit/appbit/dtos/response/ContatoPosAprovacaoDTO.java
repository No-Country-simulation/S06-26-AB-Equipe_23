package br.com.appbit.appbit.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ContatoPosAprovacaoDTO(
        @JsonProperty("nome") String nome,
        @JsonProperty("email") String email,
        @JsonProperty("telefone") String telefone,
        @JsonProperty("linkedin") String linkedin
) {
}
