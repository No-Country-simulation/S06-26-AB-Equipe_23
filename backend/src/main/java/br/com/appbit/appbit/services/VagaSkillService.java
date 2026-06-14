package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.*;
import br.com.appbit.appbit.mappers.CandidatoSkillMapper;
import br.com.appbit.appbit.mappers.VagaSkillMapper;
import br.com.appbit.appbit.repositories.CandidatoSkillRepository;
import br.com.appbit.appbit.repositories.SkillRepository;
import br.com.appbit.appbit.repositories.VagaRepository;
import br.com.appbit.appbit.repositories.VagaSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class VagaSkillService {

    private final VagaSkillRepository repository;

    private final VagaRepository vagaRepository;

    private final SkillRepository skillRepository;

    private final VagaSkillMapper mapper;

    public VagaSkillResponseDTO createVagaSkill(VagaSkillCreateDTO createDTO) {

        VagaEntity vaga =
                vagaRepository.findById(createDTO.vagaId()).orElse(null);

        if (vaga == null) {
            throw new RuntimeException("Vaga não encontrada");
        }

        SkillEntity skill =
                skillRepository.findById(createDTO.skillId()).orElse(null);

        if (skill == null) {
            throw new RuntimeException("Skill não encontrada");
        }

        VagaSkillEntity vagaSkill= mapper.toEntity(createDTO);

        vagaSkill.setVaga(vaga);
        vagaSkill.setSkill(skill);

        VagaSkillEntity vagaSkillSave = repository.save(vagaSkill);

        return mapper.toResponseDTO(vagaSkillSave);
    }

    public List<VagaSkillResponseDTO> listAllVagaSkill() {

        List<VagaSkillEntity> vagasSkills = repository.findAll();
        List<VagaSkillResponseDTO> responseDTOS = new ArrayList<>();

        for (VagaSkillEntity vagaSkill : vagasSkills) {

            VagaSkillResponseDTO responseDTO =
                    mapper.toResponseDTO(vagaSkill);

            responseDTOS.add(responseDTO);
        }

        return responseDTOS;
    }

    public VagaSkillResponseDTO getVagaSkillById(VagaSkillId id) {

        VagaSkillEntity vagaSkill  = repository.findById(id).orElse(null);

        if (vagaSkill  == null) {
            throw new RuntimeException("Vaga Skill não encontrados");
        }

        return mapper.toResponseDTO(vagaSkill );
    }

    public VagaSkillResponseDTO updateVagaSkillById(
            VagaSkillUpdateDTO updateDTO,
            VagaSkillId id) {

        VagaSkillEntity vagaSkill = repository.findById(id).orElse(null);

        if (vagaSkill == null) {
            throw new RuntimeException("Vaga Skill não encontrados");
        }

        vagaSkill.setPeso(updateDTO.peso());

        VagaSkillEntity vagaSkillAtualizado =
                repository.save(vagaSkill);

        return mapper.toResponseDTO(vagaSkillAtualizado);
    }

    public void deleteVagaSkillById(VagaSkillId id) {

        VagaSkillEntity vagaSkill = repository.findById(id).orElse(null);

        if (vagaSkill == null) {
            throw new RuntimeException("Vaga Skill não encontrados");
        }

        repository.delete(vagaSkill);
    }
}