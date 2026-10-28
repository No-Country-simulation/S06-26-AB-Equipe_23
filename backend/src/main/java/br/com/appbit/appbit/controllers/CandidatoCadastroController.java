package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.CandidatoAccountRegistrationRequestDTO;
import br.com.appbit.appbit.dtos.LoginResponseDTO;
import br.com.appbit.appbit.services.CandidatoAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CandidatoCadastroController {

    private final CandidatoAccountService candidatoAccountService;

    @PostMapping("/cadastro-candidato")
    public ResponseEntity<LoginResponseDTO> cadastrar(
            @Valid @RequestBody CandidatoAccountRegistrationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(candidatoAccountService.registrar(request));
    }
}
