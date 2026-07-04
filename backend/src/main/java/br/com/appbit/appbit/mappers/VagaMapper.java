package br.com.appbit.appbit.mappers;

import br.com.appbit.appbit.dtos.createDTOs.VagaCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.VagaResponseDTO;
import br.com.appbit.appbit.entities.VagaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface VagaMapper {

    // regiaoAlvo era ignorado antes, agora o VagaService o resolve via RegiaoRepository
    @Mapping(target = "regiaoAlvo", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "criacao", ignore = true)
    VagaEntity toEntity(VagaCreateDTO dto);

    @Mapping(target = "regiaoAlvo", source = "regiaoAlvo")
    VagaResponseDTO toResponseDTO(VagaEntity entity);
}