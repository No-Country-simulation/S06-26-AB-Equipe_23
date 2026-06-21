package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.create.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.response.CandidatoResumidoDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)

public interface CandidatoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "regiao", ignore = true)
    CandidatoEntity toEntity(CandidatoCreateDTO dto);
    CandidatoResumidoDTO toResumidoDTO(CandidatoEntity entity);


}
