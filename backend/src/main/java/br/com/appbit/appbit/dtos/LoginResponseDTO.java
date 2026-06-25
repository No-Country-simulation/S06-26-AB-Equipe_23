package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LoginResponseDTO(

        String token,

        @JsonProperty("token_type")
        String tokenType,

        @JsonProperty("expires_in")
        long expiresIn,

        String nome,
        String email,

        @JsonProperty("empresa_id")
        String empresaId
) {
    /** Construtor de conveniência — tipo sempre "Bearer". */
    public LoginResponseDTO(String token, long expiresIn,
                            String nome, String email, String empresaId) {
        this(token, "Bearer", expiresIn, nome, email, empresaId);
    }
}
