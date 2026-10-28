package br.com.appbit.appbit.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record FeedbackResumoDTO(

        @JsonProperty("feedback_id")
        Long feedbackId,

        @JsonProperty("empresa_id")
        String empresaId,

        @JsonProperty("vaga_id")
        Integer vagaId,

        @JsonProperty("candidato_id")
        String candidatoId,

        @JsonProperty("decisao")
        String decisao,

        @JsonProperty("motivo_rejeicao")
        String motivoRejeicao,

        @JsonProperty("anotacoes_internas")
        String anotacoesInternas,

        @JsonProperty("criado_em")
        LocalDateTime criadoEm
) {
}
