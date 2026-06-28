package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.RegiaoCreateDTO;
import br.com.appbit.appbit.dtos.RegiaoResponseDTO;
import br.com.appbit.appbit.dtos.RegiaoUpdateDTO;
import br.com.appbit.appbit.entities.RegiaoEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.RegiaoMapper;
import br.com.appbit.appbit.repositories.RegiaoRepository;
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
public class RegiaoService {

    private final RegiaoRepository regiaoRepository;
    private final RegiaoMapper regiaoMapper;

    public RegiaoResponseDTO createRegiao(RegiaoCreateDTO regiaoCreateDTO) {
        log.info("Criando nova região: {}", regiaoCreateDTO.municipio());

        RegiaoEntity regiaoEntity = regiaoMapper.toEntity(regiaoCreateDTO);
        RegiaoEntity regiaoSave = regiaoRepository.save(regiaoEntity);

        log.info("Região criada com sucesso. ID: {}", regiaoSave.getId());
        return regiaoMapper.toResponseDTO(regiaoSave);
    }

    @Transactional(readOnly = true)
    public List<RegiaoResponseDTO> listAllRegiao() {
        log.info("Listando todas as regiões");
        return regiaoRepository.findAll()
                .stream()
                .map(regiaoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RegiaoResponseDTO getRegiaoById(Integer regiaoId) {
        log.info("Buscando região por ID: {}", regiaoId);
        RegiaoEntity regiao = regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Região não encontrada com ID: " + regiaoId));

        return regiaoMapper.toResponseDTO(regiao);
    }

    public RegiaoResponseDTO updateRegiaoById(RegiaoUpdateDTO updateDTO, Integer regiaoId) {
        log.info("Atualizando região com ID: {}", regiaoId);

        RegiaoEntity regiao = regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Região não encontrada com ID: " + regiaoId));

        regiao.setCluster(updateDTO.cluster());
        regiao.setMunicipio(updateDTO.municipio());
        regiao.setLat(updateDTO.lat());
        regiao.setLon(updateDTO.lon());
        regiao.setPerfil(updateDTO.perfil());
        regiao.setFonte(updateDTO.fonte());

        RegiaoEntity regiaoAtualizada = regiaoRepository.save(regiao);
        log.info("Região atualizada com sucesso. ID: {}", regiaoId);

        return regiaoMapper.toResponseDTO(regiaoAtualizada);
    }

    public void deleteRegiaoById(Integer regiaoId) {
        log.info("Deletando região com ID: {}", regiaoId);

        RegiaoEntity regiao = regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Região não encontrada com ID: " + regiaoId));

        regiaoRepository.delete(regiao);
        log.info("Região deletada com sucesso. ID: {}", regiaoId);
    }

    @Transactional(readOnly = true)
    public List<RegiaoResponseDTO> findByPerfil(String perfil) {
        log.info("Buscando regiões por perfil: {}", perfil);
        return regiaoRepository.findByPerfil(perfil)
                .stream()
                .map(regiaoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}