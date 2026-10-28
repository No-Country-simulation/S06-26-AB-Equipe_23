package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CadastroRequestDTO(
        @Email(message = "E-mail inválido")
        @Size(max = 180, message = "O e-mail deve ter no máximo 180 caracteres")
        @NotBlank(message = "O e-mail é obrigatório")
        String email,

        @JsonAlias("senha")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "A senha deve ter ao menos 8 caracteres, com maiúscula, minúscula e número"
        )
        @NotBlank(message = "A senha é obrigatória")
        String password,

        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        @NotBlank(message = "O nome do responsável é obrigatório")
        String nomePessoa,

        @Size(max = 120, message = "O nome da empresa deve ter no máximo 120 caracteres")
        @NotBlank(message = "O nome da empresa é obrigatório")
        String nomeEmpresa
) {
}
