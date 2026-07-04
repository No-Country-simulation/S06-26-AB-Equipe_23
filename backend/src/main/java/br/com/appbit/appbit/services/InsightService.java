package br.com.appbit.appbit.services;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.appbit.appbit.dtos.responseDTOs.InsightResponseDTO;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
public class InsightService {

        private static final String CAMINHO_MOCK = "/mocks/insights_regioes.json";

        private final InsightResponseDTO insights;

        public InsightService() {
                this.insights = carregarRegioesMock(new ObjectMapper());
        }

        public InsightService(ObjectMapper objectMapper) {
                this.insights = carregarRegioesMock(objectMapper);
        }

        private InsightResponseDTO carregarRegioesMock(ObjectMapper objectMapper) {
                ClassPathResource resource = new ClassPathResource(CAMINHO_MOCK);
                try (InputStream inputStream = resource.getInputStream()) {
                        return objectMapper.readValue(inputStream, InsightResponseDTO.class);
                } catch (IOException e) {
                        throw new IllegalStateException(
                                        "Não foi possível carregar o mock de regiões em " + CAMINHO_MOCK, e);
                }
        }

        public InsightResponseDTO obterInsights() {
                return insights;
        }
}
