package br.com.appbit.appbit.services;

import br.com.appbit.appbit.config.ScoreConfig;
import br.com.appbit.appbit.dtos.medidasDTOs.MetricaDiversidadeDTO;
import br.com.appbit.appbit.dtos.requestDTOs.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.requestDTOs.VagaRequestDTO;
import br.com.appbit.appbit.dtos.responseDTOs.MatchingResponseDTO;
import br.com.appbit.appbit.dtos.utilDTOs.CandidatoMatchDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MatchingService {

    private static final ScoreConfig CONFIG = ScoreConfig.defaults();

    private final CandidatoRepository candidatoRepository;
    private final CandidatoMapper candidatoMapper;

    public MatchingService(CandidatoRepository candidatoRepository, CandidatoMapper candidatoMapper) {
        this.candidatoRepository = candidatoRepository;
        this.candidatoMapper = candidatoMapper;
    }

    @SuppressWarnings("null")
    public MatchingResponseDTO executarMatch(MatchingRequestDTO request) {
        // Busca candidatos ativos no banco
        List<CandidatoEntity> candidatosEntity = candidatoRepository.findByAtivo(true);

        // Converte para DTO usando o mapper
        List<CandidatoMatchDTO> fonte = candidatosEntity.stream()
                .map(candidatoMapper::toMatchDTO)
                .toList();

        // Aplica filtros e calcula score
        List<CandidatoMatchDTO> candidatos = fonte.stream()
                .filter(c -> atendeFiltros(c, request))
                .map(c -> recalcularScore(c, request))
                .sorted(Comparator.comparing(CandidatoMatchDTO::scoreMatch).reversed())
                .limit(limite(request, fonte.size()))
                .toList();

        MetricaDiversidadeDTO metrica = calcularMetricaDiversidade(candidatos, request);

        log.info("Matching executado: {} candidatos na fonte, {} retornados", fonte.size(), candidatos.size());

        return new MatchingResponseDTO(
                "banco_de_dados",
                fonte.size(),
                candidatos.size(),
                "contato_pos_aprovacao omitido na triagem inicial",
                metrica,
                candidatos
        );
    }

    private MetricaDiversidadeDTO calcularMetricaDiversidade(List<CandidatoMatchDTO> candidatos, MatchingRequestDTO request) {
        long comBadge = candidatos.stream()
                .filter(c -> c.badgeDiversidade() != null && !c.badgeDiversidade().isBlank())
                .count();

        double percentual = candidatos.isEmpty() ? 0.0 : (comBadge * 100.0) / candidatos.size();

        Integer meta = request.filtros() != null ? request.filtros().diversidadeMinima() : null;
        boolean atingida = meta != null && percentual >= meta;

        return new MetricaDiversidadeDTO(percentual, meta, atingida);
    }

    // Código novo abaixo

    /**
     * Retorna um novo CandidatoMatchDTO com score_match recalculado.
     */
    private CandidatoMatchDTO recalcularScore(CandidatoMatchDTO candidato, MatchingRequestDTO request) {
        VagaRequestDTO vaga = request != null ? request.vaga() : null;

        List<String> skillsVaga       = vaga != null && vaga.skills() != null ? vaga.skills() : List.of();
        String       modeloPreferido  = vaga != null && vaga.modeloTrabalho() != null ? vaga.modeloTrabalho() : "hibrido";
        int          minExperiencia   = 1;

        double skillScore    = calcularSkillScore(candidato.skills(), skillsVaga);
        double expScore      = calcularExpScore(candidato.anosExperiencia(), minExperiencia);
        double modelScore    = calcularModeloScore(candidato.modeloTrabalhoPreferido(), modeloPreferido);
        double diversidade   = calcularDiversidade(candidato.badgeDiversidade());

        double raw = skillScore    * CONFIG.skillWeight()
                   + expScore      * CONFIG.experienceWeight()
                   + modelScore    * CONFIG.workModelWeight()
                   + diversidade   * CONFIG.diversityBonusWeight();

        int score = (int) Math.round(Math.max(0.0, Math.min(100.0, raw * 100)));

        log.debug("Candidato {}: skill={:.2f} exp={:.2f} modelo={:.2f} div={:.2f} → score={}",
                candidato.candidatoId(), skillScore, expScore, modelScore, diversidade, score);

        // Retorna novo record com score recalculado (records são imutáveis)
        return new CandidatoMatchDTO(
                candidato.candidatoId(),
                candidato.nome(),
                candidato.cargoAlvo(),
                candidato.nivel(),
                candidato.regiao(),
                candidato.clusterResidencia(),
                candidato.cep(),
                candidato.lat(),
                candidato.lon(),
                candidato.modeloTrabalhoPreferido(),
                candidato.skills(),
                candidato.anosExperiencia(),
                candidato.badgeDiversidade(),
                score
        );
    }


    // ──────────────────────────────────────────────────────────────
    // Sub-scores (portados de score_match.py)
    // ──────────────────────────────────────────────────────────────

    /**
     * _skill_match: interseção / total de skills exigidas.
     * Sem skills na vaga → match perfeito (1.0).
     */
    private double calcularSkillScore(List<String> skillsCandidato, List<String> skillsVaga) {
        Set<String> normVaga = normalizar(skillsVaga);
        if (normVaga.isEmpty()) return 1.0;

        Set<String> normCandidato = normalizar(skillsCandidato);
        long intersecao = normCandidato.stream().filter(normVaga::contains).count();
        return Math.min(1.0, (double) intersecao / normVaga.size());
    }

    /**
     * _experience_score: linear de 0 a max_experience_years.
     * Candidato sem experiência → 0. Abaixo do mínimo → proporcional.
     */
    private double calcularExpScore(Integer anosExperiencia, int minExperiencia) {
        int anos = anosExperiencia != null ? anosExperiencia : 0;
        if (anos <= 0) return 0.0;
        int minEfetivo = Math.max(minExperiencia, 1);
        return Math.min(1.0, (double) anos / Math.max(minEfetivo, CONFIG.maxExperienceYears()));
    }

    /**
     * _work_model_score: compatibilidade de modelo de trabalho.
     * hibrido é o mais flexível; conflito remoto/presencial penaliza menos.
     */
    private double calcularModeloScore(String modeloCandidato, String modeloVaga) {
        String c = norm(modeloCandidato);
        String v = norm(modeloVaga);
        if (c.isEmpty() || v.isEmpty())               return 0.5;
        if (c.equals(v))                              return 1.0;
        if (c.equals("hibrido") || v.equals("hibrido")) return 0.85;
        if (c.equals("remoto")     && v.equals("presencial")) return 0.75;
        if (c.equals("presencial") && v.equals("remoto"))     return 0.65;
        return 0.75;
    }

    /**
     * _diversity_score: 1.0 se badge_diversidade preenchido, 0.0 caso contrário.
     */
    private double calcularDiversidade(String badge) {
        return (badge != null && !badge.isBlank()) ? 1.0 : 0.0;
    }
    private boolean atendeFiltros(CandidatoMatchDTO candidato, MatchingRequestDTO request) {
        if (request == null || request.vaga() == null) return true;
        VagaRequestDTO vaga = request.vaga();

        if (preenchido(vaga.nivel()) && !norm(candidato.nivel()).equals(norm(vaga.nivel())))
            return false;

        if (preenchido(vaga.regiao()) && !norm(candidato.regiao()).contains(norm(vaga.regiao())))
            return false;

        List<String> skillsVaga = vaga.skills();
        if (skillsVaga == null || skillsVaga.isEmpty()) return true;

        Set<String> skillsCandidato = normalizar(candidato.skills());
        return skillsVaga.stream().map(this::norm).anyMatch(skillsCandidato::contains);
    }

    private int limite(MatchingRequestDTO request, int total) {
        if (request == null || request.filtros() == null || request.filtros().limiteResultados() == null)
            return total;
        return Math.max(0, Math.min(request.filtros().limiteResultados(), total));
    }

    // ──────────────────────────────────────────────────────────────
    // Utilitários
    // ──────────────────────────────────────────────────────────────

    private Set<String> normalizar(List<String> skills) {
        if (skills == null) return Set.of();
        return skills.stream()
                .filter(s -> s != null && !s.isBlank())
                .map(this::norm)
                .collect(Collectors.toSet());
    }

    private String norm(String valor) {
        if (valor == null) return "";
        return Normalizer.normalize(valor, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    private static boolean preenchido(String valor) {
        return valor != null && !valor.isBlank();
    }
}