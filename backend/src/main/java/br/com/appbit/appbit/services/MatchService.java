package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.MatchEntity;
import br.com.appbit.appbit.entities.VagaEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.MatchMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import br.com.appbit.appbit.repositories.MatchRepository;
import br.com.appbit.appbit.repositories.VagaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MatchService {

    private final MatchRepository matchRepository;
    private final CandidatoRepository candidatoRepository;
    private final VagaRepository vagaRepository;
    private final MatchMapper matchMapper;

    public MatchResponseDTO createMatch(MatchCreateDTO createDTO) {
        log.info("Criando novo match: Vaga ID: {}, Candidato ID: {}", createDTO.vagaId(), createDTO.candidatoId());

        VagaEntity vaga = vagaRepository.findById(createDTO.vagaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + createDTO.vagaId()));

        CandidatoEntity candidato = candidatoRepository.findById(createDTO.candidatoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidato não encontrado com ID: " + createDTO.candidatoId()));

        MatchEntity match = matchMapper.toEntity(createDTO);
        match.setVaga(vaga);
        match.setCandidato(candidato);

        MatchEntity matchSave = matchRepository.save(match);
        log.info("Match criado com sucesso. ID: {}", matchSave.getId());

        return matchMapper.toResponseDTO(matchSave);
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> listAllMatch() {
        log.info("Listando todos os matches");
        return matchRepository.findAll()
                .stream()
                .map(matchMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatchResponseDTO getMatchById(Long matchId) {
        log.info("Buscando match por ID: {}", matchId);
        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match não encontrado com ID: " + matchId));

        return matchMapper.toResponseDTO(match);
    }

    public MatchResponseDTO updateMatchById(MatchUpdateDTO updateDTO, Long matchId) {
        log.info("Atualizando match com ID: {}", matchId);

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match não encontrado com ID: " + matchId));

        VagaEntity vaga = vagaRepository.findById(updateDTO.vagaId())
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + updateDTO.vagaId()));

        CandidatoEntity candidato = candidatoRepository.findById(updateDTO.candidatoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Candidato não encontrado com ID: " + updateDTO.candidatoId()));

        match.setScoreMatch(updateDTO.scoreMatch());
        match.setScoreSkills(updateDTO.scoreSkills());
        match.setScoreNivel(updateDTO.scoreNivel());
        match.setScoreRegiao(updateDTO.scoreRegiao());
        match.setScoreDiversidade(updateDTO.scoreDiversidade());
        match.setBadgeDiversidade(updateDTO.badgeDiversidade());
        match.setJustificativa(updateDTO.justificativa());
        match.setVaga(vaga);
        match.setCandidato(candidato);

        MatchEntity matchAtualizado = matchRepository.save(match);
        log.info("Match atualizado com sucesso. ID: {}", matchId);

        return matchMapper.toResponseDTO(matchAtualizado);
    }

    public void deleteMatchById(Long matchId) {
        log.info("Deletando match com ID: {}", matchId);

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match não encontrado com ID: " + matchId));

        matchRepository.delete(match);
        log.info("Match deletado com sucesso. ID: {}", matchId);
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> findTopMatchesByVaga(Integer vagaId) {
        log.info("Buscando top matches para vaga ID: {}", vagaId);
        return matchRepository.findTopMatchesByVaga(vagaId)
                .stream()
                .map(matchMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}