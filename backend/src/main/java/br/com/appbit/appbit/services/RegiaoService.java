package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.RegiaoCreateDTO;
import br.com.appbit.appbit.dtos.RegiaoResponseDTO;
import br.com.appbit.appbit.dtos.RegiaoUpdateDTO;
import br.com.appbit.appbit.entities.RegiaoEntity;
import br.com.appbit.appbit.mappers.RegiaoMapper;
import br.com.appbit.appbit.repositories.RegiaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class RegiaoService {

    private final RegiaoRepository regiaoRepository;

    private final RegiaoMapper regiaoMapper;

    public RegiaoResponseDTO createRegiao(RegiaoCreateDTO regiaoCreateDTO){

         RegiaoEntity regiaoEntity = regiaoMapper.toEntity(regiaoCreateDTO);

        RegiaoEntity regiaoSave = regiaoRepository.save(regiaoEntity);

        return regiaoMapper.toResponseDTO(regiaoSave);
    }

    public List<RegiaoResponseDTO> listAllRegiao(){
        List<RegiaoEntity> regiaoList = regiaoRepository.findAll();
        List<RegiaoResponseDTO> regiaoResponseDTOS = new ArrayList<>();

        for (RegiaoEntity regiao : regiaoList) {

            RegiaoResponseDTO responseDTO= regiaoMapper.toResponseDTO(regiao);

            regiaoResponseDTOS.add(responseDTO);
        }
        return regiaoResponseDTOS;
    }

    public RegiaoResponseDTO getRegiaoById(Integer regiaoId){

        RegiaoEntity regiao = regiaoRepository.findById(regiaoId).orElse(null);

        if (regiao == null){
            throw  new RuntimeException("Região não encontrada");
        }

        RegiaoResponseDTO responseDTO = regiaoMapper.toResponseDTO(regiao);

        return responseDTO;
    }

    public RegiaoResponseDTO updateRegiaoById(RegiaoUpdateDTO updateDTO, Integer regiaoId){

        RegiaoEntity regiao = regiaoRepository.findById(regiaoId).orElse(null);

        if (regiao == null){
            throw  new RuntimeException("Região não encontrada");
        }

        regiao.setCluster(updateDTO.cluster());
        regiao.setMunicipio(updateDTO.municipio());
        regiao.setLatitude(updateDTO.latitude());
        regiao.setLongitude(updateDTO.longitude());
        regiao.setPerfil(updateDTO.perfil());
        regiao.setFonte(updateDTO.fonte());
        regiaoRepository.save(regiao);

        RegiaoEntity regiaoAtualizada =   regiaoRepository.save(regiao);

        return regiaoMapper.toResponseDTO(regiaoAtualizada);
    }


    public void deleteRegiaoById( Integer regiaoId ){

        RegiaoEntity regiao = regiaoRepository.findById(regiaoId).orElse(null);

        if (regiao == null){

            throw  new RuntimeException("Região não encontrada");

        }

        regiaoRepository.delete(regiao);
    }
}
