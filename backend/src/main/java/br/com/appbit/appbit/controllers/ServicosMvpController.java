package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.EventoEstruturanteResponseDTO;
import br.com.appbit.appbit.dtos.MentorDiversidadeResponseDTO;
import br.com.appbit.appbit.dtos.TrilhaFormacaoResponseDTO;
import br.com.appbit.appbit.services.ServicosMvpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ServicosMvpController {

    private final ServicosMvpService servicosMvpService;

    @GetMapping("/formacoes")
    public ResponseEntity<List<TrilhaFormacaoResponseDTO>> listarFormacoes() {
        return ResponseEntity.ok(servicosMvpService.listarFormacoes());
    }

    @GetMapping("/experiencias")
    public ResponseEntity<List<EventoEstruturanteResponseDTO>> listarExperiencias() {
        return ResponseEntity.ok(servicosMvpService.listarExperiencias());
    }

    @GetMapping("/mentorias")
    public ResponseEntity<List<MentorDiversidadeResponseDTO>> listarMentorias() {
        return ResponseEntity.ok(servicosMvpService.listarMentorias());
    }
}
