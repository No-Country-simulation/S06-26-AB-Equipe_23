package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.request.CriteriosTriagemRequestDTO;
import br.com.appbit.appbit.dtos.response.CandidatoCompletoDTO;
import br.com.appbit.appbit.dtos.response.CandidatoResumidoDTO;
import br.com.appbit.appbit.exception.CandidatoNaoEncontradoException;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.services.CandidatoMockService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/match")
public class MatchController {

    private final CandidatoMockService candidatoMockService;

    public MatchController(CandidatoMockService candidatoMockService) {
        this.candidatoMockService = candidatoMockService;
    }

    @PostMapping
    public ResponseEntity<List<CandidatoResumidoDTO>> triarCandidatos(
            @Valid @RequestBody CriteriosTriagemRequestDTO criterios) {
        // Fase mock: os critérios já são validados pelo contrato estrito (@Valid),
        // mas a filtragem efetiva sobre a lista será aplicada quando o script
        // Python de matching/triagem for integrado a este endpoint.
        List<CandidatoResumidoDTO> candidatosResumidos = candidatoMockService.listarTodosCompletos()
                .stream()
                .map(CandidatoMapper::paraResumido)
                .toList();

        return ResponseEntity.ok(candidatosResumidos);
    }

    @PostMapping("/{id}/aprovar")
    public ResponseEntity<CandidatoCompletoDTO> aprovarCandidato(@PathVariable("id") String candidatoId) {
        CandidatoCompletoDTO candidato = candidatoMockService.buscarPorId(candidatoId)
                .orElseThrow(() -> new CandidatoNaoEncontradoException(candidatoId));

        return ResponseEntity.ok(candidato);
    }
}
