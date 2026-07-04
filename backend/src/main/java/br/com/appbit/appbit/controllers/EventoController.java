package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.dtos.geraisDTOs.EventosDTO;
import br.com.appbit.appbit.services.EventoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(("/eventos"))
public class EventoController {

    private final EventoService eventoService;

    @PostMapping
    public ResponseEntity<EventosDTO> createEvento(@Valid @RequestBody EventosDTO createDTO) {
        EventosDTO responseDTO = eventoService.createEvento(createDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<EventosDTO>> getAllEventos() {

        List<EventosDTO> eventosDtoList = eventoService.listAllEventos();

        return ResponseEntity.ok(eventosDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventosDTO> getEventoById(@PathVariable(name = "id") Integer id) {

        EventosDTO responseDTO = eventoService.getEventoById(id);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventosDTO> updateEventoById(@Valid @RequestBody EventosDTO updateDTO,
            @PathVariable(name = "id") Integer id) {

        EventosDTO responseDTO = eventoService.updateEventoById(updateDTO, id);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventoById(@PathVariable Integer id) {

        eventoService.deleteEventoById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nome/{nome}")
    public ResponseEntity<List<EventosDTO>> getEventoByNome(@PathVariable(name = "nome") String nome) {

        List<EventosDTO> eventoDtoList = eventoService.findByNome(nome);

        return ResponseEntity.ok(eventoDtoList);
    }

    @GetMapping("/carga-horaria/{horario}")
    public ResponseEntity<List<EventosDTO>> getEventoByCargaHoraria(@PathVariable(name = "horario") String horario) {

        List<EventosDTO> eventoDtoList = eventoService.findByCargaHoraria(horario);

        return ResponseEntity.ok(eventoDtoList);
    }

    @GetMapping("/tema/{tema}")
    public ResponseEntity<List<EventosDTO>> getEventoByTema(@PathVariable(name = "tema") String tema) {

        List<EventosDTO> eventoDtoList = eventoService.findByTema(tema);

        return ResponseEntity.ok(eventoDtoList);
    }

}
