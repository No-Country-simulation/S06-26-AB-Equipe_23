package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dto.sresponse.InsightsRegioesResponseDTO;
import br.com.appbit.appbit.dtos.response.RegiaoInsightDTO;
import br.com.appbit.appbit.services.RegiaoMockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/insights")
public class InsightsController {

    private final RegiaoMockService regiaoMockService;

    public InsightsController(RegiaoMockService regiaoMockService) {
        this.regiaoMockService = regiaoMockService;
    }

    @GetMapping("/regioes")
    public ResponseEntity<InsightsRegioesResponseDTO> listarRegioes() {
        List<RegiaoInsightDTO> regioes = regiaoMockService.listarTodas();
        InsightsRegioesResponseDTO resposta = new InsightsRegioesResponseDTO(regioes.size(), regioes);
        return ResponseEntity.ok(resposta);
    }
}
