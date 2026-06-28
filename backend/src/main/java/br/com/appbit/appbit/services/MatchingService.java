package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import br.com.appbit.appbit.dtos.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.MatchingResponseDTO;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchingService {

        private final CandidatoMockService candidatoMockService;

        public MatchingService(CandidatoMockService candidatoMockService) {
                this.candidatoMockService = candidatoMockService;
        }

        public MatchingResponseDTO executarMatch(MatchingRequestDTO request) {
                List<CandidatoMatchDTO> fonte = candidatoMockService.listarAnonimizados();
                @SuppressWarnings("null")
                List<CandidatoMatchDTO> candidatos = fonte.stream()
                                .filter(candidato -> atendeFiltros(candidato, request))
                                .sorted(Comparator.comparing(CandidatoMatchDTO::scoreMatch).reversed())
                                .limit(limite(request, fonte.size()))
                                .toList();

                return new MatchingResponseDTO(
                                "mocks/candidatos_teste.json",
                                fonte.size(),
                                candidatos.size(),
                                "contato_pos_aprovacao omitido na triagem inicial",
                                candidatos);
        }

        private boolean atendeFiltros(CandidatoMatchDTO candidato, MatchingRequestDTO request) {
                if (request == null || request.vaga() == null) {
                        return true;
                }
                if (preenchido(request.vaga().nivel())
                                && !normalizar(candidato.nivel()).equals(normalizar(request.vaga().nivel()))) {
                        return false;
                }
                if (preenchido(request.vaga().regiao())
                                && !normalizar(candidato.regiao()).contains(normalizar(request.vaga().regiao()))) {
                        return false;
                }
                List<String> skillsVaga = request.vaga().skills();
                if (skillsVaga == null || skillsVaga.isEmpty()) {
                        return true;
                }
                Set<String> skillsCandidato = candidato.skills().stream()
                                .map(MatchingService::normalizar)
                                .collect(Collectors.toSet());
                return skillsVaga.stream().map(MatchingService::normalizar).anyMatch(skillsCandidato::contains);
        }

        private int limite(MatchingRequestDTO request, int total) {
                if (request == null || request.filtros() == null || request.filtros().limiteResultados() == null) {
                        return total;
                }
                return Math.max(0, Math.min(request.filtros().limiteResultados(), total));
        }

        private static boolean preenchido(String valor) {
                return valor != null && !valor.isBlank();
        }

        private static String normalizar(String valor) {
                if (valor == null) {
                        return "";
                }
                return Normalizer.normalize(valor, Normalizer.Form.NFD)
                                .replaceAll("\\p{M}", "")
                                .trim()
                                .toLowerCase(Locale.ROOT);
        }
}
