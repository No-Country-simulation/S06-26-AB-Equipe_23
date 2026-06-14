package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.CandidatoResponseDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)

public interface CandidatoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "regiao", ignore = true)
    CandidatoEntity toEntity(CandidatoCreateDTO dto);


    @Mapping(target = "regiaoId", source = "regiao.id")
    CandidatoResponseDTO toResponseDTO(CandidatoEntity entity);


}
