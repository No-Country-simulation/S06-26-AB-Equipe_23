package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.InsightResponseDTO;
import br.com.appbit.appbit.dtos.AlertaEsgDTO;
import br.com.appbit.appbit.dtos.MapaTalentosResponseDTO;
import br.com.appbit.appbit.services.InsightService;
import br.com.appbit.appbit.services.TalentoInsightService;
import br.com.appbit.appbit.services.EsgInsightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/insights")
public class InsightsController {

    private final InsightService insightService;
    private final TalentoInsightService talentoInsightService;
    private final EsgInsightService esgInsightService;

    @GetMapping
    public ResponseEntity<MapaTalentosResponseDTO> mapaTalentos() {
        return ResponseEntity.ok(talentoInsightService.obterMapaTalentos());
    }

    @GetMapping("/regioes")
    public ResponseEntity<InsightResponseDTO> listarRegioes() {
        return ResponseEntity.ok(insightService.obterInsights());
    }

    @GetMapping("/esg")
    public ResponseEntity<List<AlertaEsgDTO>> obterAlertasEsg() {
        return ResponseEntity.ok(esgInsightService.obterAlertasEsg());
    }
}