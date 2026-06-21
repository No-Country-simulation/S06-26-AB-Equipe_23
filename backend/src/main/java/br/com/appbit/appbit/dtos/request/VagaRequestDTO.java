package br.com.appbit.appbit.dtos.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record VagaRequestDTO(
        String titulo,

        List<String> skills,

        String nivel,

        String regiao,

        @JsonProperty("modelo_trabalho")
        String modeloTrabalho
) {


}
