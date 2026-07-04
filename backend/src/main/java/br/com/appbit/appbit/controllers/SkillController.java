package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.createDTOs.SkillCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.SkillResponseDTO;
import br.com.appbit.appbit.dtos.updateDTOs.SkillUpdateDTO;
import br.com.appbit.appbit.services.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/skills"))
public class SkillController {


    private final SkillService skillService;

    @PostMapping
    public ResponseEntity<SkillResponseDTO> createSkill(@Valid @RequestBody SkillCreateDTO createDTO) {
        SkillResponseDTO responseDTO = skillService.createSkill(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<SkillResponseDTO>> getAllSkill() {

        List<SkillResponseDTO> skillDtoList = skillService.listAllSkill();

        return ResponseEntity.ok(skillDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillResponseDTO> getSkillById(@PathVariable(name = "id") Integer id) {

        SkillResponseDTO responseDTO = skillService.getSkillById(id);

        return ResponseEntity.ok(responseDTO);
    }


    @PutMapping("/{id}")
    public ResponseEntity<SkillResponseDTO> updateSkillById(@Valid @RequestBody SkillUpdateDTO updateDTO, @PathVariable(name = "id") Integer id) {

        SkillResponseDTO responseDTO = skillService.updateSkillById(updateDTO, id);

        return  ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkillById(@PathVariable Integer id){

        skillService.deleteSkillById(id);

        return ResponseEntity.noContent().build();
    }
}
