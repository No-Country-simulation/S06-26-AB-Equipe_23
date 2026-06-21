package br.com.appbit.appbit.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Versão pública do contato pós-aprovação, usada na listagem geral (POST /match).
 * <p>
 * ! Regra de privacidade: nome, email e telefone NÃO existem como campos nesta
 * classe. Isso é proposital — não é uma questão de "deixar nulo" ou filtrar
 * na serialização, o campo simplesmente não pode ser preenchido aqui, então
 * é estruturalmente impossível vazar o dado por acidente.
 * <p>
 * O linkedin não é considerado dado sensível pela regra de negócio e por isso
 * continua visível antes da aprovação.
 */
public record ContatoResumidoDTO(
        @JsonProperty("linkedin") String linkedin
) {
}
