package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.createDTOs.SkillCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.SkillResponseDTO;
import br.com.appbit.appbit.dtos.updateDTOs.SkillUpdateDTO;
import br.com.appbit.appbit.entities.SkillEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.SkillMapper;
import br.com.appbit.appbit.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    public SkillResponseDTO createSkill(SkillCreateDTO createDTO) {
        log.info("Criando nova skill: {}", createDTO.nome());

        // Validar se skill já existe
        if (skillRepository.existsByNome(createDTO.nome())) {
           throw new ResponseStatusException(HttpStatus.CONFLICT, "Skill com este nome já existe");
        }

        SkillEntity skill = skillMapper.toEntity(createDTO);
        SkillEntity skillSave = skillRepository.save(skill);

        log.info("Skill criada com sucesso. ID: {}", skillSave.getId());
        return skillMapper.toResponseDTO(skillSave);
    }

    @Transactional(readOnly = true)
    public List<SkillResponseDTO> listAllSkill() {
        log.info("Listando todas as skills");
        return skillRepository.findAll()
                .stream()
                .map(skillMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SkillResponseDTO getSkillById(Integer skillId) {
        log.info("Buscando skill por ID: {}", skillId);
        SkillEntity skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill não encontrado com ID: " + skillId));

        return skillMapper.toResponseDTO(skill);
    }

    public SkillResponseDTO updateSkillById(SkillUpdateDTO updateDTO, Integer skillId) {
        log.info("Atualizando skill com ID: {}", skillId);

        SkillEntity skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill não encontrado com ID: " + skillId));

        skill.setNome(updateDTO.nome());
        skill.setCategoria(updateDTO.categoria());

        SkillEntity skillAtualizado = skillRepository.save(skill);
        log.info("Skill atualizada com sucesso. ID: {}", skillId);

        return skillMapper.toResponseDTO(skillAtualizado);
    }

    public void deleteSkillById(Integer skillId) {
        log.info("Deletando skill com ID: {}", skillId);

        SkillEntity skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill não encontrado com ID: " + skillId));

        skillRepository.delete(skill);
        log.info("Skill deletada com sucesso. ID: {}", skillId);
    }

    @Transactional(readOnly = true)
    public List<SkillResponseDTO> findByCategoria(String categoria) {
        log.info("Buscando skills por categoria: {}", categoria);
        return skillRepository.findByCategoria(categoria)
                .stream()
                .map(skillMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}