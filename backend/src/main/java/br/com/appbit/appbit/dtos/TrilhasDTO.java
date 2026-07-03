package br.com.appbit.appbit.dtos;

import br.com.appbit.appbit.validation.PalavrasMaximas;
import jakarta.validation.constraints.NotBlank;

public record TrilhasDTO(

                @NotBlank(message = "O nome é obrigatório") String nome,

                @PalavrasMaximas(mensagem = "O horario do evento excede o limite máximo de 20 palavras.", max = 20) @NotBlank(message = "O tema da palestra é obrigatório") String carga_horaria,

                @NotBlank(message = "Os detalhes são obrigatórios") String descricao,

                String link) {
}