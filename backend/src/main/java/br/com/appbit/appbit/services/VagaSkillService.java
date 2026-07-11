package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.*;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.VagaSkillMapper;
import br.com.appbit.appbit.repositories.SkillRepository;
import br.com.appbit.appbit.repositories.VagaRepository;
import br.com.appbit.appbit.repositories.VagaSkillRepository;
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
public class VagaSkillService {

    private final VagaSkillRepository repository;
    private final VagaRepository vagaRepository;
    private final SkillRepository skillRepository;
    private final VagaSkillMapper mapper;

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
    public VagaSkillResponseDTO createVagaSkill(VagaSkillCreateDTO createDTO) {
        log.info("Criando nova vaga-skill: Vaga ID: {}, Skill ID: {}",
                createDTO.vagaId(), createDTO.skillId());

        VagaEntity vaga = vagaRepository.findById(createDTO.vagaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + createDTO.vagaId()));

        SkillEntity skill = skillRepository.findById(createDTO.skillId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Skill não encontrada com ID: " + createDTO.skillId()));

        VagaSkillEntity vagaSkill = mapper.toEntity(createDTO);
        vagaSkill.setVaga(vaga);
        vagaSkill.setSkill(skill);

        VagaSkillEntity vagaSkillSave = repository.save(vagaSkill);
        log.info("Vaga-skill criada com sucesso");

        return mapper.toResponseDTO(vagaSkillSave);
    }

    @Transactional(readOnly = true)
    public List<VagaSkillResponseDTO> listAllVagaSkill() {
        log.info("Listando todas as vagas-skills");
        return repository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VagaSkillResponseDTO getVagaSkillById(VagaSkillId id) {
        log.info("Buscando vaga-skill: Vaga ID: {}, Skill ID: {}",
                id.getVagaId(), id.getSkillId());

        VagaSkillEntity vagaSkill = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vaga-skill não encontrada: Vaga " + id.getVagaId() + ", Skill " + id.getSkillId()));

        return mapper.toResponseDTO(vagaSkill);
    }

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
    public VagaSkillResponseDTO updateVagaSkillById(VagaSkillUpdateDTO updateDTO, VagaSkillId id) {
        log.info("Atualizando vaga-skill: Vaga ID: {}, Skill ID: {}",
                id.getVagaId(), id.getSkillId());

        VagaSkillEntity vagaSkill = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vaga-skill não encontrada: Vaga " + id.getVagaId() + ", Skill " + id.getSkillId()));

        vagaSkill.setPeso(updateDTO.peso());

        VagaSkillEntity vagaSkillAtualizado = repository.save(vagaSkill);
        log.info("Vaga-skill atualizada com sucesso");

        return mapper.toResponseDTO(vagaSkillAtualizado);
    }

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
    public void deleteVagaSkillById(VagaSkillId id) {
        log.info("Deletando vaga-skill: Vaga ID: {}, Skill ID: {}",
                id.getVagaId(), id.getSkillId());

        VagaSkillEntity vagaSkill = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vaga-skill não encontrada: Vaga " + id.getVagaId() + ", Skill " + id.getSkillId()));

        repository.delete(vagaSkill);
        log.info("Vaga-skill deletada com sucesso");
    }

    @Transactional(readOnly = true)
    public List<VagaSkillResponseDTO> findSkillsByVaga(Integer vagaId) {
        log.info("Buscando skills para vaga ID: {}", vagaId);

        VagaEntity vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + vagaId));

        return repository.findByVaga(vaga)
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VagaSkillResponseDTO> findVagasBySkill(Integer skillId) {
        log.info("Buscando vagas que requerem skill ID: {}", skillId);

        SkillEntity skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill não encontrada com ID: " + skillId));

        return repository.findBySkill(skill)
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
