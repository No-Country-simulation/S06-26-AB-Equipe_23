package br.com.appbit.appbit.exception;

import br.com.appbit.appbit.dto.error.ErroPadraoResponseDTO;
import br.com.appbit.appbit.dto.error.ErroValidacaoResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Captura falhas de @Valid no corpo da requisição (ex: regiao ausente,
     * score_minimo fora de 0-100) e devolve 400 com o detalhe campo a campo,
     * em vez de deixar estourar um 500.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroValidacaoResponseDTO> tratarErrosDeValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new LinkedHashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            erros.put(erro.getField(), erro.getDefaultMessage());
        }

        ErroValidacaoResponseDTO corpo = new ErroValidacaoResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Critérios de triagem inválidos. Verifique os campos obrigatórios.",
                erros
        );

        return ResponseEntity.badRequest().body(corpo);
    }

    @ExceptionHandler(CandidatoNaoEncontradoException.class)
    public ResponseEntity<ErroPadraoResponseDTO> tratarCandidatoNaoEncontrado(CandidatoNaoEncontradoException ex) {
        ErroPadraoResponseDTO corpo = new ErroPadraoResponseDTO(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(corpo);
    }
}
