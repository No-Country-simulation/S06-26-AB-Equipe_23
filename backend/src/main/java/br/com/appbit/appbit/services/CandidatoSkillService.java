package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.createDTOs.CandidatoSkillCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.CandidatoSkillResponseDTO;
import br.com.appbit.appbit.dtos.updateDTOs.CandidatoSkillUpdateDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.CandidatoSkillEntity;
import br.com.appbit.appbit.entities.CandidatoSkillId;
import br.com.appbit.appbit.entities.SkillEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.CandidatoSkillMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import br.com.appbit.appbit.repositories.CandidatoSkillRepository;
import br.com.appbit.appbit.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidatoSkillService {

    private final CandidatoSkillRepository repository;
    private final CandidatoRepository candidatoRepository;
    private final SkillRepository skillRepository;
    private final CandidatoSkillMapper mapper;

    public CandidatoSkillResponseDTO createCandidatoSkill(CandidatoSkillCreateDTO createDTO) {

        CandidatoEntity candidato = candidatoRepository.findById(createDTO.candidatoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidato não encontrado com ID: " + createDTO.candidatoId()));

        SkillEntity skill = skillRepository.findById(createDTO.skillId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Skill não encontrada com ID: " + createDTO.skillId()));

        CandidatoSkillEntity candidatoSkill = mapper.toEntity(createDTO);
        candidatoSkill.setCandidato(candidato);
        candidatoSkill.setSkill(skill);

        CandidatoSkillEntity candidatoSkillSave = repository.save(candidatoSkill);

        return mapper.toResponseDTO(candidatoSkillSave);
    }

    @Transactional(readOnly = true)
    public List<CandidatoSkillResponseDTO> listAllCandidatoSkill() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CandidatoSkillResponseDTO getCandidatoSkillById(CandidatoSkillId id) {

        CandidatoSkillEntity candidatoSkill = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidato-skill não encontrada: Candidato " + id.getCandidatoId() + ", Skill "
                                + id.getSkillId()));

        return mapper.toResponseDTO(candidatoSkill);
    }

    public CandidatoSkillResponseDTO updateCandidatoSkillById(
            CandidatoSkillUpdateDTO updateDTO,
            CandidatoSkillId id) {

        CandidatoSkillEntity candidatoSkill = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidato-skill não encontrada: Candidato " + id.getCandidatoId() + ", Skill "
                                + id.getSkillId()));

        candidatoSkill.setNivel(updateDTO.nivel());

        CandidatoSkillEntity candidatoSkillAtualizado = repository.save(candidatoSkill);

        return mapper.toResponseDTO(candidatoSkillAtualizado);
    }

    public void deleteCandidatoSkillById(CandidatoSkillId id) {

        CandidatoSkillEntity candidatoSkill = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidato-skill não encontrada: Candidato " + id.getCandidatoId() + ", Skill "
                                + id.getSkillId()));

        repository.delete(candidatoSkill);

    }

    @Transactional(readOnly = true)
    public List<CandidatoSkillResponseDTO> findSkillsByCandidato(Integer candidatoId) {

        CandidatoEntity candidato = candidatoRepository.findById(candidatoId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidato não encontrado com ID: " + candidatoId));

        return repository.findByCandidato(candidato)
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidatoSkillResponseDTO> findCandidatosBySkill(Integer skillId) {

        SkillEntity skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill não encontrada com ID: " + skillId));

        return repository.findBySkill(skill)
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}