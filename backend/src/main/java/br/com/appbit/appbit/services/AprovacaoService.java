package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.requestDTOs.AprovacaoRequestDTO;
import br.com.appbit.appbit.dtos.utilDTOs.CandidatoCompletoDTO;
import br.com.appbit.appbit.dtos.utilDTOs.ContatoAprovadoDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class AprovacaoService {

    private static final String CAMINHO_JSON = "mocks/candidatos_teste.json";

    private final List<CandidatoCompletoDTO> candidatosCompletos;

    public AprovacaoService() {
        this.candidatosCompletos = carregarCandidatos(new ObjectMapper());
    }

    public ContatoAprovadoDTO aprovarCandidato(AprovacaoRequestDTO request) {
        CandidatoCompletoDTO candidato = candidatosCompletos.stream()
                .filter(c -> c.candidatoId().equals(request.candidatoId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Candidato não encontrado: " + request.candidatoId()
                ));

        if (candidato.contatoPosAprovacao() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dados de contato indisponíveis para: " + request.candidatoId()
            );
        }

        return new ContatoAprovadoDTO(
                candidato.candidatoId(),
                candidato.apelidoExibicao(),
                candidato.contatoPosAprovacao()
        );
    }

    private List<CandidatoCompletoDTO> carregarCandidatos(ObjectMapper mapper) {
        ClassPathResource resource = new ClassPathResource(CAMINHO_JSON);
        try (InputStream in = resource.getInputStream()) {
            Payload payload = mapper.readValue(in, Payload.class);
            return List.copyOf(payload.candidatos());
        } catch (IOException e) {
            throw new IllegalStateException(
                    "Não foi possível carregar candidatos de " + CAMINHO_JSON, e
            );
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Payload(List<CandidatoCompletoDTO> candidatos) {
    }
}
