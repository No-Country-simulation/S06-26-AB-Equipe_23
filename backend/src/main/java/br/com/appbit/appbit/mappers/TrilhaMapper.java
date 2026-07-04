package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.geraisDTOs.TrilhasDTO;
import br.com.appbit.appbit.entities.TrilhaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TrilhaMapper {

    @Mapping(target = "id", ignore = true)
    TrilhaEntity toEntity(TrilhasDTO dto);

    
    @Mapping(target = "link", source = "link")
    TrilhasDTO toDTO(TrilhaEntity entity);
}
