package br.com.appbit.appbit.config;

import br.com.appbit.appbit.entities.UsuarioEntity;
import br.com.appbit.appbit.repositories.UsuarioRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public OAuth2SuccessHandler(
            UsuarioRepository usuarioRepository,
            JwtUtil jwtUtil,
            @Lazy PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String nome = oAuth2User.getAttribute("name");

        if (email == null) {
            log.error("Email não retornado pelo provedor OAuth2");
            response.sendRedirect(frontendUrl + "/login?error=email_not_provided");
            return;
        }

        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("Usuário corporativo não encontrado. Cadastrando automaticamente: {}", email);
                    UsuarioEntity novo = new UsuarioEntity();
                    novo.setEmail(email);
                    novo.setNome(nome != null ? nome : "Recrutador Corporativo");
                    novo.setSenhaHash(passwordEncoder.encode(UUID.randomUUID().toString()));
                    novo.setAtivo(true);
                    return usuarioRepository.save(novo);
                });

        if (!usuario.getAtivo()) {
            log.warn("Usuário corporativo {} está inativo no sistema.", email);
            response.sendRedirect(frontendUrl + "/login?error=user_inactive");
            return;
        }

        String jwtToken = jwtUtil.gerarToken(usuario.getEmail(), usuario.getNome(), usuario.getEmpresaId());
        
        String targetUrl = frontendUrl + "/oauth2/redirect?token=" + jwtToken;
        log.info("Autenticação OAuth2 de sucesso para {}. Redirecionando para o frontend.", email);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
