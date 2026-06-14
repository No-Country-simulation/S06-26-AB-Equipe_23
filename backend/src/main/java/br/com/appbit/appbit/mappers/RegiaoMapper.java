package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.RegiaoCreateDTO;
import br.com.appbit.appbit.dtos.RegiaoResponseDTO;
import br.com.appbit.appbit.entities.RegiaoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RegiaoMapper {

    RegiaoEntity toEntity(RegiaoCreateDTO dto);


    RegiaoResponseDTO toResponseDTO(RegiaoEntity entity);

}
