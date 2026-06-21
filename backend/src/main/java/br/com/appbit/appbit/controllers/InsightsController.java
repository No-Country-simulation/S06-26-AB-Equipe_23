package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.InsightResponseDTO;
import br.com.appbit.appbit.services.InsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.appbit.appbit.services.RegiaoMockService;
import br.com.appbit.appbit.dtos.RegiaoInsightDTO;
import java.util.List;

@RestController
@RequestMapping("/insights")
public class InsightsController {

    private final RegiaoMockService regiaoMockService;

    public InsightsController(RegiaoMockService regiaoMockService) {
        this.regiaoMockService = regiaoMockService;
    }

    @GetMapping("/regioes")
    public ResponseEntity<InsightResponseDTO> listarRegioes() {
        List<RegiaoInsightDTO> regioes = regiaoMockService.listarTodas();
        InsightResponseDTO resposta = new InsightResponseDTO("Regiões", regioes);
        return ResponseEntity.ok(resposta);
    }
}
