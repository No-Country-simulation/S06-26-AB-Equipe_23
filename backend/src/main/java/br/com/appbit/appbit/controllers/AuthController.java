package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.LoginRequestDTO;
import br.com.appbit.appbit.dtos.LoginResponseDTO;
import br.com.appbit.appbit.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /login
     *
     * Autentica o recrutador e devolve um JWT Bearer.
     *
     * Body:
     * {
     *   "email": "recrutador@appbit.com.br",
     *   "senha": "recrutador123"
     * }
     *
     * Response 200:
     * {
     *   "token": "eyJ...",
     *   "token_type": "Bearer",
     *   "expires_in": 86400,
     *   "nome": "Recrutador Demo",
     *   "email": "recrutador@appbit.com.br",
     *   "empresa_id": "emp_001"
     * }
     */
    @PostMapping
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    
}
