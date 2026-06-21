package br.com.appbit.appbit.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Representação completa do candidato, como ele existe no mock interno
 * (mocks/candidatos_teste.json). Esta classe NUNCA deve ser retornada
 * diretamente na listagem geral de POST /match — apenas na rota de
 * gatilho POST /match/{id}/aprovar.
 */
public record CandidatoCompletoDTO(
        @JsonProperty("candidato_id") String candidatoId,
        @JsonProperty("apelido_exibicao") String apelidoExibicao,
        @JsonProperty("status_identificacao") String statusIdentificacao,
        @JsonProperty("contato_pos_aprovacao") ContatoPosAprovacaoDTO contatoPosAprovacao,
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
