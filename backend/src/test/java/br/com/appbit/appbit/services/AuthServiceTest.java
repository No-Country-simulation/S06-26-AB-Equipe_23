package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.LoginRequestDTO;
import br.com.appbit.appbit.dtos.LoginResponseDTO;
import br.com.appbit.appbit.dtos.CadastroRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private Environment environment;

    @Test
    void productionDatasourceConfigurationIsLoadedFromApplicationYaml() {
        String jdbcUrl = environment.getProperty("spring.datasource.primary.jdbc-url");

        assertTrue(jdbcUrl != null && jdbcUrl.startsWith("jdbc:mysql://"));
        assertTrue(jdbcUrl.contains("/appbit?"));
    }

    @Test
    void seededRecruiterCanLogInWithConfiguredPassword() {
        LoginResponseDTO response = authService.login(
                new LoginRequestDTO("  RECRUTADOR@appbit.com.br ", "Recrutador@Bit2026!")
        );

        assertFalse(response.token().isBlank());
        assertEquals("recrutador@appbit.com.br", response.email());
    }

    @Test
    void registrationCreatesAccountThatCanLogIn() {
        String email = "novo-recrutador-" + System.nanoTime() + "@empresa.com";
        LoginResponseDTO registered = authService.cadastrar(
                new CadastroRequestDTO(email, "SenhaForte123", "Pessoa Recrutadora", "Empresa Exemplo")
        );

        assertFalse(registered.token().isBlank());
        assertEquals(email, registered.email());
        assertTrue(registered.empresaId().startsWith("emp_"));

        LoginResponseDTO loggedIn = authService.login(new LoginRequestDTO(email, "SenhaForte123"));
        assertEquals(email, loggedIn.email());
        assertFalse(loggedIn.token().isBlank());
    }

    @Test
    void registrationRejectsExistingEmailRegardlessOfCaseOrAccountStatus() {
        ResponseStatusException error = assertThrows(
                ResponseStatusException.class,
                () -> authService.cadastrar(new CadastroRequestDTO(
                        " RECRUTADOR@appbit.com.br ",
                        "SenhaForte123",
                        "Outra Pessoa",
                        "Outra Empresa"
                ))
        );

        assertEquals(409, error.getStatusCode().value());
    }
}
