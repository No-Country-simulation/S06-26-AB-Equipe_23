package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.EventoEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.EventoMapper;
import br.com.appbit.appbit.repositories.EventoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class EventoService {

    private final EventoRepository eventoRepository;
    private final EventoMapper eventoMapper;

    public EventosDTO createEvento(EventosDTO createDTO) {
        log.info("Criando novo evento: {}", createDTO.nome());

        EventoEntity evento = eventoMapper.toEntity(createDTO);
        EventoEntity eventoSave = eventoRepository.save(evento);
        log.info("Evento criado com sucesso. ID: {}", eventoSave.getId());

        return eventoMapper.toDTO(eventoSave);
    }

    @Transactional(readOnly = true)
    public List<EventosDTO> listAllEventos() {
        log.info("Listando todos os eventos");
        return eventoRepository.findAll()
                .stream()
                .map(eventoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventosDTO getEventoById(Integer eventoId) {
        log.info("Buscando evento por ID: {}", eventoId);
        EventoEntity evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com ID: " + eventoId));

        return eventoMapper.toDTO(evento);
    }

    public EventosDTO updateEventoById(EventosDTO updateDTO, Integer eventoId) {
        log.info("Atualizando evento com ID: {}", eventoId);

        EventoEntity evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com ID: " + eventoId));

        eventoMapper.updateEntityFromDto(updateDTO, evento);

        evento = eventoRepository.save(evento);
        log.info("Evento atualizado com sucesso. ID: {}", eventoId);
        return eventoMapper.toDTO(evento);
    }

    public void deleteEventoById(Integer eventoId) {
        log.info("Deletando evento com ID: {}", eventoId);

        EventoEntity evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com ID: " + eventoId));

        eventoRepository.delete(evento);
        log.info("Evento deletado com sucesso. ID: {}", eventoId);
    }

    @Transactional(readOnly = true)
    public List<EventosDTO> findByNome(String nome) {
        log.info("Buscando eventos por nome: {}", nome);
        return eventoRepository.findByNome(nome)
                .stream()
                .map(eventoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventosDTO> findByCargaHoraria(String horario) {
        log.info("Buscando eventos por carga horária: {}", horario);
        return eventoRepository.findByCargaHoraria(horario)
                .stream()
                .map(eventoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventosDTO> findByTema(String tema) {
        log.info("Buscando eventos por tema: {}", tema);
        return eventoRepository.findByTemaPalestra(tema)
                .stream()
                .map(eventoMapper::toDTO)
                .collect(Collectors.toList());
    }
}