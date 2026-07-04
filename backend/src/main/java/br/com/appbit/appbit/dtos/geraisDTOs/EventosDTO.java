package br.com.appbit.appbit.dtos.geraisDTOs;

import java.time.LocalDateTime;

import br.com.appbit.appbit.validation.PalavrasMaximas;
import jakarta.validation.constraints.NotBlank;

public record EventosDTO(

                @NotBlank(message = "O nome é obrigatório") String nome,

                @NotBlank(message = "A data é obrigatória") LocalDateTime data,

                @NotBlank(message = "Os palestrantes são obrigatórios") String palestrantes,

                @NotBlank(message = "O tema da palestra é obrigatório") String temaPalestra,

                @NotBlank(message = "Os detalhes são obrigatórios") String detalhes,

                @NotBlank(message = "O local é obrigatório") String local,

                @PalavrasMaximas(mensagem = "A carga horária do evento excede o limite máximo de 10 palavras.", max = 10) @NotBlank(message = "A carga horária é obrigatória") String cargaHoraria) {
}
