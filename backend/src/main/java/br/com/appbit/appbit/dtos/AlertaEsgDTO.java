package br.com.appbit.appbit.dtos;

public record AlertaEsgDTO(
    String titulo,
    String descricao,
    String gravidade, // "INFO", "WARNING", "DANGER"
    String regiao,
    String acaoRecomendada
) {}
