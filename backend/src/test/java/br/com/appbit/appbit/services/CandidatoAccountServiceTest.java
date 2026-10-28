package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoAccountRegistrationRequestDTO;
import br.com.appbit.appbit.dtos.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.CandidatoPerfilUpdateDTO;
import br.com.appbit.appbit.dtos.LoginRequestDTO;
import br.com.appbit.appbit.dtos.LoginResponseDTO;
import br.com.appbit.appbit.repositories.RegiaoRepository;
import br.com.appbit.appbit.repositories.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

@SpringBootTest
@ActiveProfiles("test")
class CandidatoAccountServiceTest {

    @Autowired
    private CandidatoAccountService candidatoAccountService;

    @Autowired
    private AuthService authService;

    @Autowired
    private RegiaoRepository regiaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = webAppContextSetup(context).apply(springSecurity()).build();
    }

    @Test
    void candidateCanRegisterLogInAndManageOnlyTheirOwnProfile() throws Exception {
        String email = "novo-candidato-" + System.nanoTime() + "@exemplo.com";
        String password = "SenhaCandidato123";
        Integer regionId = regiaoRepository.findAll().get(0).getId();
        CandidatoCreateDTO profile = candidateProfile(email, regionId);

        LoginResponseDTO registered = candidatoAccountService.registrar(
                new CandidatoAccountRegistrationRequestDTO(profile, password, password));

        assertEquals("CANDIDATO", registered.tipoUsuario());
        assertTrue(registered.candidatoId() != null);
        assertTrue(passwordEncoder.matches(
                password,
                usuarioRepository.findByEmailIgnoreCase(email).orElseThrow().getSenhaHash()));

        LoginResponseDTO loggedIn = authService.login(new LoginRequestDTO(email, password));
        assertEquals("CANDIDATO", loggedIn.tipoUsuario());
        assertEquals(registered.candidatoId(), loggedIn.candidatoId());

        assertEquals(email, candidatoAccountService.buscarMeuPerfil(email).email());
        var updated = candidatoAccountService.atualizarMeuPerfil(
                email,
                new CandidatoPerfilUpdateDTO(
                        "Pessoa Candidata Atualizada",
                        "Analista de Dados",
                        "Sênior",
                        3,
                        "Remoto",
                        regionId,
                        "11999999999",
                        "https://linkedin.com/in/candidato",
                        null,
                        null,
                        List.of("Python", "SQL")
                )
        );
        assertEquals("Pessoa Candidata Atualizada", updated.nome());
        assertEquals(List.of("Python", "SQL"), updated.skills());

        mockMvc.perform(get("/candidato/me")
                        .header("Authorization", "Bearer " + registered.token()))
                .andExpect(status().isOk());
        mockMvc.perform(get("/candidatos")
                        .header("Authorization", "Bearer " + registered.token()))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/vagas")
                        .header("Authorization", "Bearer " + registered.token()))
                .andExpect(status().isForbidden());

        LoginResponseDTO recruiter = authService.login(
                new LoginRequestDTO("recrutador@appbit.com.br", "Recrutador@Bit2026!"));
        mockMvc.perform(get("/candidato/me")
                        .header("Authorization", "Bearer " + recruiter.token()))
                .andExpect(status().isForbidden());
    }

    @Test
    void candidateRegistrationEndpointIsPublicAndReturnsCandidateRole() throws Exception {
        String email = "novo-cadastro-http-" + System.nanoTime() + "@exemplo.com";
        Integer regionId = regiaoRepository.findAll().get(0).getId();
        var request = new CandidatoAccountRegistrationRequestDTO(
                candidateProfile(email, regionId),
                "SenhaCandidato123",
                "SenhaCandidato123"
        );

        mockMvc.perform(post("/cadastro-candidato")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tipo_usuario").value("CANDIDATO"))
                .andExpect(jsonPath("$.candidato_id").isNumber());
    }

    @Test
    void candidateRegistrationRejectsDuplicateEmailAndMismatchedPasswords() {
        String email = "candidato-duplicado-" + System.nanoTime() + "@exemplo.com";
        Integer regionId = regiaoRepository.findAll().get(0).getId();
        CandidatoCreateDTO profile = candidateProfile(email, regionId);
        candidatoAccountService.registrar(
                new CandidatoAccountRegistrationRequestDTO(profile, "SenhaCandidato123", "SenhaCandidato123"));

        ResponseStatusException duplicate = assertThrows(
                ResponseStatusException.class,
                () -> candidatoAccountService.registrar(
                        new CandidatoAccountRegistrationRequestDTO(
                                profile, "OutraSenha123", "OutraSenha123")));
        assertEquals(409, duplicate.getStatusCode().value());

        ResponseStatusException mismatch = assertThrows(
                ResponseStatusException.class,
                () -> candidatoAccountService.registrar(
                        new CandidatoAccountRegistrationRequestDTO(
                                candidateProfile("novo-" + System.nanoTime() + "@exemplo.com", regionId),
                                "SenhaCandidato123",
                                "SenhaDiferente123")));
        assertEquals(400, mismatch.getStatusCode().value());
    }

    private CandidatoCreateDTO candidateProfile(String email, Integer regionId) {
        return new CandidatoCreateDTO(
                "Pessoa Candidata Teste",
                "Desenvolvedora de Software",
                "Pleno",
                null,
                "Florianópolis",
                null,
                null,
                null,
                null,
                null,
                "Híbrido",
                true,
                regionId
        ).withEmail(email);
    }
}
