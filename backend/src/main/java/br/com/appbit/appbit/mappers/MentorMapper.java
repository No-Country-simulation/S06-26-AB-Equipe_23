package br.com.appbit.appbit.mappers;

import br.com.appbit.appbit.dtos.createDTOs.MentorCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.MentorResponseDTO;
import br.com.appbit.appbit.dtos.updateDTOs.MentorUpdateDTO;
import br.com.appbit.appbit.entities.MentorEntity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface MentorMapper {

    @Mapping(target = "id", ignore = true)
    MentorEntity toEntity(MentorCreateDTO dto);

    MentorResponseDTO toResponseDTO(MentorEntity entity);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromCreateDto(MentorCreateDTO dto, @MappingTarget MentorEntity entity);

        @Mapping(target = "id", ignore = true)
    void updateEntityFromResponseDto(MentorResponseDTO dto, @MappingTarget MentorEntity entity);

        @Mapping(target = "id", ignore = true)
    void updateEntityFromUpdateDto(MentorUpdateDTO dto, @MappingTarget MentorEntity entity);
}
