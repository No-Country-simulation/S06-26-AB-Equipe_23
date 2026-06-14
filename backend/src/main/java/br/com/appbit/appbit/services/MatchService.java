package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.MatchEntity;
import br.com.appbit.appbit.entities.VagaEntity;
import br.com.appbit.appbit.mappers.MatchMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import br.com.appbit.appbit.repositories.MatchRepository;
import br.com.appbit.appbit.repositories.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;

    private final CandidatoRepository candidatoRepository;

    private final VagaRepository vagaRepository;

    private final MatchMapper matchMapper;

    public MatchResponseDTO createMatch(MatchCreateDTO createDTO){


        CandidatoEntity candidato = candidatoRepository.findById(createDTO.candidatoId()).orElse(null);
        VagaEntity vaga = vagaRepository.findById(createDTO.vagaId()).orElse(null);

        if (candidato == null
        ){
            throw new RuntimeException("Candidato não encontrada");
        }if (vaga == null
        ){
            throw new RuntimeException("Vaga não encontrada");
        }

        MatchEntity match = matchMapper.toEntity(createDTO);

        match.setCandidato(candidato);
        match.setVaga(vaga);

        MatchEntity matchSave = matchRepository.save(match);

        return matchMapper.toResponseDTO(matchSave);
    }

    public List<MatchResponseDTO> listAllMatch(){
        List<MatchEntity> matchList = matchRepository.findAll();
        List<MatchResponseDTO> matchResponseDTOS = new ArrayList<>();

        for (MatchEntity match : matchList) {

            MatchResponseDTO responseDTO= matchMapper.toResponseDTO(match);

            matchResponseDTOS.add(responseDTO);
        }
        return matchResponseDTOS;
    }

    public MatchResponseDTO getMatchById(Long matchId){

        MatchEntity match = matchRepository.findById(matchId).orElse(null);

        if (match == null){
            throw  new RuntimeException("Match não encontrado");
        }

        MatchResponseDTO responseDTO = matchMapper.toResponseDTO(match);

        return responseDTO;
    }

    public MatchResponseDTO updateMatchById(MatchUpdateDTO updateDTO, Long matchId){

        MatchEntity match = matchRepository.findById(matchId).orElse(null);

        if (match == null){
            throw  new RuntimeException("Match não encontrado");
        }

        CandidatoEntity candidato = candidatoRepository.findById(updateDTO.candidatoId()).orElse(null);
        VagaEntity vaga = vagaRepository.findById(updateDTO.vagaId()).orElse(null);

        if (candidato == null
        ){
            throw new RuntimeException("Candidato não encontrado");
        }if (vaga == null
        ){
            throw new RuntimeException("Vaga não encontrada");
        }


        match.setScoreMatch(updateDTO.scoreMatch());
        match.setScoreSkills(updateDTO.scoreSkills());
        match.setScoreNivel(updateDTO.scoreNivel());
        match.setScoreRegiao(updateDTO.scoreRegiao());
        match.setScoreDiversidade(updateDTO.scoreDiversidade());
        match.setBadgeDiversidade(updateDTO.badgeDiversidade());
        match.setJustificativa(updateDTO.justificativa());
        match.setVaga(vaga);
        match.setCandidato(candidato);

        MatchEntity matchAtualizado =   matchRepository.save(match);

        return matchMapper.toResponseDTO(matchAtualizado);
    }

    public void deleteMatchById( Long matchId ){

        MatchEntity match = matchRepository.findById(matchId).orElse(null);

        if (match == null){

            throw  new RuntimeException("Match não encontrado");
        }

        matchRepository.delete(match);
    }
}
