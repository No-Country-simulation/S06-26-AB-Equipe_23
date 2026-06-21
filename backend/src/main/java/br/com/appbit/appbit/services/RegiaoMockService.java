package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.response.RegiaoInsightDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class RegiaoMockService {

    private static final String CAMINHO_MOCK = "mocks/insights_regioes.json";

    private final List<RegiaoInsightDTO> regioes;

    public RegiaoMockService(ObjectMapper objectMapper) {
        this.regioes = carregarRegioesMock(objectMapper);
    }

    private List<RegiaoInsightDTO> carregarRegioesMock(ObjectMapper objectMapper) {
        ClassPathResource resource = new ClassPathResource(CAMINHO_MOCK);
        try (InputStream inputStream = resource.getInputStream()) {
            return objectMapper.readValue(inputStream, new TypeReference<List<RegiaoInsightDTO>>() {
            });
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível carregar o mock de regiões em " + CAMINHO_MOCK, e);
        }
    }

    public List<RegiaoInsightDTO> listarTodas() {
        return regioes;
    }
}
