package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class CandidatoMockService {

    private static final String CAMINHO_MOCK = "mocks/candidatos_teste.json";
    private final List<CandidatoMatchDTO> candidatos;

    public CandidatoMockService() {
        this.candidatos = carregarCandidatosMock(new ObjectMapper());
    }

    private List<CandidatoMatchDTO> carregarCandidatosMock(ObjectMapper objectMapper) {
        ClassPathResource resource = new ClassPathResource(CAMINHO_MOCK);
        try (InputStream inputStream = resource.getInputStream()) {
            CandidatosPayload payload = objectMapper.readValue(inputStream, CandidatosPayload.class);
            return List.copyOf(payload.candidatos());
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível carregar os candidatos em " + CAMINHO_MOCK, e);
        }
    }

    public List<CandidatoMatchDTO> listarAnonimizados() {
        return candidatos;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record CandidatosPayload(List<CandidatoMatchDTO> candidatos) {
    }
}
