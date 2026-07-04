package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.createDTOs.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.responseDTOs.CandidatoResponseDTO;
import br.com.appbit.appbit.dtos.utilDTOs.CandidatoMatchDTO;
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

 @Mapping(target = "candidatoId", expression = "java(String.valueOf(entity.getId()))")
    @Mapping(target = "cargoAlvo", source = "cargo")
    @Mapping(target = "regiao", source = "regiao.municipio") 
    @Mapping(target = "clusterResidencia", source = "cluster")
    @Mapping(target = "lon", expression = "java(entity.getLon() != null ? Double.valueOf(entity.getLon()) : null)")
    @Mapping(target = "modeloTrabalhoPreferido", source = "disponibilidade") 
    @Mapping(target = "badgeDiversidade", source = "diversidade")
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "anosExperiencia", ignore = true)
    @Mapping(target = "scoreMatch", ignore = true)
    CandidatoMatchDTO toMatchDTO(CandidatoEntity entity);
}
