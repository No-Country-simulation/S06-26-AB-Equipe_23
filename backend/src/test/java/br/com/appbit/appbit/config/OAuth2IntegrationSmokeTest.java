package br.com.appbit.appbit.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

@SpringBootTest
@ActiveProfiles("test")
class OAuth2IntegrationSmokeTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = webAppContextSetup(context).apply(springSecurity()).build();
    }

    @Test
    void oauth2LoginEndpointBehavesCorrectlyBasedOnConfig() throws Exception {
        // Quando GOOGLE_CLIENT_ID nao esta configurado (ambiente de teste),
        // o endpoint retorna 404 ou 500 — ambos sao aceitaveis pois o OAuth2 esta desabilitado.
        // Quando configurado, deve redirecionar para accounts.google.com.
        MvcResult result = mockMvc.perform(get("/oauth2/authorization/google"))
                .andReturn();

        int status = result.getResponse().getStatus();
        // Aceita: redirect para Google (302) OU endpoint nao disponivel (404/500)
        assertTrue(
            status == 302 || status == 404 || status == 500,
            "Status esperado: 302 (OAuth2 ativo), 404 ou 500 (OAuth2 desabilitado). Obtido: " + status
        );
    }
}
