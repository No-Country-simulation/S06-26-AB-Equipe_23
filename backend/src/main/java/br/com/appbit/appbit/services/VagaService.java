package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.VagaCreateDTO;
import br.com.appbit.appbit.dtos.VagaResponseDTO;
import br.com.appbit.appbit.dtos.VagaUpdateDTO;
import br.com.appbit.appbit.entities.VagaEntity;
import br.com.appbit.appbit.entities.RegiaoEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.VagaMapper;
import br.com.appbit.appbit.repositories.VagaRepository;
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
public class VagaService {

    private final VagaRepository vagaRepository;
    private final RegiaoRepository regiaoRepository;
    private final VagaMapper vagaMapper;

    public VagaResponseDTO createVaga(VagaCreateDTO createDTO) {
        log.info("Criando nova vaga: {}", createDTO.titulo());

        VagaEntity vaga = vagaMapper.toEntity(createDTO);

        // CORRIGIDO: resolve regiaoAlvoId -> RegiaoEntity (igual ao CandidatoService)
        if (createDTO.regiaoAlvoId() != null) {
            RegiaoEntity regiao = regiaoRepository.findById(createDTO.regiaoAlvoId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Região não encontrada com ID: " + createDTO.regiaoAlvoId()));
            vaga.setRegiaoAlvo(regiao);
        }

        VagaEntity vagaSave = vagaRepository.save(vaga);
        log.info("Vaga criada com sucesso. ID: {}", vagaSave.getId());
        return vagaMapper.toResponseDTO(vagaSave);
    }

    @Transactional(readOnly = true)
    public List<VagaResponseDTO> listAllVaga() {
        log.info("Listando todas as vagas");
        return vagaRepository.findAll()
                .stream()
                .map(vagaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VagaResponseDTO getVagaById(Integer vagaId) {
        log.info("Buscando vaga por ID: {}", vagaId);
        VagaEntity vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + vagaId));
        return vagaMapper.toResponseDTO(vaga);
    }

    public VagaResponseDTO updateVagaById(VagaUpdateDTO updateDTO, Integer vagaId) {
        log.info("Atualizando vaga com ID: {}", vagaId);

        VagaEntity vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + vagaId));

        vaga.setEmpresaId(updateDTO.empresaId());
        vaga.setTitulo(updateDTO.titulo());
        vaga.setNivel(updateDTO.nivel());

        if (updateDTO.regiaoAlvoId() != null) {
            RegiaoEntity regiao = regiaoRepository.findById(updateDTO.regiaoAlvoId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Região não encontrada com ID: " + updateDTO.regiaoAlvoId()));
            vaga.setRegiaoAlvo(regiao);
        } else {
            vaga.setRegiaoAlvo(null);
        }

        vaga.setDiversidadeMinima(updateDTO.diversidadeMinima());
        vaga.setAntiVies(updateDTO.antiVies());

        VagaEntity vagaAtualizada = vagaRepository.save(vaga);
        log.info("Vaga atualizada com sucesso. ID: {}", vagaId);
        return vagaMapper.toResponseDTO(vagaAtualizada);
    }

    public void deleteVagaById(Integer vagaId) {
        log.info("Deletando vaga com ID: {}", vagaId);
        VagaEntity vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + vagaId));
        vagaRepository.delete(vaga);
        log.info("Vaga deletada com sucesso. ID: {}", vagaId);
    }

    @Transactional(readOnly = true)
    public List<VagaResponseDTO> findByNivel(String nivel) {
        log.info("Buscando vagas por nível: {}", nivel);
        return vagaRepository.findByNivel(nivel)
                .stream()
                .map(vagaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VagaResponseDTO> findVagasComAntiVies() {
        log.info("Buscando vagas com anti-viés");
        return vagaRepository.findByAntiVies(true)
                .stream()
                .map(vagaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VagaResponseDTO> findVagasByRegiao(Integer regiaoId) {
        log.info("Buscando vagas por região ID: {}", regiaoId);
        RegiaoEntity regiao = regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Região não encontrada com ID: " + regiaoId));
        return vagaRepository.findByRegiaoAlvo(regiao)
                .stream()
                .map(vagaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}