package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.create.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.create.MatchCreateDTO;
import br.com.appbit.appbit.dtos.response.CandidatoResponseDTO;
import br.com.appbit.appbit.dtos.response.MatchResponseDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.MatchEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)

public interface MatchMapper {

    @Mapping(target = "vaga", ignore = true)
    @Mapping(target = "candidato", ignore = true)
    MatchEntity toEntity(MatchCreateDTO dto);


    @Mapping(target = "vagaId", source = "vaga.id")
    @Mapping(target = "candidatoId", source = "candidato.id")
    MatchResponseDTO toResponseDTO(MatchEntity entity);


}
