package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.AprovacaoRequestDTO;
import br.com.appbit.appbit.dtos.ContatoAprovadoDTO;
import br.com.appbit.appbit.dtos.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.MatchingResponseDTO;
import br.com.appbit.appbit.services.AprovacaoService;
import br.com.appbit.appbit.services.MatchingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/match")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;
    private final AprovacaoService aprovacaoService;

    /**
     * POST /match
     * Exemplo de body:
     * {
     *   "empresa_id": "emp_001",
     *   "vaga": {
     *     "titulo": "Analista de Dados",
     *     "skills": ["sql", "python"],
     *     "nivel": "junior",
     *     "regiao": "Florianopolis"
     *   },
     *   "filtros": {
     *     "limite_resultados": 5
     *   }
     * }
     */
    @PostMapping
    public ResponseEntity<MatchingResponseDTO> executarMatch(
            @Valid @RequestBody MatchingRequestDTO request
    ) {
        MatchingResponseDTO response = matchingService.executarMatch(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /match/aprovar-candidato
     * Exemplo de body:
     * {
     *   "candidato_id": "cand_001",
     *   "empresa_id": "emp_001"
     * }
     */
    @PostMapping("/aprovar-candidato")
    public ResponseEntity<ContatoAprovadoDTO> aprovarCandidato(
            @Valid @RequestBody AprovacaoRequestDTO request
    ) {
        ContatoAprovadoDTO contato = aprovacaoService.aprovarCandidato(request);
        return ResponseEntity.ok(contato);
    }

    /**
     * POST /match/reprovar-candidato
     * Exemplo de body:
     * {
     *   "candidato_id": "cand_001",
     *   "empresa_id": "emp_001",
     *   "vaga_id": 1,
     *   "motivo": "FIT_TECNICO",
     *   "anotacoes": "Falta conhecimento em SQL avançado"
     * }
     */
    @PostMapping("/reprovar-candidato")
    public ResponseEntity<br.com.appbit.appbit.dtos.ReprovacaoResponseDTO> reprovarCandidato(
            @Valid @RequestBody br.com.appbit.appbit.dtos.ReprovacaoRequestDTO request
    ) {
        br.com.appbit.appbit.dtos.ReprovacaoResponseDTO response = aprovacaoService.reprovarCandidato(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /match/feedbacks?empresa_id=emp_001&vaga_id=1
     */
    @org.springframework.web.bind.annotation.GetMapping("/feedbacks")
    public ResponseEntity<java.util.List<br.com.appbit.appbit.dtos.FeedbackResumoDTO>> listarFeedbacks(
            @org.springframework.web.bind.annotation.RequestParam(name = "empresa_id", defaultValue = "emp_001") String empresaId,
            @org.springframework.web.bind.annotation.RequestParam(name = "vaga_id", required = false) Integer vagaId
    ) {
        return ResponseEntity.ok(aprovacaoService.listarFeedbacksPorVaga(empresaId, vagaId));
    }
}

