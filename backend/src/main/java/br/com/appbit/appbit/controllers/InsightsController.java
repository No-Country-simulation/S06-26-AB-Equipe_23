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
import br.com.appbit.appbit.services.ExportacaoService;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/insights")
public class InsightsController {

    private final InsightService insightService;
    private final TalentoInsightService talentoInsightService;
    private final EsgInsightService esgInsightService;
    private final ExportacaoService exportacaoService;

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

    @GetMapping("/exportar/pdf")
    public ResponseEntity<byte[]> exportarPdf() {
        byte[] pdf = exportacaoService.gerarPdfEsg();
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_esg.pdf")
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/exportar/excel")
    public ResponseEntity<byte[]> exportarExcel() {
        byte[] excel = exportacaoService.gerarExcelEsg();
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_esg.xlsx")
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}