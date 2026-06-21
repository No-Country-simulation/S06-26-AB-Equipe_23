package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.create.VagaSkillCreateDTO;
import br.com.appbit.appbit.dtos.response.VagaSkillResponseDTO;
import br.com.appbit.appbit.entities.VagaSkillEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface VagaSkillMapper {

    @Mapping(target = "id.vagaId", source = "vagaId")
    @Mapping(target = "id.skillId", source = "skillId")
    @Mapping(target = "vaga", ignore = true)
    @Mapping(target = "skill", ignore = true)
    VagaSkillEntity toEntity(VagaSkillCreateDTO dto);

    @Mapping(target = "vagaId", source = "vaga.id")
    @Mapping(target = "skillId", source = "skill.id")
    VagaSkillResponseDTO toResponseDTO(VagaSkillEntity entity);

}



