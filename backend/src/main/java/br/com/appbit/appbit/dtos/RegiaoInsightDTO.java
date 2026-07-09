package br.com.appbit.appbit.dtos;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RegiaoInsightDTO(
                @JsonProperty("qtd_antenas") Integer qtdAntenas,
                @JsonProperty("lat_media") BigDecimal lat,
                @JsonProperty("lon_media") BigDecimal lon,
                @JsonProperty("municipio") String municipio,
                @JsonProperty("cluster") String cluster,
                @JsonProperty("total_sessoes_3g") Long totalSessoes3g,
                @JsonProperty("total_sessoes_4g") Long totalSessoes4g,
                @JsonProperty("total_sessoes_5g") Long totalSessoes5g,
                @JsonProperty("total_sessoes_outros") Long totalSessoesOutros,
                @JsonProperty("total_sessoes") Long totalSessoes,
                @JsonProperty("percentual_3g") Double percentual3g,
                @JsonProperty("percentual_4g") Double percentual4g,
                @JsonProperty("percentual_5g") Double percentual5g,
                @JsonProperty("percentual_outros") Double percentualOutros,
                @JsonProperty("tecnologia_predominante_regiao") String tecnologiaPredominanteRegiao,
                @JsonProperty("qualidade_sinal") String qualidadeSinal,
                @JsonProperty("indicador_conectividade") String indicadorConectividade,
                @JsonProperty("usuarios_observados_total") Long usuariosObservadosTotal,
                @JsonProperty("sessoes_concentracao_total") Long sessoesConcentracaoTotal,
                @JsonProperty("periodo_pico") String periodoPico,
                @JsonProperty("usuarios_observados_periodo_pico") Long usuariosObservadosPeriodoPico,
                @JsonProperty("indice_concentracao_relativa") Double indiceConcentracaoRelativa,
                @JsonProperty("fonte_antenas") String fonteAntenas,
                @JsonProperty("fonte_sessoes") String fonteSessoes,
                @JsonProperty("fonte_concentracao") String fonteConcentracao) {
}
