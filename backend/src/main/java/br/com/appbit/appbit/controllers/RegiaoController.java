package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.create.RegiaoCreateDTO;
import br.com.appbit.appbit.dtos.response.RegiaoInsightDTO;
import br.com.appbit.appbit.dtos.update.RegiaoUpdateDTO;
import br.com.appbit.appbit.services.RegiaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/api/v1/regioes"))
public class RegiaoController {


    private final RegiaoService regiaoService;

    @PostMapping
    public ResponseEntity<RegiaoInsightDTO> createRegiao(@Valid @RequestBody RegiaoCreateDTO createDTO) {
        RegiaoInsightDTO responseDTO = regiaoService.createRegiao(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }


    @GetMapping
    public ResponseEntity<List<RegiaoInsightDTO>> getAllRegiao() {

        List<RegiaoInsightDTO> regiaoDtoList = regiaoService.listAllRegiao();

        return ResponseEntity.ok(regiaoDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegiaoInsightDTO> getRegiaoById(@PathVariable(name = "id") Integer id) {

        RegiaoInsightDTO responseDTO = regiaoService.getRegiaoById(id);

        return ResponseEntity.ok(responseDTO);
    }


    @PutMapping("/{id}")
    public ResponseEntity<RegiaoInsightDTO> updateRegiaoById(@Valid @RequestBody RegiaoUpdateDTO updateDTO, @PathVariable(name = "id") Integer id) {

        RegiaoInsightDTO responseDTO = regiaoService.updateRegiaoById(updateDTO, id);

        return  ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegiaoById(@PathVariable Integer id){

        regiaoService.deleteRegiaoById(id);

        return ResponseEntity.noContent().build();
    }
}
