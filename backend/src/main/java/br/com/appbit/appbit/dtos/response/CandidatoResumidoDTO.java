package br.com.appbit.appbit.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Representação do candidato exposta na listagem geral de POST /match.
 * Idêntica a {@link CandidatoCompletoDTO}, exceto pelo campo de contato,
 * que aqui é {@link ContatoResumidoDTO} (sem nome, email e telefone).
 */
public record CandidatoResumidoDTO(
        @JsonProperty("candidato_id") String candidatoId,
        @JsonProperty("apelido_exibicao") String apelidoExibicao,
        @JsonProperty("status_identificacao") String statusIdentificacao,
        @JsonProperty("contato_pos_aprovacao") ContatoResumidoDTO contatoPosAprovacao,
        @JsonProperty("cargo_alvo") String cargoAlvo,
        @JsonProperty("nivel") String nivel,
        @JsonProperty("regiao") String regiao,
        @JsonProperty("cluster_residencia") String clusterResidencia,
        @JsonProperty("cep") String cep,
        @JsonProperty("lat") Double lat,
        @JsonProperty("lon") Double lon,
        @JsonProperty("modelo_trabalho_preferido") String modeloTrabalhoPreferido,
        @JsonProperty("skills") List<String> skills,
        @JsonProperty("anos_experiencia") Integer anosExperiencia,
        @JsonProperty("badge_diversidade") String badgeDiversidade,
        @JsonProperty("score_match") Integer scoreMatch
) {
}
