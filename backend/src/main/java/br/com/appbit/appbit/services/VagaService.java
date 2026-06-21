package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.create.VagaCreateDTO;
import br.com.appbit.appbit.dtos.response.VagaResponseDTO;
import br.com.appbit.appbit.dtos.update.VagaUpdateDTO;
import br.com.appbit.appbit.entities.VagaEntity;
import br.com.appbit.appbit.mappers.VagaMapper;
import br.com.appbit.appbit.repositories.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class VagaService {

    private final VagaRepository vagaRepository;

    private final VagaMapper vagaMapper;

    public VagaResponseDTO createVaga(VagaCreateDTO createDTO){

         VagaEntity vaga = vagaMapper.toEntity(createDTO);

        VagaEntity vagaSave = vagaRepository.save(vaga);

        return vagaMapper.toResponseDTO(vagaSave);
    }

    public List<VagaResponseDTO> listAllVaga(){
        List<VagaEntity> vagaList = vagaRepository.findAll();
        List<VagaResponseDTO> vagaResponseDTOS = new ArrayList<>();

        for (VagaEntity vaga : vagaList) {

            VagaResponseDTO responseDTO= vagaMapper.toResponseDTO(vaga);

            vagaResponseDTOS.add(responseDTO);
        }
        return vagaResponseDTOS;
    }

    public VagaResponseDTO getVagaById(Integer vagaId){

        VagaEntity vaga = vagaRepository.findById(vagaId).orElse(null);

        if (vaga == null){
            throw  new RuntimeException("Vaga não encontrada");
        }

        VagaResponseDTO responseDTO = vagaMapper.toResponseDTO(vaga);

        return responseDTO;
    }

    public VagaResponseDTO updateVagaById(VagaUpdateDTO updateDTO, Integer vagaId){


        VagaEntity vaga = vagaRepository.findById(vagaId).orElse(null);

        if (vaga == null){
            throw  new RuntimeException("Vaga não encontrada");
        }

        vaga.setEmpresaId(updateDTO.empresaId());
        vaga.setTitulo(updateDTO.titulo());
        vaga.setNivel(updateDTO.nivel());
        vaga.setRegiaoAlvo(updateDTO.regiaoAlvo());
        vaga.setDiversidadeMinima(updateDTO.diversidadeMinima());
        vaga.setAntiVies(updateDTO.antiVies());

        VagaEntity vagaAtualizada =   vagaRepository.save(vaga);

        return vagaMapper.toResponseDTO(vagaAtualizada);
    }


    public void deleteVagaById( Integer vagaId ){

        VagaEntity vaga = vagaRepository.findById(vagaId).orElse(null);

        if (vaga == null){

            throw  new RuntimeException("Vaga não encontrado");

        }

        vagaRepository.delete(vaga);
    }
}
