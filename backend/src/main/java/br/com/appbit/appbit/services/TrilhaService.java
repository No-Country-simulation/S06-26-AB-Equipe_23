package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.TrilhaEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.TrilhaMapper;
import br.com.appbit.appbit.repositories.TrilhaRepository;
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
public class TrilhaService {

    private final TrilhaRepository trilhaRepository;
    private final TrilhaMapper trilhaMapper;

    public TrilhasDTO createTrilha(TrilhasDTO createDTO) {
        log.info("Criando nova trilha: {}", createDTO.nome());

        TrilhaEntity trilha = trilhaMapper.toEntity(createDTO);
        TrilhaEntity trilhaSave = trilhaRepository.save(trilha);
        log.info("Trilha criada com sucesso. ID: {}", trilhaSave.getId());

        return trilhaMapper.toDTO(trilhaSave);
    }

    @Transactional(readOnly = true)
    public List<TrilhasDTO> listAllTrilha() {
        log.info("Listando todas as trilhas");
        return trilhaRepository.findAll()
                .stream()
                .map(trilhaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TrilhasDTO getTrilhaById(Integer trilhaId) {
        log.info("Buscando trilha por ID: {}", trilhaId);
        TrilhaEntity trilha = trilhaRepository.findById(trilhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada com ID: " + trilhaId));

        return trilhaMapper.toDTO(trilha);
    }

    public TrilhasDTO updateTrilhaById(TrilhasDTO updateDTO, Integer trilhaId) {
        log.info("Atualizando trilha com ID: {}", trilhaId);

        TrilhaEntity trilha = trilhaRepository.findById(trilhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada com ID: " + trilhaId));

        trilha.setNome(updateDTO.nome());
        trilha.setDescricao(updateDTO.descricao());
        trilha.setCarga_horaria(updateDTO.carga_horaria());
        trilha.setLink(updateDTO.link());

        trilha = trilhaRepository.save(trilha);
        log.info("Trilha atualizada com sucesso. ID: {}", trilhaId);

        return trilhaMapper.toDTO(trilha);
    }

    public void deleteTrilhaById(Integer trilhaId) {
        log.info("Deletando trilha com ID: {}", trilhaId);

        TrilhaEntity trilha = trilhaRepository.findById(trilhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Trilha não encontrada com ID: " + trilhaId));

        trilhaRepository.delete(trilha);
        log.info("Trilha deletada com sucesso. ID: {}", trilhaId);
    }

    @Transactional(readOnly = true)
    public List<TrilhasDTO> findByNome(String nome) {
        log.info("Buscando trilhas por nome: {}", nome);
        return trilhaRepository.findByNome(nome)
                .stream()
                .map(trilhaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TrilhasDTO> findByLink(String link) {
        log.info("Buscando trilhas por link: {}", link);
        return trilhaRepository.findByLink(link)
                .stream()
                .map(trilhaMapper::toDTO)
                .collect(Collectors.toList());
    }
}