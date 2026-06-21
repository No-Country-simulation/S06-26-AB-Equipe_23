package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.create.CandidatoSkillCreateDTO;
import br.com.appbit.appbit.dtos.response.SkillResponseDTO;
import br.com.appbit.appbit.dtos.update.CandidatoSkillUpdateDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.CandidatoSkillEntity;
import br.com.appbit.appbit.entities.CandidatoSkillId;
import br.com.appbit.appbit.entities.SkillEntity;
import br.com.appbit.appbit.mappers.CandidatoSkillMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import br.com.appbit.appbit.repositories.CandidatoSkillRepository;
import br.com.appbit.appbit.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CandidatoSkillService {

    private final CandidatoSkillRepository repository;

    private final CandidatoRepository candidatoRepository;

    private final SkillRepository skillRepository;

    private final CandidatoSkillMapper mapper;

    public SkillResponseDTO createCandidatoSkill(CandidatoSkillCreateDTO createDTO) {

        CandidatoEntity candidato =
                candidatoRepository.findById(createDTO.candidatoId()).orElse(null);

        if (candidato == null) {
            throw new RuntimeException("Candidato não encontrado");
        }

        SkillEntity skill =
                skillRepository.findById(createDTO.skillId()).orElse(null);

        if (skill == null) {
            throw new RuntimeException("Skill não encontrada");
        }

        CandidatoSkillEntity candidatoSkill = mapper.toEntity(createDTO);

        candidatoSkill.setCandidato(candidato);
        candidatoSkill.setSkill(skill);

        CandidatoSkillEntity candidatoSkillSave = repository.save(candidatoSkill);

        return mapper.toResponseDTO(candidatoSkillSave);
    }

    public List<SkillResponseDTO> listAllCandidatoSkill() {

        List<CandidatoSkillEntity> candidatoSkills = repository.findAll();
        List<SkillResponseDTO> responseDTOS = new ArrayList<>();

        for (CandidatoSkillEntity candidatoSkill : candidatoSkills) {

            SkillResponseDTO responseDTO =
                    mapper.toResponseDTO(candidatoSkill);

            responseDTOS.add(responseDTO);
        }

        return responseDTOS;
    }

    public SkillResponseDTO getCandidatoSkillById(CandidatoSkillId id) {

        CandidatoSkillEntity candidatoSkill = repository.findById(id).orElse(null);

        if (candidatoSkill == null) {
            throw new RuntimeException("Candidato Skill não encontrado");
        }

        return mapper.toResponseDTO(candidatoSkill);
    }

    public SkillResponseDTO updateCandidatoSkillById(
            CandidatoSkillUpdateDTO updateDTO,
            CandidatoSkillId id) {

        CandidatoSkillEntity candidatoSkill = repository.findById(id).orElse(null);

        if (candidatoSkill == null) {
            throw new RuntimeException("Candidato Skill não encontrado");
        }

        candidatoSkill.setNivel(updateDTO.nivel());

        CandidatoSkillEntity candidatoSkillAtualizado =
                repository.save(candidatoSkill);

        return mapper.toResponseDTO(candidatoSkillAtualizado);
    }

    public void deleteCandidatoSkillById(CandidatoSkillId id) {

        CandidatoSkillEntity candidatoSkill = repository.findById(id).orElse(null);

        if (candidatoSkill == null) {
            throw new RuntimeException("Candidato Skill não encontrado");
        }

        repository.delete(candidatoSkill);
    }
}