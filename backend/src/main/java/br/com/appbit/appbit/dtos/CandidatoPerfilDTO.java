package br.com.appbit.appbit.dtos;

import java.util.List;

public record CandidatoPerfilDTO(
        Integer id,
        String nome,
        String email,
        String telefone,
        String linkedin,
        String cargo,
        String nivel,
        Integer anosExperiencia,
        String disponibilidade,
        Integer regiaoId,
        String municipio,
        String cluster,
        String grupo,
        String diversidade,
        List<String> skills
) {
}
