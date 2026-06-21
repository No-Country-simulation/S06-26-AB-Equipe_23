package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.CandidatoMatchDTO;
import br.com.appbit.appbit.dtos.MetricaDiversidadeDTO;
import br.com.appbit.appbit.dtos.request.MatchingRequestDTO;
import br.com.appbit.appbit.dtos.response.MatchingResponseDTO;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MatchingService {

        public MatchingResponseDTO executarMatch(MatchingRequestDTO request) {

            MetricaDiversidadeDTO metrica =
                    new MetricaDiversidadeDTO(
                            66.7,
                            40,
                            true
                    );

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
                            91,
                            List.of(
                                    "sql",
                                    "python",
                                    "power bi",
                                    "excel"
                            ),
                            "Mulher negra em tecnologia",
                            "Alta aderencia nas skills principais e residencia em regiao compativel com a vaga."
                    )
            );

            candidatos.add(
                    new CandidatoMatchDTO(
                            "cand_002",
                            "Candidato 2",
                            "anonimizado",
                            "Analista de Dados Junior",
                            "junior",
                            "Sao Jose",
                            "SAO_JOSE_KOBRASOL",
                            86,
                            List.of(
                                    "sql",
                                    "python",
                                    "excel"
                            ),
                            "Talento de regiao com menor acesso",
                            "Boa aderencia tecnica, nivel compativel e localizacao proxima ao polo da vaga."
                    )
            );

            return new MatchingResponseDTO(
                    "job_001",
                    120,
                    2,
                    metrica,
                    candidatos
            );
        }
    }

