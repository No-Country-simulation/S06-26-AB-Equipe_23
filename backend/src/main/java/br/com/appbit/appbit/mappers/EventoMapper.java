package br.com.appbit.appbit.mappers;

import br.com.appbit.appbit.dtos.geraisDTOs.EventosDTO;
import br.com.appbit.appbit.entities.EventoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface EventoMapper {

    @Mapping(target = "id", ignore = true)
    EventoEntity toEntity(EventosDTO dto);

    EventosDTO toDTO(EventoEntity dto);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(EventosDTO dto, @MappingTarget EventoEntity entity);
}
