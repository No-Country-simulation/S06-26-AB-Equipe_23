package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.VagaSkillCreateDTO;
import br.com.appbit.appbit.dtos.VagaSkillResponseDTO;
import br.com.appbit.appbit.dtos.VagaSkillUpdateDTO;
import br.com.appbit.appbit.entities.VagaSkillId;
import br.com.appbit.appbit.services.VagaSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/vaga-skills"))
public class VagaSkillController {

    private final VagaSkillService service;

    @PostMapping
    public ResponseEntity<VagaSkillResponseDTO> createVagaSkill(@Valid @RequestBody VagaSkillCreateDTO createDTO) {
        VagaSkillResponseDTO responseDTO = service.createVagaSkill(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }


    @GetMapping
    public ResponseEntity<List<VagaSkillResponseDTO>> getAllVagaSkill() {

        List<VagaSkillResponseDTO> vagaSkillDtoList = service.listAllVagaSkill();

        return ResponseEntity.ok(vagaSkillDtoList);
    }

    @GetMapping("/{vagaId}/{skillId}")
    public ResponseEntity<VagaSkillResponseDTO> getVagaSkillById(
            @PathVariable Integer vagaId,
            @PathVariable Integer skillId) {

        VagaSkillId id = new VagaSkillId(
                vagaId,
                skillId
        );


        VagaSkillResponseDTO responseDTO = service.getVagaSkillById(id);

        return ResponseEntity.ok(responseDTO);
    }


    @PutMapping("/{vagaId}/{skillId}")
    public ResponseEntity<VagaSkillResponseDTO> updateVagaSkillById(
            @Valid @RequestBody VagaSkillUpdateDTO updateDTO,
            @PathVariable Integer vagaId,
            @PathVariable Integer skillId) {

            VagaSkillId id = new VagaSkillId(
                     vagaId,
                    skillId
        );

        VagaSkillResponseDTO responseDTO = service.updateVagaSkillById(updateDTO, id);

        return  ResponseEntity.ok(responseDTO);
    }


    @DeleteMapping("/{vagaId}/{skillId}")
    public ResponseEntity<Void> deleteVagaSkillById(
            @PathVariable Integer vagaId,
            @PathVariable Integer skillId) {

        VagaSkillId id = new VagaSkillId(
                vagaId,
                skillId
        );

        service.deleteVagaSkillById(id);

        return ResponseEntity.noContent().build();
    }
}
