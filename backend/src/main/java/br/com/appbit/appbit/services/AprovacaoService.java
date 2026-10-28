package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.FeedbackCandidatoEntity;
import br.com.appbit.appbit.repositories.FeedbackCandidatoRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@Transactional
public class AprovacaoService {

    private static final String CAMINHO_JSON = "mocks/candidatos_teste.json";

    private final List<CandidatoCompletoDTO> candidatosCompletos;
    private final FeedbackCandidatoRepository feedbackRepository;

    public AprovacaoService() {
        this(null);
    }

    @Autowired
    public AprovacaoService(FeedbackCandidatoRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
        this.candidatosCompletos = carregarCandidatos(new ObjectMapper());
    }

    public ContatoAprovadoDTO aprovarCandidato(AprovacaoRequestDTO request) {
        log.info("Aprovando candidato ID: {} pela empresa ID: {}", request.candidatoId(), request.empresaId());

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

        if (feedbackRepository != null) {
            FeedbackCandidatoEntity feedback = FeedbackCandidatoEntity.builder()
                    .empresaId(request.empresaId())
                    .vagaId(request.vagaId())
                    .candidatoId(request.candidatoId())
                    .decisao("APROVADO")
                    .anotacoesInternas(request.anotacoes())
                    .build();
            feedbackRepository.save(feedback);
            log.info("Decisão de aprovação registrada no banco com sucesso para o candidato {}", request.candidatoId());
        }

        return new ContatoAprovadoDTO(
                candidato.candidatoId(),
                candidato.apelidoExibicao(),
                candidato.contatoPosAprovacao()
        );
    }

    public ReprovacaoResponseDTO reprovarCandidato(ReprovacaoRequestDTO request) {
        log.info("Registrando reprovação do candidato ID: {} com motivo: {}", request.candidatoId(), request.motivo());

        FeedbackCandidatoEntity feedback = FeedbackCandidatoEntity.builder()
                .empresaId(request.empresaId())
                .vagaId(request.vagaId())
                .candidatoId(request.candidatoId())
                .decisao("REPROVADO")
                .motivoRejeicao(request.motivo())
                .anotacoesInternas(request.anotacoes())
                .build();

        if (feedbackRepository != null) {
            feedback = feedbackRepository.save(feedback);
            log.info("Decisão de reprovação registrada no banco com sucesso. ID: {}", feedback.getId());
        }

        return new ReprovacaoResponseDTO(
                "REPROVADO",
                request.candidatoId(),
                request.motivo(),
                request.anotacoes(),
                feedback.getCriadoEm() != null ? feedback.getCriadoEm() : LocalDateTime.now()
        );
    }

    @Transactional(readOnly = true)
    public List<FeedbackResumoDTO> listarFeedbacksPorVaga(String empresaId, Integer vagaId) {
        if (feedbackRepository == null) return List.of();

        List<FeedbackCandidatoEntity> list = (vagaId != null)
                ? feedbackRepository.findByEmpresaIdAndVagaId(empresaId, vagaId)
                : feedbackRepository.findByEmpresaId(empresaId);

        return list.stream()
                .map(f -> new FeedbackResumoDTO(
                        f.getId(),
                        f.getEmpresaId(),
                        f.getVagaId(),
                        f.getCandidatoId(),
                        f.getDecisao(),
                        f.getMotivoRejeicao(),
                        f.getAnotacoesInternas(),
                        f.getCriadoEm()
                ))
                .toList();
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

