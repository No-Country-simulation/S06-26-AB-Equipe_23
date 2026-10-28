package br.com.appbit.appbit.services;

import br.com.appbit.appbit.config.JwtUtil;
import br.com.appbit.appbit.dtos.CadastroRequestDTO;
import br.com.appbit.appbit.dtos.LoginRequestDTO;
import br.com.appbit.appbit.dtos.LoginResponseDTO;
import br.com.appbit.appbit.entities.UsuarioEntity;
import br.com.appbit.appbit.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;
    private final JwtUtil           jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {
        String email = normalizeEmail(request.email());

        UsuarioEntity usuario = usuarioRepository
                .findByEmailAndAtivoTrue(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Credenciais inválidas"
                ));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        String token = jwtUtil.gerarToken(
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getEmpresaId()
        );

        return new LoginResponseDTO(
                token,
                jwtUtil.getExpirationMs() / 1000,   // segundos (para o front)
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getEmpresaId()
        );
    }

    public LoginResponseDTO cadastrar(CadastroRequestDTO request) {
        String email = normalizeEmail(request.email());
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(request.password()));
        usuario.setNome(request.nomePessoa().trim());
        usuario.setEmpresaId(gerarEmpresaId(request.nomeEmpresa()));
        usuario.setAtivo(true);

        UsuarioEntity salvo = usuarioRepository.save(usuario);
        String token = jwtUtil.gerarToken(salvo.getEmail(), salvo.getNome(), salvo.getEmpresaId());

        return new LoginResponseDTO(
                token,
                jwtUtil.getExpirationMs() / 1000,
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getEmpresaId()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String gerarEmpresaId(String nomeEmpresa) {
        String base = nomeEmpresa.trim();
        String slug = base.toLowerCase()
                .replaceAll("[^a-z0-9]+", "_")
                .replaceAll("^_+|_+$", "");
        if (slug.isBlank()) {
            slug = "empresa";
        }
        return "emp_" + slug.substring(0, Math.min(slug.length(), 40));
    }
}
