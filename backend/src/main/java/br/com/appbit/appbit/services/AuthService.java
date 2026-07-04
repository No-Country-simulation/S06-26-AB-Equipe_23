package br.com.appbit.appbit.services;

import br.com.appbit.appbit.config.JwtUtil;
import br.com.appbit.appbit.dtos.requestDTOs.LoginRequestDTO;
import br.com.appbit.appbit.dtos.responseDTOs.LoginResponseDTO;
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
}
