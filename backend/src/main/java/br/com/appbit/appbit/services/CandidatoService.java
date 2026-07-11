package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.RegiaoEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import br.com.appbit.appbit.repositories.RegiaoRepository;
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
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;
    private final RegiaoRepository regiaoRepository;
    private final CandidatoMapper candidatoMapper;

    public CandidatoResponseDTO createCandidato(CandidatoCreateDTO createDTO) {
        log.info("Criando novo candidato: {}", createDTO.nome());

        RegiaoEntity regiao = regiaoRepository.findById(createDTO.regiaoId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Região não encontrada com ID: " + createDTO.regiaoId()));

        CandidatoEntity candidato = candidatoMapper.toEntity(createDTO);
        candidato.setRegiao(regiao);

        CandidatoEntity candidatoSave = candidatoRepository.save(candidato);
        log.info("Candidato criado com sucesso. ID: {}", candidatoSave.getId());

        return candidatoMapper.toResponseDTO(candidatoSave);
    }

    @Transactional(readOnly = true)
    public List<CandidatoResponseDTO> listAllCandidato() {
        log.info("Listando todos os candidatos");
        return candidatoRepository.findAll()
                .stream()
                .map(candidatoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<CandidatoResponseDTO> listAllCandidato(org.springframework.data.domain.Pageable pageable) {
        log.info("Listando candidatos com paginacao nativa: {}", pageable);
        return candidatoRepository.findAll(pageable)
                .map(candidatoMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public CandidatoResponseDTO getCandidatoById(Integer candidatoId) {
        log.info("Buscando candidato por ID: {}", candidatoId);
        CandidatoEntity candidato = candidatoRepository.findById(candidatoId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidato não encontrado com ID: " + candidatoId));

        return candidatoMapper.toResponseDTO(candidato);
    }

    public CandidatoResponseDTO updateCandidatoById(CandidatoUpdateDTO updateDTO, Integer candidatoId) {
        log.info("Atualizando candidato com ID: {}", candidatoId);

        CandidatoEntity candidato = candidatoRepository.findById(candidatoId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidato não encontrado com ID: " + candidatoId));

        RegiaoEntity regiao = regiaoRepository.findById(updateDTO.regiaoId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Região não encontrada com ID: " + updateDTO.regiaoId()));

        candidato.setNome(updateDTO.nome());
        candidato.setCargo(updateDTO.cargo());
        candidato.setNivel(updateDTO.nivel());
        candidato.setCluster(updateDTO.cluster());
        candidato.setMunicipio(updateDTO.municipio());
        candidato.setGrupo(updateDTO.grupo());
        candidato.setDiversidade(updateDTO.diversidade());
        candidato.setModeloTrabalhoPreferido(updateDTO.disponibilidade());
        candidato.setAtivo(updateDTO.ativo());
        candidato.setRegiao(regiao);

        CandidatoEntity candidatoAtualizada = candidatoRepository.save(candidato);
        log.info("Candidato atualizado com sucesso. ID: {}", candidatoId);

        return candidatoMapper.toResponseDTO(candidatoAtualizada);
    }

    public void deleteCandidatoById(Integer candidatoId) {
        log.info("Deletando candidato com ID: {}", candidatoId);

        CandidatoEntity candidato = candidatoRepository.findById(candidatoId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidato não encontrado com ID: " + candidatoId));

        candidatoRepository.delete(candidato);
        log.info("Candidato deletado com sucesso. ID: {}", candidatoId);
    }

    @Transactional(readOnly = true)
    public List<CandidatoResponseDTO> findByAtivo(Boolean ativo) {
        log.info("Buscando candidatos ativos: {}", ativo);
        return candidatoRepository.findByAtivo(ativo)
                .stream()
                .map(candidatoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidatoResponseDTO> findByNivel(String nivel) {
        log.info("Buscando candidatos por nível: {}", nivel);
        return candidatoRepository.findByNivel(nivel)
                .stream()
                .map(candidatoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}