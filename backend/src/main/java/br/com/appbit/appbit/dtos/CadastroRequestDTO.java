package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CadastroRequestDTO(
        @Email(message = "E-mail inválido")
        @NotBlank(message = "O e-mail é obrigatório")
        String email,

        @JsonAlias("senha")
        @NotBlank(message = "A senha é obrigatória")
        String password,

        @NotBlank(message = "O nome do responsável é obrigatório")
        String nomePessoa,

        @NotBlank(message = "O nome da empresa é obrigatório")
        String nomeEmpresa
) {
}
