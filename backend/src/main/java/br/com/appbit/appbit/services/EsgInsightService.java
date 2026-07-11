package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.AlertaEsgDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.MentorDiversidadeEntity;
import br.com.appbit.appbit.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EsgInsightService {

    private final ConcentracaoRepository concentracaoRepository;
    private final CandidatoRepository candidatoRepository;
    private final VagaRepository vagaRepository;
    private final TrilhaFormacaoRepository trilhaFormacaoRepository;
    private final MentorDiversidadeRepository mentorDiversidadeRepository;

    @org.springframework.cache.annotation.Cacheable(value = "esgInsights")
    public List<AlertaEsgDTO> obterAlertasEsg() {
        List<AlertaEsgDTO> alertas = new ArrayList<>();

        // 1. Regra de Conectividade e Sinal Vulnerável (Sinal vs Residência dos Candidatos)
        List<Object[]> stats = concentracaoRepository.findStatsByCluster();
        for (Object[] row : stats) {
            String cluster = (String) row[0];
            Double avgCongestion = (Double) row[1];
            Double avgDrop = (Double) row[2];

            if (cluster != null && !cluster.isBlank()) {
                boolean hasHighCongestion = avgCongestion != null && avgCongestion > 0.04; // > 4%
                boolean hasHighDrop = avgDrop != null && avgDrop > 0.015; // > 1.5%

                if (hasHighCongestion || hasHighDrop) {
                    List<CandidatoEntity> candidatosNoCluster = candidatoRepository.findByCluster(cluster);
                    if (!candidatosNoCluster.isEmpty()) {
                        double congestionPercent = avgCongestion != null ? avgCongestion * 100 : 0.0;
                        String gravidade = (congestionPercent > 7.0) ? "DANGER" : "WARNING";

                        alertas.add(new AlertaEsgDTO(
                            "Vulnerabilidade de Conectividade em " + cluster,
                            String.format("A região apresenta congestionamento médio de sinal de %.1f%%. Há %d candidatos locais cadastrados que podem enfrentar dificuldades para trabalho remoto ou estudos online.", 
                                          congestionPercent, candidatosNoCluster.size()),
                            gravidade,
                            cluster,
                            "Fornecer auxílio-conectividade (dados móveis/roteadores) ou adotar regime de trabalho presencial/híbrido com suporte de infraestrutura para estes talentos."
                        ));
                    }
                }
            }
        }

        // 2. Regra de Capacitação Regional (Vagas vs Trilhas de Capacitação)
        long totalVagas = vagaRepository.count();
        long totalTrilhas = trilhaFormacaoRepository.count();

        if (totalVagas > 5 && totalTrilhas < 10) {
            alertas.add(new AlertaEsgDTO(
                "Oportunidade de Impacto Social via Capacitação",
                String.format("Há %d vagas de emprego ativas, mas apenas %d trilhas de capacitação abertas. Aumentar a oferta de cursos impulsiona a inserção de minorias no mercado.", 
                              totalVagas, totalTrilhas),
                "INFO",
                "Todas as Regiões",
                "Patrocinar novas Trilhas de Formação ou Hackathons voltados a habilidades demandadas (Java, Frontend) focando em bairros periféricos."
            ));
        }

        // 3. Regra de Especialidade de Mentores (Candidatos Juniores/Ensino Superior vs Mentores)
        List<CandidatoEntity> candidatosDiversos = candidatoRepository.findWithDiversidadeBadge();
        List<MentorDiversidadeEntity> mentores = mentorDiversidadeRepository.findAll();

        if (!candidatosDiversos.isEmpty() && !mentores.isEmpty()) {
            // Conta candidatos júnior ou primeira geração
            long candidatosJuniorOuFormacao = candidatosDiversos.stream()
                .filter(c -> c.getDiversidade() != null && 
                             (c.getDiversidade().toLowerCase().contains("junior") || 
                              c.getDiversidade().toLowerCase().contains("ensino superior") ||
                              c.getDiversidade().toLowerCase().contains("formacao")))
                .count();

            // Verifica se há mentores especializados em aceleração técnica ou carreira júnior
            boolean temMentorCarreiraTecnica = mentores.stream()
                .anyMatch(m -> m.getEspecialidadeEsg() != null && 
                               (m.getEspecialidadeEsg().toLowerCase().contains("carreira") || 
                                m.getEspecialidadeEsg().toLowerCase().contains("networking") ||
                                m.getEspecialidadeEsg().toLowerCase().contains("talentos")));

            if (candidatosJuniorOuFormacao > 0 && !temMentorCarreiraTecnica) {
                alertas.add(new AlertaEsgDTO(
                    "Demanda por Mentoria de Carreira Técnica",
                    String.format("Há %d candidatos identificados como talentos em formação técnica ou primeira geração no ensino superior, mas nenhum mentor especializado em aceleração técnica de carreira júnior está cadastrado.", 
                                  candidatosJuniorOuFormacao),
                    "INFO",
                    "Geral",
                    "Recrutar profissionais seniores de engenharia de software para atuarem como mentores voluntários e apoiarem a transição de carreira e inserção destes candidatos."
                ));
            }
        }

        return alertas;
    }
}
