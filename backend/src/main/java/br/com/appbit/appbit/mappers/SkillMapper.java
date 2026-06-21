package br.com.appbit.appbit.mappers;

import br.com.appbit.appbit.dtos.create.SkillCreateDTO;
import br.com.appbit.appbit.dtos.response.SkillResponseDTO;
import br.com.appbit.appbit.entities.SkillEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SkillMapper {

    SkillEntity toEntity(SkillCreateDTO dto);


    SkillResponseDTO toResponseDTO(SkillEntity entity);

}
