package br.com.appbit.appbit.exception;

public class CandidatoNaoEncontradoException extends RuntimeException {

    public CandidatoNaoEncontradoException(String candidatoId) {
        super("Candidato não encontrado para o id: " + candidatoId);
    }
}
