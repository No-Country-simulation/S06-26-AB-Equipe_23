package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.createDTOs.CandidatoSkillCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.CandidatoSkillResponseDTO;
import br.com.appbit.appbit.entities.CandidatoSkillEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CandidatoSkillMapper {

    @Mapping(target = "id.candidatoId", source = "candidatoId")
    @Mapping(target = "id.skillId", source = "skillId")
    @Mapping(target = "candidato", ignore = true)
    @Mapping(target = "skill", ignore = true)
    CandidatoSkillEntity toEntity(CandidatoSkillCreateDTO dto);

    @Mapping(target = "candidatoId", source = "candidato.id")
    @Mapping(target = "skillId", source = "skill.id")
    CandidatoSkillResponseDTO toResponseDTO(CandidatoSkillEntity entity);
}



