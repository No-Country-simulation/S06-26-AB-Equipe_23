package br.com.appbit.appbit.dtos.responseDTOs;

public record MentorResponseDTO(
        String nome,
        String cargo,
        String empresaOrigem,
        String especialidadeEsg,
        String disponibilidade) {
}
