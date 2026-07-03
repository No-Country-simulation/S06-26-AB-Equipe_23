package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.EventoDTO;

import br.com.appbit.appbit.entities.EventoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)

public interface EventoMapper {

    @Mapping(target = "id", ignore = true)
    EventoEntity toEntity(EventoDTO dto);
}
