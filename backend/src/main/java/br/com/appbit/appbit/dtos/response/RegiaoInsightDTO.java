package br.com.appbit.appbit.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RegiaoInsightDTO(
                @JsonProperty("municipio") String municipio,
                @JsonProperty("cluster") String cluster,
                @JsonProperty("qtd_antenas") Integer qtdAntenas,
                @JsonProperty("lat_media") Double latMedia,
                @JsonProperty("lon_media") Double lonMedia,
                @JsonProperty("total_sessoes_3g") Long totalSessoes3g,
                @JsonProperty("total_sessoes_4g") Long totalSessoes4g,
                @JsonProperty("total_sessoes_5g") Long totalSessoes5g,
                @JsonProperty("total_sessoes_outros") Long totalSessoesOutros,
                @JsonProperty("total_sessoes") Long totalSessoes,
                @JsonProperty("percentual_3g") Double percentual3g,
                @JsonProperty("percentual_4g") Double percentual4g,
                @JsonProperty("percentual_5g") Double percentual5g,
                @JsonProperty("tecnologia_predominante_regiao") String tecnologiaPredominanteRegiao,
                @JsonProperty("indicador_conectividade") String indicadorConectividade) {
}
