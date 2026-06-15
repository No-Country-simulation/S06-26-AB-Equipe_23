package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RegiaoInsightDTO(
        String cluster,

        String municipio,

        Double lat,

        Double lon,

        @JsonProperty("n_usuarios_estimados")
        Integer nUsuariosEstimados,

        @JsonProperty("periodo_pico")
        String periodoPico,

        @JsonProperty("perfil_regiao")
        String perfilRegiao,

        @JsonProperty("indicador_acessibilidade")
        String indicadorAcessibilidade,

        @JsonProperty("uso_no_produto")
        String usoNoProduto

) {
}
