package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.AlertaEsgDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.MentorDiversidadeEntity;
import br.com.appbit.appbit.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EsgInsightServiceTest {

    @Mock
    private ConcentracaoRepository concentracaoRepository;
    @Mock
    private CandidatoRepository candidatoRepository;
    @Mock
    private VagaRepository vagaRepository;
    @Mock
    private TrilhaFormacaoRepository trilhaFormacaoRepository;
    @Mock
    private MentorDiversidadeRepository mentorDiversidadeRepository;

    private EsgInsightService esgInsightService;

    @BeforeEach
    void setUp() {
        esgInsightService = new EsgInsightService(
            concentracaoRepository,
            candidatoRepository,
            vagaRepository,
            trilhaFormacaoRepository,
            mentorDiversidadeRepository
        );
    }

    @Test
    void shouldGenerateConnectivityAlertWhenSignalIsWeakAndCandidatesExist() {
        // Setup stats for a weak signal cluster
        Object[] clusterStats = new Object[]{"Cluster Sul", 0.08, 0.02}; // 8% congestion, 2% packet drop
        java.util.List<Object[]> statsList = new java.util.ArrayList<>();
        statsList.add(clusterStats);
        when(concentracaoRepository.findStatsByCluster()).thenReturn(statsList);

        // Candidates exist in this cluster
        CandidatoEntity candidato = new CandidatoEntity();
        candidato.setCluster("Cluster Sul");
        when(candidatoRepository.findByCluster("Cluster Sul")).thenReturn(List.of(candidato));

        // Stub other repositories
        when(vagaRepository.count()).thenReturn(0L);
        when(trilhaFormacaoRepository.count()).thenReturn(0L);
        when(candidatoRepository.findWithDiversidadeBadge()).thenReturn(Collections.emptyList());
        when(mentorDiversidadeRepository.findAll()).thenReturn(Collections.emptyList());

        // Execute
        List<AlertaEsgDTO> alertas = esgInsightService.obterAlertasEsg();

        // Verify
        assertFalse(alertas.isEmpty());
        AlertaEsgDTO alerta = alertas.get(0);
        assertTrue(alerta.titulo().contains("Vulnerabilidade de Conectividade"));
        assertEquals("DANGER", alerta.gravidade());
        assertEquals("Cluster Sul", alerta.regiao());
    }

    @Test
    void shouldGenerateMentorDéficitAlertWhenDiversityCandidatesExistWithoutMentors() {
        // Setup empty stats
        when(concentracaoRepository.findStatsByCluster()).thenReturn(Collections.emptyList());

        // Candidates exist with diversity badge
        CandidatoEntity candidate = new CandidatoEntity();
        candidate.setCluster("Cluster Norte");
        candidate.setDiversidade("Perfil junior em formacao");
        when(candidatoRepository.findWithDiversidadeBadge()).thenReturn(List.of(candidate));

        // Mentors list has one mentor, but no technical career specialty
        MentorDiversidadeEntity mentor = new MentorDiversidadeEntity();
        mentor.setEspecialidadeEsg("Acessibilidade");
        when(mentorDiversidadeRepository.findAll()).thenReturn(List.of(mentor));

        // Stub other repositories
        when(vagaRepository.count()).thenReturn(0L);
        when(trilhaFormacaoRepository.count()).thenReturn(0L);

        // Execute
        List<AlertaEsgDTO> alertas = esgInsightService.obterAlertasEsg();

        // Verify
        assertFalse(alertas.isEmpty());
        AlertaEsgDTO alerta = alertas.get(0);
        assertTrue(alerta.titulo().contains("Mentoria de Carreira Técnica"));
        assertEquals("INFO", alerta.gravidade());
        assertEquals("Geral", alerta.regiao());
    }
}
