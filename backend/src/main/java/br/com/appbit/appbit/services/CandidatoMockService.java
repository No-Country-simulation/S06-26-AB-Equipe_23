package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.response.CandidatoCompletoDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Service
public class CandidatoMockService {

    private static final String CAMINHO_MOCK = "mocks/candidatos_teste.json";

    private final List<CandidatoCompletoDTO> candidatos;

    public CandidatoMockService(ObjectMapper objectMapper) {
        this.candidatos = carregarCandidatosMock(objectMapper);
    }

    private List<CandidatoCompletoDTO> carregarCandidatosMock(ObjectMapper objectMapper) {
        ClassPathResource resource = new ClassPathResource(CAMINHO_MOCK);
        try (InputStream inputStream = resource.getInputStream()) {
            return objectMapper.readValue(inputStream, new TypeReference<List<CandidatoCompletoDTO>>() {
            });
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível carregar o mock de candidatos em " + CAMINHO_MOCK, e);
        }
    }

    public List<CandidatoCompletoDTO> listarTodosCompletos() {
        return candidatos;
    }

    public Optional<CandidatoCompletoDTO> buscarPorId(String candidatoId) {
        return candidatos.stream()
                .filter(candidato -> candidato.candidatoId().equals(candidatoId))
                .findFirst();
    }
}
