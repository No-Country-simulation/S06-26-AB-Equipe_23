package br.com.appbit.appbit.exceptions;

import java.time.LocalDateTime;

public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String erro,
        String mensagem) {
}