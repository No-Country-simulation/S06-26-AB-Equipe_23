package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.createDTOs.MentorCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.MentorResponseDTO;
import br.com.appbit.appbit.dtos.updateDTOs.MentorUpdateDTO;
import br.com.appbit.appbit.services.MentorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/mentores"))
public class MentorController {

    private final MentorService mentorService;

    @PostMapping
    public ResponseEntity<MentorResponseDTO> createMentor(@Valid @RequestBody MentorCreateDTO createDTO) {
        MentorResponseDTO responseDTO = mentorService.createMentor(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<MentorResponseDTO>> getAllMentor() {

        List<MentorResponseDTO> mentorDtoList = mentorService.listAllMentor();

        return ResponseEntity.ok(mentorDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MentorResponseDTO> getMentorById(@PathVariable(name = "id") Integer id) {

        MentorResponseDTO responseDTO = mentorService.getMentorById(id);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MentorResponseDTO> updateMentorById(@Valid @RequestBody MentorUpdateDTO updateDTO,
            @PathVariable(name = "id") Integer id) {

        MentorResponseDTO responseDTO = mentorService.updateMentorById(updateDTO, id);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMentorById(@PathVariable Integer id) {

        mentorService.deleteMentorById(id);

        return ResponseEntity.noContent().build();
    }
}
