package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.CandidatoResponseDTO;
import br.com.appbit.appbit.dtos.CandidatoUpdateDTO;
import br.com.appbit.appbit.services.CandidatoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/candidatos"))
public class CandidatoController {

    private final CandidatoService candidatoService;

    @PostMapping
    public ResponseEntity<CandidatoResponseDTO> createCandidato(@Valid @RequestBody CandidatoCreateDTO createDTO) {
        CandidatoResponseDTO responseDTO = candidatoService.createCandidato(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<?> getAllCandidato(
            @org.springframework.data.web.PageableDefault(size = 20, sort = "id") org.springframework.data.domain.Pageable pageable,
            jakarta.servlet.http.HttpServletRequest request) {

        if (request.getParameter("page") != null || request.getParameter("size") != null) {
            return ResponseEntity.ok(candidatoService.listAllCandidato(pageable));
        }

        List<CandidatoResponseDTO> candidatoDtoList = candidatoService.listAllCandidato();

        return ResponseEntity.ok(candidatoDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidatoResponseDTO> getCandidatoById(@PathVariable(name = "id") Integer id) {

        CandidatoResponseDTO responseDTO = candidatoService.getCandidatoById(id);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidatoResponseDTO> updateCandidatoById(@Valid @RequestBody CandidatoUpdateDTO updateDTO,
            @PathVariable(name = "id") Integer id) {

        CandidatoResponseDTO responseDTO = candidatoService.updateCandidatoById(updateDTO, id);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidatoById(@PathVariable Integer id) {

        candidatoService.deleteCandidatoById(id);

        return ResponseEntity.noContent().build();
    }
}
