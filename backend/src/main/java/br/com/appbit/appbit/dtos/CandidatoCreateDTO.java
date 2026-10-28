package br.com.appbit.appbit.dtos;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CandidatoCreateDTO(

        @NotBlank(message = "O nome é obrigatório")
        String nome,

        String cargo,

        @NotBlank(message = "O nivel é obrigatório")
        String nivel,

        String cluster,

        String municipio,

        String cep,

        Double lat,

        Double lon,

        String grupo,

        String diversidade,

        String disponibilidade,

        Boolean ativo,

        Integer regiaoId,

        Integer anosExperiencia,

        List<String> skills,

        String email,

        String telefone,

        String linkedin,

        Boolean consentimentoLgpd
) {
    public CandidatoCreateDTO withEmail(String normalizedEmail) {
        return new CandidatoCreateDTO(
                nome, cargo, nivel, cluster, municipio, cep, lat, lon, grupo, diversidade,
                disponibilidade, ativo, regiaoId, anosExperiencia, skills, normalizedEmail,
                telefone, linkedin, consentimentoLgpd
        );
    }

    public CandidatoCreateDTO(
            String nome,
            String cargo,
            String nivel,
            String cluster,
            String municipio,
            String cep,
            Double lat,
            Double lon,
            String grupo,
            String diversidade,
            String disponibilidade,
            Boolean ativo,
            Integer regiaoId
    ) {
        this(nome, cargo, nivel, cluster, municipio, cep, lat, lon, grupo, diversidade, disponibilidade, ativo, regiaoId, null, null, null, null, null, true);
    }
}
