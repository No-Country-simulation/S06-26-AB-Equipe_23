package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.createDTOs.CandidatoSkillCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.CandidatoSkillResponseDTO;
import br.com.appbit.appbit.dtos.updateDTOs.CandidatoSkillUpdateDTO;
import br.com.appbit.appbit.entities.CandidatoSkillId;
import br.com.appbit.appbit.services.CandidatoSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/candidato-skills"))
public class CandidatoSkillController {

    private final CandidatoSkillService service;

    @PostMapping
    public ResponseEntity<CandidatoSkillResponseDTO> createCandidatoSkill(@Valid @RequestBody CandidatoSkillCreateDTO createDTO) {
        CandidatoSkillResponseDTO responseDTO = service.createCandidatoSkill(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }


    @GetMapping
    public ResponseEntity<List<CandidatoSkillResponseDTO>> getAllCandidatoSkill() {

        List<CandidatoSkillResponseDTO> candidatoSkillDtoList = service.listAllCandidatoSkill();

        return ResponseEntity.ok(candidatoSkillDtoList);
    }

    @GetMapping("/{candidatoId}/{skillId}")
    public ResponseEntity<CandidatoSkillResponseDTO> getCandidatoSkillById(
            @PathVariable Integer candidatoId,
            @PathVariable Integer skillId) {

        CandidatoSkillId id = new CandidatoSkillId(
                candidatoId,
                skillId
        );


        CandidatoSkillResponseDTO responseDTO = service.getCandidatoSkillById(id);

        return ResponseEntity.ok(responseDTO);
    }


    @PutMapping("/{candidatoId}/{skillId}")
    public ResponseEntity<CandidatoSkillResponseDTO> updateCandidatoSkillById(
            @Valid @RequestBody CandidatoSkillUpdateDTO updateDTO,
            @PathVariable Integer candidatoId,
            @PathVariable Integer skillId) {

             CandidatoSkillId id = new CandidatoSkillId(
                candidatoId,
                skillId
        );

        CandidatoSkillResponseDTO responseDTO = service.updateCandidatoSkillById(updateDTO, id);

        return  ResponseEntity.ok(responseDTO);
    }


    @DeleteMapping("/{candidatoId}/{skillId}")
    public ResponseEntity<Void> deleteCandidatoById(
            @PathVariable Integer candidatoId,
            @PathVariable Integer skillId) {

        CandidatoSkillId id = new CandidatoSkillId(
                candidatoId,
                skillId
        );

        service.deleteCandidatoSkillById(id);

        return ResponseEntity.noContent().build();
    }
}
