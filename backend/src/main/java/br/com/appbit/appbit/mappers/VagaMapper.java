package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.VagaCreateDTO;
import br.com.appbit.appbit.dtos.VagaResponseDTO;
import br.com.appbit.appbit.entities.VagaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface VagaMapper {

    VagaEntity toEntity(VagaCreateDTO dto);


    VagaResponseDTO toResponseDTO(VagaEntity entity);

}
