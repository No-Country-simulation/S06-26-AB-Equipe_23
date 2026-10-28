package br.com.appbit.appbit.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CandidatoAccountRegistrationRequestDTO(
        @NotNull(message = "Os dados do perfil são obrigatórios")
        @Valid
        CandidatoCreateDTO perfil,

        @NotBlank(message = "A senha é obrigatória")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "A senha deve ter ao menos 8 caracteres, com maiúscula, minúscula e número"
        )
        String password,

        @NotBlank(message = "A confirmação da senha é obrigatória")
        String confirmPassword
) {
}
