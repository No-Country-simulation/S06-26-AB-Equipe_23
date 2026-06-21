package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.create.RegiaoCreateDTO;
import br.com.appbit.appbit.dtos.response.RegiaoInsightDTO;
import br.com.appbit.appbit.entities.RegiaoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RegiaoMapper {

    RegiaoEntity toEntity(RegiaoCreateDTO dto);
    RegiaoInsightDTO toResponseDTO(RegiaoEntity entity);

}
