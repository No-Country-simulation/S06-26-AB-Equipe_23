package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.services.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/matches"))
public class MatchController {


    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<MatchResponseDTO> createMatch(@Valid @RequestBody MatchCreateDTO createDTO) {
        MatchResponseDTO responseDTO = matchService.createMatch(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }


    @GetMapping
    public ResponseEntity<List<MatchResponseDTO>> getAllMatch() {

        List<MatchResponseDTO> matchDtoList = matchService.listAllMatch();

        return ResponseEntity.ok(matchDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResponseDTO> getMatchById(@PathVariable(name = "id") Long id) {

        MatchResponseDTO responseDTO = matchService.getMatchById(id);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MatchResponseDTO> updateMatchById(@Valid @RequestBody MatchUpdateDTO updateDTO, @PathVariable(name = "id") Long id) {

        MatchResponseDTO responseDTO = matchService.updateMatchById(updateDTO, id);

        return  ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatchById(@PathVariable Long id){

        matchService.deleteMatchById(id);

        return ResponseEntity.noContent().build();
    }
}
