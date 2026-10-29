package br.com.appbit.appbit.config;

import br.com.appbit.appbit.entities.UsuarioEntity;
import br.com.appbit.appbit.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OAuth2SuccessHandlerTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Mock
    private HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    private OAuth2SuccessHandler handler;

    @BeforeEach
    void setUp() {
        handler = new OAuth2SuccessHandler(
                usuarioRepository,
                jwtUtil,
                passwordEncoder,
                authorizationRequestRepository
        );
        ReflectionTestUtils.setField(handler, "frontendUrl", "https://frontend.example");
    }

    @Test
    void candidateGoogleLoginPreservesCandidateRoleAndId() throws Exception {
        UsuarioEntity candidate = new UsuarioEntity();
        candidate.setEmail("candidate@example.com");
        candidate.setNome("Pessoa Candidata");
        candidate.setTipoUsuario("CANDIDATO");
        candidate.setCandidatoId(42);

        when(usuarioRepository.findByEmailIgnoreCase("CANDIDATE@example.com"))
                .thenReturn(Optional.of(candidate));
        when(jwtUtil.gerarToken(
                "candidate@example.com",
                "Pessoa Candidata",
                null,
                "CANDIDATO",
                42
        )).thenReturn("candidate-jwt");

        MockHttpServletResponse response = authenticate(
                "CANDIDATE@example.com",
                true
        );

        assertEquals(
                "https://frontend.example/oauth2/redirect?token=candidate-jwt",
                response.getRedirectedUrl()
        );
        verify(usuarioRepository).findByEmailIgnoreCase("CANDIDATE@example.com");
        verify(jwtUtil).gerarToken(
                "candidate@example.com",
                "Pessoa Candidata",
                null,
                "CANDIDATO",
                42
        );
    }

    @Test
    void rejectsGoogleLoginWhenEmailIsNotVerified() throws Exception {
        MockHttpServletResponse response = authenticate(
                "candidate@example.com",
                false
        );

        assertEquals(
                "https://frontend.example/login?error=email_not_verified",
                response.getRedirectedUrl()
        );
        verify(usuarioRepository, never()).findByEmailIgnoreCase("candidate@example.com");
        verify(jwtUtil, never()).gerarToken(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any()
        );
    }

    private MockHttpServletResponse authenticate(String email, boolean emailVerified) throws Exception {
        var oauthUser = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of(
                        "email", email,
                        "name", "Pessoa Candidata",
                        "email_verified", emailVerified
                ),
                "email"
        );
        var authentication = new UsernamePasswordAuthenticationToken(
                oauthUser,
                null,
                oauthUser.getAuthorities()
        );
        var request = new MockHttpServletRequest();
        var response = new MockHttpServletResponse();

        handler.onAuthenticationSuccess(request, response, authentication);
        return response;
    }
}
