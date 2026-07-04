package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.createDTOs.RegiaoCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.RegiaoResponseDTO;
import br.com.appbit.appbit.entities.RegiaoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RegiaoMapper {

    @Mapping(target = "id", ignore = true)
    RegiaoEntity toEntity(RegiaoCreateDTO dto);


    RegiaoResponseDTO toResponseDTO(RegiaoEntity entity);

}
