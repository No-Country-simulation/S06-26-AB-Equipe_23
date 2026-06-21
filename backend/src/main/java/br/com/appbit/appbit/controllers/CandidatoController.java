package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.create.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.response.CandidatoCompletoDTO;
import br.com.appbit.appbit.dtos.update.CandidatoUpdateDTO;
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
    public ResponseEntity<CandidatoCompletoDTO> createCandidato(@Valid @RequestBody CandidatoCreateDTO createDTO) {
        CandidatoCompletoDTO responseDTO = candidatoService.createCandidato(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }


    @GetMapping
    public ResponseEntity<List<CandidatoCompletoDTO>> getAllCandidato() {

        List<CandidatoCompletoDTO> candidatoDtoList = candidatoService.listAllCandidato();

        return ResponseEntity.ok(candidatoDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidatoCompletoDTO> getRegiaoById(@PathVariable(name = "id") Integer id) {

        CandidatoCompletoDTO responseDTO = candidatoService.getCandidatoById(id);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidatoCompletoDTO> updateRegiaoById(@Valid @RequestBody CandidatoUpdateDTO updateDTO, @PathVariable(name = "id") Integer id) {

        CandidatoCompletoDTO responseDTO = candidatoService.updateCandidatoById(updateDTO, id);

        return  ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegiaoById(@PathVariable Integer id){

        candidatoService.deleteCandidatoById(id);

        return ResponseEntity.noContent().build();
    }
}
