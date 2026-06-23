package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.InsightResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.appbit.appbit.services.RegiaoMockService;

@RestController
@RequestMapping("/insights")
public class InsightsController {

    private final RegiaoMockService regiaoMockService;

    public InsightsController(RegiaoMockService regiaoMockService) {
        this.regiaoMockService = regiaoMockService;
    }

    @GetMapping("/regioes")
    public ResponseEntity<InsightResponseDTO> listarRegioes() {
        return ResponseEntity.ok(regiaoMockService.obterInsights());
    }
}
