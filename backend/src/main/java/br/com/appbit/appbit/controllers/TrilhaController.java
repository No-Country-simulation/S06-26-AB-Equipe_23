package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.TrilhasDTO;
import br.com.appbit.appbit.services.TrilhaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/trilhas"))
public class TrilhaController {

    private final TrilhaService trilhaService;

    @PostMapping
    public ResponseEntity<TrilhasDTO> createTrilha(@Valid @RequestBody TrilhasDTO createDTO) {
        TrilhasDTO responseDTO = trilhaService.createTrilha(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<TrilhasDTO>> getAllTrilha() {

        List<TrilhasDTO> trilhaDtoList = trilhaService.listAllTrilha();

        return ResponseEntity.ok(trilhaDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrilhasDTO> getTrilhaById(@PathVariable(name = "id") Integer id) {

        TrilhasDTO responseDTO = trilhaService.getTrilhaById(id);

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/nome/{nome}")
    public ResponseEntity<List<TrilhasDTO>> getTrilhaByNome(@PathVariable(name = "nome") String nome) {

        List<TrilhasDTO> trilhaDtoList = trilhaService.findByNome(nome);

        return ResponseEntity.ok(trilhaDtoList);
    }

    @GetMapping("/link/{link}")
    public ResponseEntity<List<TrilhasDTO>> getTrilhaByLink(@PathVariable(name = "link") String link) {

        List<TrilhasDTO> trilhaDtoList = trilhaService.findByLink(link);

        return ResponseEntity.ok(trilhaDtoList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrilhasDTO> updateTrilhaById(@Valid @RequestBody TrilhasDTO updateDTO,
            @PathVariable(name = "id") Integer id) {

        TrilhasDTO responseDTO = trilhaService.updateTrilhaById(updateDTO, id);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrilhaById(@PathVariable Integer id) {

        trilhaService.deleteTrilhaById(id);

        return ResponseEntity.noContent().build();
    }
}
