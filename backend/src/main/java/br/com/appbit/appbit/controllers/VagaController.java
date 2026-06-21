package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.dtos.create.VagaCreateDTO;
import br.com.appbit.appbit.dtos.response.VagaResponseDTO;
import br.com.appbit.appbit.dtos.update.VagaUpdateDTO;
import br.com.appbit.appbit.services.VagaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/api/v1/vagas"))
public class VagaController {


    private final VagaService vagaService;

    @PostMapping
    public ResponseEntity<VagaResponseDTO> createVaga(@Valid @RequestBody VagaCreateDTO createDTO) {
        VagaResponseDTO responseDTO = vagaService.createVaga(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }


    @GetMapping
    public ResponseEntity<List<VagaResponseDTO>> getAllVaga() {

        List<VagaResponseDTO> vagaDtoList = vagaService.listAllVaga();

        return ResponseEntity.ok(vagaDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VagaResponseDTO> getVagaById(@PathVariable(name = "id") Integer id) {

        VagaResponseDTO responseDTO = vagaService.getVagaById(id);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VagaResponseDTO> updateVagaById(@Valid @RequestBody VagaUpdateDTO updateDTO, @PathVariable(name = "id") Integer id) {

        VagaResponseDTO responseDTO = vagaService.updateVagaById(updateDTO, id);

        return  ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeleteById(@PathVariable Integer id){

        vagaService.deleteVagaById(id);

        return ResponseEntity.noContent().build();
    }
}
