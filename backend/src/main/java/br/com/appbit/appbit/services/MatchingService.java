package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import br.com.appbit.appbit.dtos.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.MatchingResponseDTO;
import br.com.appbit.appbit.dtos.MetricaDiversidadeDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MatchingService {

        public MatchingResponseDTO executarMatch(MatchingRequestDTO request) {

                MetricaDiversidadeDTO metrica = new MetricaDiversidadeDTO(
                                66.7,
                                40,
                                true);

                List<CandidatoMatchDTO> candidatos = new ArrayList<>();

                candidatos.add(
                                new CandidatoMatchDTO(
                                                "cand_001",
                                                "Candidato 1",
                                                "anonimizado",
                                                "Analista de Dados Junior",
                                                "junior",
                                                "Florianopolis",
                                                "TRINDADE",
                                                BigDecimal.valueOf(91),
                                                List.of(
                                                                "sql",
                                                                "python",
                                                                "power bi",
                                                                "excel"),
                                                "Mulher negra em tecnologia",
                                                "Alta aderencia nas skills principais e residencia em regiao compativel com a vaga."));

                candidatos.add(
                                new CandidatoMatchDTO(
                                                "cand_002",
                                                "Candidato 2",
                                                "anonimizado",
                                                "Analista de Dados Junior",
                                                "junior",
                                                "Sao Jose",
                                                "SAO_JOSE_KOBRASOL",
                                                BigDecimal.valueOf(86), /* */
                                                List.of(
                                                                "sql",
                                                                "python",
                                                                "excel"),
                                                "Talento de regiao com menor acesso",
                                                "Boa aderencia tecnica, nivel compativel e localizacao proxima ao polo da vaga."));
                /*
                 * package br.com.appbit.appbit.dtos;
                 * 
                 * import java.math.BigDecimal;
                 * import java.util.List;
                 * 
                 * public record CandidatoMatchDTO(
                 * Integer candidatoId,
                 * 
                 * String apelidoExibicao,
                 * 
                 * String statusIdentificacao,
                 * 
                 * String cargoAlvo,
                 * 
                 * String nivel,
                 * 
                 * String regiao,
                 * 
                 * String clusterResidencia,
                 * 
                 * BigDecimal scoreMatch,
                 * 
                 * List<String> skills,
                 * 
                 * String badgeDiversidade,
                 * 
                 * String explicacao
                 * 
                 * ) {
                 * 
                 * }
                 */
                return new MatchingResponseDTO(
                                "job_001",
                                120,
                                2,
                                metrica,
                                candidatos);
        }
}
