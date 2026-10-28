package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.FeedbackCandidatoEntity;
import br.com.appbit.appbit.repositories.FeedbackCandidatoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AprovacaoFeedbackServiceTest {

    @Mock
    private FeedbackCandidatoRepository feedbackRepository;

    private AprovacaoService aprovacaoService;

    @BeforeEach
    void setUp() {
        aprovacaoService = new AprovacaoService(feedbackRepository);
    }

    @Test
    @DisplayName("Deve aprovar candidato com anotações internas e persistir decisão no banco")
    void deveAprovarCandidatoComAnotacoes() {
        AprovacaoRequestDTO request = new AprovacaoRequestDTO(
                "cand_001",
                "emp_001",
                1,
                "Excelente perfil técnico e boa comunicação."
        );

        ContatoAprovadoDTO contato = aprovacaoService.aprovarCandidato(request);

        assertNotNull(contato);
        assertEquals("cand_001", contato.candidatoId());
        assertEquals("Candidato 1", contato.apelidoExibicao());
        assertNotNull(contato.contatoLiberado());
        assertEquals("Ana Souza", contato.contatoLiberado().nome());

        ArgumentCaptor<FeedbackCandidatoEntity> captor = ArgumentCaptor.forClass(FeedbackCandidatoEntity.class);
        verify(feedbackRepository, times(1)).save(captor.capture());

        FeedbackCandidatoEntity saved = captor.getValue();
        assertEquals("emp_001", saved.getEmpresaId());
        assertEquals("cand_001", saved.getCandidatoId());
        assertEquals(1, saved.getVagaId());
        assertEquals("APROVADO", saved.getDecisao());
        assertEquals("Excelente perfil técnico e boa comunicação.", saved.getAnotacoesInternas());
        assertNull(saved.getMotivoRejeicao());
    }

    @Test
    @DisplayName("Deve lançar erro ao tentar aprovar candidato inexistente")
    void deveLancarErroParaCandidatoInexistente() {
        AprovacaoRequestDTO request = new AprovacaoRequestDTO(
                "cand_999_fantasma",
                "emp_001",
                null,
                null
        );

        assertThrows(ResponseStatusException.class, () -> aprovacaoService.aprovarCandidato(request));
        verify(feedbackRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve reprovar candidato registrando motivo e anotações")
    void deveReprovarCandidatoComMotivo() {
        ReprovacaoRequestDTO request = new ReprovacaoRequestDTO(
                "cand_002",
                "emp_001",
                1,
                "FIT_TECNICO",
                "Necessita de mais experiência prática com Power BI avançado."
        );

        when(feedbackRepository.save(any(FeedbackCandidatoEntity.class))).thenAnswer(invocation -> {
            FeedbackCandidatoEntity entity = invocation.getArgument(0);
            entity.setId(10L);
            entity.setCriadoEm(LocalDateTime.now());
            return entity;
        });

        ReprovacaoResponseDTO response = aprovacaoService.reprovarCandidato(request);

        assertNotNull(response);
        assertEquals("REPROVADO", response.status());
        assertEquals("cand_002", response.candidatoId());
        assertEquals("FIT_TECNICO", response.motivo());
        assertEquals("Necessita de mais experiência prática com Power BI avançado.", response.anotacoes());

        ArgumentCaptor<FeedbackCandidatoEntity> captor = ArgumentCaptor.forClass(FeedbackCandidatoEntity.class);
        verify(feedbackRepository, times(1)).save(captor.capture());

        FeedbackCandidatoEntity saved = captor.getValue();
        assertEquals("emp_001", saved.getEmpresaId());
        assertEquals(1, saved.getVagaId());
        assertEquals("cand_002", saved.getCandidatoId());
        assertEquals("REPROVADO", saved.getDecisao());
        assertEquals("FIT_TECNICO", saved.getMotivoRejeicao());
        assertEquals("Necessita de mais experiência prática com Power BI avançado.", saved.getAnotacoesInternas());
    }

    @Test
    @DisplayName("Deve listar histórico de feedbacks da vaga")
    void deveListarFeedbacksPorVaga() {
        FeedbackCandidatoEntity f1 = FeedbackCandidatoEntity.builder()
                .id(1L)
                .empresaId("emp_001")
                .vagaId(1)
                .candidatoId("cand_001")
                .decisao("APROVADO")
                .anotacoesInternas("Ótimo fit")
                .criadoEm(LocalDateTime.now())
                .build();

        FeedbackCandidatoEntity f2 = FeedbackCandidatoEntity.builder()
                .id(2L)
                .empresaId("emp_001")
                .vagaId(1)
                .candidatoId("cand_002")
                .decisao("REPROVADO")
                .motivoRejeicao("SALARIO")
                .anotacoesInternas("Pretensão acima do teto")
                .criadoEm(LocalDateTime.now())
                .build();

        when(feedbackRepository.findByEmpresaIdAndVagaId("emp_001", 1)).thenReturn(List.of(f1, f2));

        List<FeedbackResumoDTO> feedbacks = aprovacaoService.listarFeedbacksPorVaga("emp_001", 1);

        assertEquals(2, feedbacks.size());
        assertEquals("APROVADO", feedbacks.get(0).decisao());
        assertEquals("REPROVADO", feedbacks.get(1).decisao());
        assertEquals("SALARIO", feedbacks.get(1).motivoRejeicao());
    }
}
