package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Representação completa do candidato — incluindo contato_pos_aprovacao.
 * Usado APENAS internamente pelo AprovacaoService para liberar contato.
 * Nunca deve ser serializado diretamente para o front.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record CandidatoCompletoDTO(

        @JsonProperty("candidato_id")
        String candidatoId,

        @JsonProperty("apelido_exibicao")
        String apelidoExibicao,

        @JsonProperty("contato_pos_aprovacao")
        ContatoAprovadoDTO.ContatoDTO contatoPosAprovacao
) {
}
