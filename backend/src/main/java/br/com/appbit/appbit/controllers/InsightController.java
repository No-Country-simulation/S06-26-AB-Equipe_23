package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.InsightResponseDTO;
import br.com.appbit.appbit.services.InsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/insights")
@RequiredArgsConstructor
public class InsightController {

    private final InsightService service;

    @GetMapping("/regioes")
    public ResponseEntity<InsightResponseDTO> listarRegioes() {

        return ResponseEntity.ok(
                service.buscarInsights()
        );
    }
}