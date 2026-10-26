package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.RegiaoEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import br.com.appbit.appbit.repositories.CandidatoSkillRepository;
import br.com.appbit.appbit.repositories.RegiaoRepository;
import br.com.appbit.appbit.repositories.SkillRepository;

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
    private final CandidatoSkillRepository candidatoSkillRepository;
    private final SkillRepository skillRepository;
    private final CandidatoMapper candidatoMapper;

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
    public CandidatoResponseDTO createCandidato(CandidatoCreateDTO createDTO) {
        log.info("Criando novo candidato: {}", createDTO.nome());

        Integer regiaoId = createDTO.regiaoId() != null ? createDTO.regiaoId() : 1;
        RegiaoEntity regiao = regiaoRepository.findById(regiaoId)
                .orElseGet(() -> regiaoRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Nenhuma região disponível para cadastro.")));

        CandidatoEntity candidato = candidatoMapper.toEntity(createDTO);
        candidato.setRegiao(regiao);
        candidato.setAtivo(createDTO.ativo() != null ? createDTO.ativo() : true);
        if (createDTO.anosExperiencia() != null) {
            candidato.setAnosExperiencia(createDTO.anosExperiencia());
        }

        CandidatoEntity candidatoSave = candidatoRepository.save(candidato);
        log.info("Candidato criado com sucesso. ID: {}", candidatoSave.getId());

        salvarSkillsCandidato(candidatoSave, createDTO.skills());

        return candidatoMapper.toResponseDTO(candidatoSave);
    }

    private void salvarSkillsCandidato(CandidatoEntity candidato, List<String> skills) {
        if (skills == null || skills.isEmpty()) return;
        for (String skillName : skills) {
            if (skillName == null || skillName.isBlank()) continue;
            String cleanName = skillName.trim();
            br.com.appbit.appbit.entities.SkillEntity skill = skillRepository.findByNome(cleanName)
                    .orElseGet(() -> {
                        br.com.appbit.appbit.entities.SkillEntity s = new br.com.appbit.appbit.entities.SkillEntity();
                        s.setNome(cleanName);
                        s.setCategoria("geral");
                        return skillRepository.save(s);
                    });

            br.com.appbit.appbit.entities.CandidatoSkillId id =
                    new br.com.appbit.appbit.entities.CandidatoSkillId(candidato.getId(), skill.getId());

            if (!candidatoSkillRepository.existsById(id)) {
                br.com.appbit.appbit.entities.CandidatoSkillEntity cs =
                        new br.com.appbit.appbit.entities.CandidatoSkillEntity();
                cs.setId(id);
                cs.setCandidato(candidato);
                cs.setSkill(skill);
                cs.setNivelSkill("Intermediário");
                candidatoSkillRepository.save(cs);
            }
        }
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

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
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

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
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