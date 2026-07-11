package br.com.appbit.appbit.mappers;


import br.com.appbit.appbit.dtos.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import br.com.appbit.appbit.dtos.CandidatoResponseDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CandidatoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "regiao", ignore = true)
    @Mapping(target = "candidatoSkills", ignore = true)
    CandidatoEntity toEntity(CandidatoCreateDTO dto);

    @Mapping(target = "regiaoId", source = "regiao.id")
    CandidatoResponseDTO toResponseDTO(CandidatoEntity entity);

    @Mapping(target = "candidatoId",            expression = "java(String.format(\"cand_%03d\", entity.getId()))")
    @Mapping(target = "apelidoExibicao",        expression = "java(String.format(\"Candidato A-%03d\", entity.getId()))")
    @Mapping(target = "cargoAlvo",              source = "cargo")
    @Mapping(target = "regiao",                 source = "regiao.municipio")
    @Mapping(target = "modeloTrabalhoPreferido", source = "modeloTrabalhoPreferido")
    @Mapping(target = "anosExperiencia",         source = "anosExperiencia")
    @Mapping(target = "badgeDiversidade",        source = "diversidade")
    @Mapping(target = "skills",                  source = "candidatoSkills", qualifiedByName = "skillsToNomes")
    @Mapping(target = "scoreMatch",              constant = "0")
    @Mapping(target = "justificativaAi",         ignore = true)
    CandidatoMatchDTO toMatchDTO(CandidatoEntity entity);

    @Named("skillsToNomes")
    static List<String> skillsToNomes(
            List<br.com.appbit.appbit.entities.CandidatoSkillEntity> candidatoSkills) {
        if (candidatoSkills == null) return List.of();
        return candidatoSkills.stream()
                .filter(cs -> cs.getSkill() != null)
                .map(cs -> cs.getSkill().getNome())
                .toList();
    }
}
