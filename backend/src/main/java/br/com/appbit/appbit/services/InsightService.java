package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.InsightResponseDTO;
import br.com.appbit.appbit.dtos.RegiaoInsightDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InsightService {

    public InsightResponseDTO buscarInsights(){
        List<RegiaoInsightDTO> regioes = new ArrayList<>();

        regioes.add(
                new RegiaoInsightDTO(
                        "TRINDADE",
                        "Florianopolis",
                        -27.6011,
                        -48.5320,
                        18420,
                        "TARDE",
                        "Residencial universitario",
                        "alta",
                        "regiao com potencial para talentos junior e perfis universitarios"
                )
        );

        regioes.add(
                new RegiaoInsightDTO(
                        "CBD_BEIRAMAR",
                        "Florianopolis",
                        -27.5954,
                        -48.5480,
                        22080,
                        "TARDE",
                        "Centro corporativo",
                        "alta",
                        "regiao com maior concentracao para vagas corporativas e hibridas"
                )
        );

        return new InsightResponseDTO(
                "Visent CDRView - dataset sintetico App BiT",
                regioes
        );
    }
}

