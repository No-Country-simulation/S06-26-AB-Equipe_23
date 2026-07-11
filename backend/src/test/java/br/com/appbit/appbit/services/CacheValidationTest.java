package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.MatchingResponseDTO;
import br.com.appbit.appbit.dtos.VagaRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
class CacheValidationTest {

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private CacheManager cacheManager;

    @Test
    void matchingServiceExecutarMatchShouldStoreResultInCache() {
        VagaRequestDTO vaga = new VagaRequestDTO("Analista de Dados Júnior", List.of("sql", "python"), "junior", "Florianópolis", "hibrido");
        MatchingRequestDTO request = new MatchingRequestDTO("emp_001", vaga, null);

        MatchingResponseDTO firstResponse = matchingService.executarMatch(request);
        assertNotNull(firstResponse);

        Cache matchingCache = cacheManager.getCache("matching");
        assertNotNull(matchingCache);

        Cache.ValueWrapper cachedValue = matchingCache.get(request);
        assertNotNull(cachedValue);

        MatchingResponseDTO cachedResponse = (MatchingResponseDTO) cachedValue.get();
        assertNotNull(cachedResponse);
    }
}
