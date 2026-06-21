package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.create.VagaCreateDTO;
import br.com.appbit.appbit.dtos.response.VagaResponseDTO;
import br.com.appbit.appbit.entities.VagaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface VagaMapper {

    VagaEntity toEntity(VagaCreateDTO dto);


    VagaResponseDTO toResponseDTO(VagaEntity entity);

}
