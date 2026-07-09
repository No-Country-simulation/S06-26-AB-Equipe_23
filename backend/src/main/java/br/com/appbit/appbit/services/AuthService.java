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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;
    private final JwtUtil           jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {

        // 1. Busca o usuário ativo pelo e-mail
        UsuarioEntity usuario = usuarioRepository
                .findByEmailAndAtivoTrue(request.email())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Credenciais inválidas"
                ));

        // 2. Valida a senha com PBKDF2
        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        // 3. Gera o token JWT
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
        usuarioRepository.findByEmailAndAtivoTrue(request.email()).ifPresent(usuario -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        });

        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setEmail(request.email());
        usuario.setSenhaHash(passwordEncoder.encode(request.password()));
        usuario.setNome(request.nomePessoa());
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

    private String gerarEmpresaId(String nomeEmpresa) {
        String base = nomeEmpresa == null ? "empresa" : nomeEmpresa;
        String slug = base.toLowerCase()
                .replaceAll("[^a-z0-9]+", "_")
                .replaceAll("^_+|_+$", "");
        if (slug.isBlank()) {
            slug = "empresa";
        }
        return "emp_" + slug.substring(0, Math.min(slug.length(), 40));
    }
}
