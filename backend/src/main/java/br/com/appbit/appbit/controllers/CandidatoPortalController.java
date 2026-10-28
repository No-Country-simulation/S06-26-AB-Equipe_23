package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.CandidatoPerfilDTO;
import br.com.appbit.appbit.dtos.CandidatoPerfilUpdateDTO;
import br.com.appbit.appbit.services.CandidatoAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/candidato/me")
public class CandidatoPortalController {

    private final CandidatoAccountService candidatoAccountService;

    @GetMapping
    public ResponseEntity<CandidatoPerfilDTO> buscarMeuPerfil(Authentication authentication) {
        return ResponseEntity.ok(candidatoAccountService.buscarMeuPerfil(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<CandidatoPerfilDTO> atualizarMeuPerfil(
            Authentication authentication,
            @Valid @RequestBody CandidatoPerfilUpdateDTO updateDTO) {
        return ResponseEntity.ok(
                candidatoAccountService.atualizarMeuPerfil(authentication.getName(), updateDTO));
    }
}
