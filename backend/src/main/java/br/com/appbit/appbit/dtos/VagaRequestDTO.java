package br.com.appbit.appbit.dtos;

import java.util.List;

public record VagaRequestDTO(
        String titulo,

        List<String> skills,

        String nivel,

        String regiao,

        String modeloTrabalho
) {


}
