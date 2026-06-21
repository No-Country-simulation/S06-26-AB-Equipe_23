package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.*;
import br.com.appbit.appbit.dtos.create.CandidatoCreateDTO;
import br.com.appbit.appbit.dtos.response.CandidatoCompletoDTO;
import br.com.appbit.appbit.dtos.update.CandidatoUpdateDTO;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.RegiaoEntity;
import br.com.appbit.appbit.mappers.CandidatoMapper;
import br.com.appbit.appbit.repositories.CandidatoRepository;
import br.com.appbit.appbit.repositories.RegiaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;

    private final RegiaoRepository regiaoRepository;


    private final CandidatoMapper candidatoMapper;

    public CandidatoCompletoDTO createCandidato(CandidatoCreateDTO createDTO){


        RegiaoEntity regiao = regiaoRepository.findById(createDTO.regiaoId()).orElse(null);

        if (regiao == null){
            throw new RuntimeException("Regiao Não Encontrada");
        }


        CandidatoEntity candidato = candidatoMapper.toEntity(createDTO);

        candidato.setRegiao(regiao);

        CandidatoEntity candidatoSave = candidatoRepository.save(candidato);

        return candidatoMapper.toResponseDTO(candidatoSave);
    }

    public List<CandidatoCompletoDTO> listAllCandidato(){
        List<CandidatoEntity> candidatoList = candidatoRepository.findAll();
        List<CandidatoCompletoDTO> candidatoCompletoDTOS = new ArrayList<>();

        for (CandidatoEntity candidato : candidatoList) {

            CandidatoCompletoDTO responseDTO= candidatoMapper.toResponseDTO(candidato);

            candidatoCompletoDTOS.add(responseDTO);
        }
        return candidatoCompletoDTOS;
    }

    public CandidatoCompletoDTO getCandidatoById(Integer candidatoId){

        CandidatoEntity candidato = candidatoRepository.findById(candidatoId).orElse(null);

        if (candidato == null){
            throw  new RuntimeException("Candidato não encontrado");
        }

        CandidatoCompletoDTO responseDTO = candidatoMapper.toResponseDTO(candidato);

        return responseDTO;
    }

    public CandidatoCompletoDTO updateCandidatoById(CandidatoUpdateDTO updateDTO, Integer candidatoId){

        CandidatoEntity candidato = candidatoRepository.findById(candidatoId).orElse(null);

        if (candidato == null){
            throw  new RuntimeException("Candidato não encontrado");
        }

        RegiaoEntity regiao = regiaoRepository.findById(updateDTO.regiaoId()).orElse(null);

        if (regiao == null){
            throw new RuntimeException("Regiao Não Encontrado");
        }

        candidato.setNome(updateDTO.nome());
        candidato.setCargo(updateDTO.cargo());
        candidato.setNivel(updateDTO.nivel());
        candidato.setCluster(updateDTO.cluster());
        candidato.setMunicipio(updateDTO.municipio());
        candidato.setGrupo(updateDTO.grupo());
        candidato.setDiversidade(updateDTO.diversidade());
        candidato.setDisponibilidade(updateDTO.disponibilidade());
        candidato.setAtivo(updateDTO.ativo());
        candidato.setRegiao(regiao);

        CandidatoEntity candidatoAtualizada =   candidatoRepository.save(candidato);

        return candidatoMapper.toResponseDTO(candidatoAtualizada);
    }

    public void deleteCandidatoById( Integer candidatoId ){

        CandidatoEntity candidato = candidatoRepository.findById(candidatoId).orElse(null);

        if (candidato == null){

            throw  new RuntimeException("Candidato não encontrado");
        }

        candidatoRepository.delete(candidato);
    }
}
