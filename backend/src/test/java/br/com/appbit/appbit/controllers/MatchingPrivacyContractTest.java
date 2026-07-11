package br.com.appbit.appbit.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

@SpringBootTest
@ActiveProfiles("test")
class MatchingPrivacyContractTest {

    private static final List<String> FORBIDDEN_FIELDS = List.of(
            "nome", "email", "telefone", "linkedin", "cep", "lat", "lon",
            "endereco", "cluster_residencia", "contato_pos_aprovacao"
    );

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = webAppContextSetup(context).apply(springSecurity()).build();
    }

    @Test
    void matchRejectsUnauthenticatedRequests() throws Exception {
        mockMvc.perform(post("/match")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "privacy-reviewer")
    void matchReturnsStableAliasWithoutPersonalData() throws Exception {
        JsonNode first = executeMatch();
        JsonNode second = executeMatch();

        assertEquals(8, first.path("total_analisados").asInt());
        assertEquals(8, first.path("total_retorno").asInt());
        assertEquals(8, first.path("candidatos").size());

        Map<String, String> aliases = new HashMap<>();
        List<Integer> scores = new ArrayList<>();

        for (JsonNode candidate : first.path("candidatos")) {
            String id = candidate.path("candidato_id").asText();
            String alias = candidate.path("apelido_exibicao").asText();

            assertFalse(id.isBlank());
            assertTrue(alias.matches("Candidato A-\\d{3}"));
            assertFalse(candidate.path("cargo_alvo").asText().isBlank());
            assertTrue(candidate.path("skills").isArray());

            FORBIDDEN_FIELDS.forEach(field ->
                    assertFalse(candidate.has(field), () -> "Campo proibido no /match: " + field));

            aliases.put(id, alias);
            scores.add(candidate.path("score_match").asInt());
        }

        for (JsonNode candidate : second.path("candidatos")) {
            assertEquals(
                    aliases.get(candidate.path("candidato_id").asText()),
                    candidate.path("apelido_exibicao").asText()
            );
        }

        for (int index = 0; index < scores.size() - 1; index++) {
            assertTrue(scores.get(index) >= scores.get(index + 1));
        }
    }

    @Test
    @WithMockUser(username = "privacy-reviewer")
    void contactsAppearOnlyAfterAuthorizedApproval() throws Exception {
        mockMvc.perform(post("/match/aprovar-candidato")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"candidato_id\":\"cand_001\",\"empresa_id\":\"empresa_teste\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.candidato_id").value("cand_001"))
                .andExpect(jsonPath("$.apelido_exibicao").isNotEmpty())
                .andExpect(jsonPath("$.contato_liberado.nome").isNotEmpty())
                .andExpect(jsonPath("$.contato_liberado.email").isNotEmpty());
    }

    private JsonNode executeMatch() throws Exception {
        MvcResult result = mockMvc.perform(post("/match")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"filtros\":{\"limite_resultados\":8}}"))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsString());
        assertNotNull(response);
        return response;
    }

    @Test
    void prometheusEndpointExposedAndPublic() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/actuator/prometheus"))
                .andExpect(status().isOk());
    }
}
