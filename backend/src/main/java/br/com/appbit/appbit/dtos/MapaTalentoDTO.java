package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record MapaTalentoDTO(
        String regiao,
        Integer concentracao,
        @JsonProperty("cobertura_rede") String coberturaRede,
        @JsonProperty("perfis_disponiveis") List<String> perfisDisponiveis) {
}