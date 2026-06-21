package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.create.SkillCreateDTO;
import br.com.appbit.appbit.dtos.response.SkillResponseDTO;
import br.com.appbit.appbit.dtos.update.SkillUpdateDTO;
import br.com.appbit.appbit.entities.SkillEntity;
import br.com.appbit.appbit.mappers.SkillMapper;
import br.com.appbit.appbit.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    private final SkillMapper skillMapper;

    public SkillResponseDTO createSkill(SkillCreateDTO createDTO){

         SkillEntity skill = skillMapper.toEntity(createDTO);

        SkillEntity skillSave = skillRepository.save(skill);

        return skillMapper.toResponseDTO(skillSave);
    }

    public List<SkillResponseDTO> listAllSkill(){
        List<SkillEntity> skillList = skillRepository.findAll();
        List<SkillResponseDTO> skillResponseDTOS = new ArrayList<>();

        for (SkillEntity skill : skillList) {

            SkillResponseDTO responseDTO= skillMapper.toResponseDTO(skill);

            skillResponseDTOS.add(responseDTO);
        }
        return skillResponseDTOS;
    }

    public SkillResponseDTO getSkillById(Integer skillId){

        SkillEntity skill = skillRepository.findById(skillId).orElse(null);

        if (skill == null){
            throw  new RuntimeException("Skill não encontrado");
        }

        SkillResponseDTO responseDTO = skillMapper.toResponseDTO(skill);

        return responseDTO;
    }

    public SkillResponseDTO updateSkillById(SkillUpdateDTO updateDTO, Integer skillId){


        SkillEntity skill = skillRepository.findById(skillId).orElse(null);

        if (skill == null){
            throw  new RuntimeException("Skill não encontrado");
        }

        skill.setNome(updateDTO.nome());
        skill.setCategoria(updateDTO.categoria());

        SkillEntity skillAtualizado =   skillRepository.save(skill);

        return skillMapper.toResponseDTO(skillAtualizado);
    }


    public void deleteSkillById( Integer skillId ){

        SkillEntity skill = skillRepository.findById(skillId).orElse(null);

        if (skill == null){

            throw  new RuntimeException("Skill não encontrado");

        }

        skillRepository.delete(skill);
    }
}
