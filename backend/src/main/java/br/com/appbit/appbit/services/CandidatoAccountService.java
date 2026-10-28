package br.com.appbit.appbit.services;

import br.com.appbit.appbit.config.JwtUtil;
import br.com.appbit.appbit.dtos.CandidatoAccountRegistrationRequestDTO;
import br.com.appbit.appbit.dtos.CandidatoPerfilDTO;
import br.com.appbit.appbit.dtos.CandidatoPerfilUpdateDTO;
import br.com.appbit.appbit.dtos.CandidatoResponseDTO;
import br.com.appbit.appbit.dtos.LoginResponseDTO;
import br.com.appbit.appbit.entities.UsuarioEntity;
import br.com.appbit.appbit.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidatoAccountService {

    private final UsuarioRepository usuarioRepository;
    private final CandidatoService candidatoService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO registrar(CandidatoAccountRegistrationRequestDTO request) {
        String email = normalizeEmail(request.perfil().email());
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um e-mail válido");
        }
        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "As senhas informadas não combinam");
        }
        if (usuarioRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        CandidatoResponseDTO perfil = candidatoService.createCandidato(request.perfil().withEmail(email));
        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(request.password()));
        usuario.setNome(request.perfil().nome().trim());
        usuario.setTipoUsuario("CANDIDATO");
        usuario.setCandidatoId(perfil.id());
        usuario.setAtivo(true);

        UsuarioEntity salvo = usuarioRepository.save(usuario);
        String token = jwtUtil.gerarToken(
                salvo.getEmail(), salvo.getNome(), null, salvo.getTipoUsuario(), salvo.getCandidatoId());

        return new LoginResponseDTO(
                token,
                jwtUtil.getExpirationMs() / 1000,
                salvo.getNome(),
                salvo.getEmail(),
                null,
                salvo.getTipoUsuario(),
                salvo.getCandidatoId()
        );
    }

    @Transactional(readOnly = true)
    public CandidatoPerfilDTO buscarMeuPerfil(String email) {
        UsuarioEntity usuario = carregarContaCandidato(email);
        return candidatoService.getPerfilCandidato(usuario.getCandidatoId(), usuario.getEmail());
    }

    public CandidatoPerfilDTO atualizarMeuPerfil(String email, CandidatoPerfilUpdateDTO updateDTO) {
        UsuarioEntity usuario = carregarContaCandidato(email);
        return candidatoService.atualizarPerfilCandidato(
                usuario.getCandidatoId(), usuario.getEmail(), updateDTO);
    }

    private UsuarioEntity carregarContaCandidato(String email) {
        UsuarioEntity usuario = usuarioRepository.findByEmailIgnoreCaseAndAtivoTrue(normalizeEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Conta não encontrada"));
        if (!"CANDIDATO".equals(usuario.getTipoUsuario()) || usuario.getCandidatoId() == null) {
            throw new AccessDeniedException("A conta não possui um perfil de candidato");
        }
        return usuario;
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }
}
