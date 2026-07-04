package br.com.appbit.appbit.dtos.utilDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ContatoAprovadoDTO(

        @JsonProperty("candidato_id")
        String candidatoId,

        @JsonProperty("apelido_exibicao")
        String apelidoExibicao,

        @JsonProperty("contato_liberado")
        ContatoDTO contatoLiberado
) {
    public record ContatoDTO(
            String nome,
            String email,
            String telefone,
            String linkedin
    ) {
    }
}
