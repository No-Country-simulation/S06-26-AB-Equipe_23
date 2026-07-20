package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.VagaCreateDTO;
import br.com.appbit.appbit.dtos.VagaResponseDTO;
import br.com.appbit.appbit.dtos.VagaUpdateDTO;
import br.com.appbit.appbit.entities.VagaEntity;
import br.com.appbit.appbit.entities.RegiaoEntity;
import br.com.appbit.appbit.entities.SkillEntity;
import br.com.appbit.appbit.entities.VagaSkillEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.VagaMapper;
import br.com.appbit.appbit.repositories.VagaRepository;
import br.com.appbit.appbit.repositories.RegiaoRepository;
import br.com.appbit.appbit.repositories.SkillRepository;
import br.com.appbit.appbit.repositories.VagaSkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class VagaService {

    private final VagaRepository vagaRepository;
    private final RegiaoRepository regiaoRepository;
    private final VagaSkillRepository vagaSkillRepository;
    private final SkillRepository skillRepository;
    private final VagaMapper vagaMapper;

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
    public VagaResponseDTO createVaga(VagaCreateDTO createDTO) {
        log.info("Criando nova vaga: {}", createDTO.titulo());

        VagaEntity vaga = vagaMapper.toEntity(createDTO);

        if (createDTO.regiaoAlvoId() != null) {
            RegiaoEntity regiao = regiaoRepository.findById(createDTO.regiaoAlvoId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Região não encontrada com ID: " + createDTO.regiaoAlvoId()));
            vaga.setRegiaoAlvo(regiao);
        }

        vaga.setDescricao(createDTO.descricao());
        vaga.setModalidade(createDTO.modalidade() != null ? createDTO.modalidade() : "Híbrido");
        vaga.setArea(createDTO.area() != null ? createDTO.area() : "Geral");
        vaga.setPrioridadeMulheres(createDTO.prioridadeMulheres() != null ? createDTO.prioridadeMulheres() : false);
        vaga.setPrioridadeNegros(createDTO.prioridadeNegros() != null ? createDTO.prioridadeNegros() : false);
        vaga.setPrioridadePcd(createDTO.prioridadePcd() != null ? createDTO.prioridadePcd() : false);
        vaga.setPrioridadeLgbt(createDTO.prioridadeLgbt() != null ? createDTO.prioridadeLgbt() : false);
        vaga.setEsgMatch(createDTO.esgMatch() != null ? createDTO.esgMatch() : 85);

        VagaEntity vagaSave = vagaRepository.save(vaga);
        salvarSkillsVaga(vagaSave, createDTO.skills());

        log.info("Vaga criada com sucesso. ID: {}", vagaSave.getId());
        return mapToDTO(vagaSave);
    }

    @Transactional(readOnly = true)
    public List<VagaResponseDTO> listAllVaga() {
        log.info("Listando todas as vagas");
        return vagaRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<VagaResponseDTO> listAllVaga(org.springframework.data.domain.Pageable pageable) {
        log.info("Listando vagas com paginacao nativa: {}", pageable);
        return vagaRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public VagaResponseDTO getVagaById(Integer vagaId) {
        log.info("Buscando vaga por ID: {}", vagaId);
        VagaEntity vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + vagaId));
        return mapToDTO(vaga);
    }

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
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
        if (updateDTO.descricao() != null) vaga.setDescricao(updateDTO.descricao());
        if (updateDTO.modalidade() != null) vaga.setModalidade(updateDTO.modalidade());
        if (updateDTO.area() != null) vaga.setArea(updateDTO.area());
        if (updateDTO.prioridadeMulheres() != null) vaga.setPrioridadeMulheres(updateDTO.prioridadeMulheres());
        if (updateDTO.prioridadeNegros() != null) vaga.setPrioridadeNegros(updateDTO.prioridadeNegros());
        if (updateDTO.prioridadePcd() != null) vaga.setPrioridadePcd(updateDTO.prioridadePcd());
        if (updateDTO.prioridadeLgbt() != null) vaga.setPrioridadeLgbt(updateDTO.prioridadeLgbt());
        if (updateDTO.esgMatch() != null) vaga.setEsgMatch(updateDTO.esgMatch());

        VagaEntity vagaAtualizada = vagaRepository.save(vaga);
        if (updateDTO.skills() != null) {
            vagaSkillRepository.deleteAll(vagaSkillRepository.findByVaga(vagaAtualizada));
            salvarSkillsVaga(vagaAtualizada, updateDTO.skills());
        }

        log.info("Vaga atualizada com sucesso. ID: {}", vagaId);
        return mapToDTO(vagaAtualizada);
    }

    @org.springframework.cache.annotation.CacheEvict(value = {"matching", "esgInsights"}, allEntries = true)
    public void deleteVagaById(Integer vagaId) {
        log.info("Deletando vaga com ID: {}", vagaId);
        VagaEntity vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga não encontrada com ID: " + vagaId));
        vagaSkillRepository.deleteAll(vagaSkillRepository.findByVaga(vaga));
        vagaRepository.delete(vaga);
        log.info("Vaga deletada com sucesso. ID: {}", vagaId);
    }

    @Transactional(readOnly = true)
    public List<VagaResponseDTO> findByNivel(String nivel) {
        log.info("Buscando vagas por nível: {}", nivel);
        return vagaRepository.findByNivel(nivel)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VagaResponseDTO> findVagasComAntiVies() {
        log.info("Buscando vagas com anti-viés");
        return vagaRepository.findByAntiVies(true)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VagaResponseDTO> findVagasByRegiao(Integer regiaoId) {
        log.info("Buscando vagas por região ID: {}", regiaoId);
        RegiaoEntity regiao = regiaoRepository.findById(regiaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Região não encontrada com ID: " + regiaoId));
        return vagaRepository.findByRegiaoAlvo(regiao)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void salvarSkillsVaga(VagaEntity vaga, List<String> skills) {
        if (skills == null || skills.isEmpty()) return;
        for (String skillName : skills) {
            if (skillName == null || skillName.isBlank()) continue;
            String cleanName = skillName.trim();
            SkillEntity skill = skillRepository.findByNome(cleanName)
                    .orElseGet(() -> {
                        SkillEntity s = new SkillEntity();
                        s.setNome(cleanName);
                        s.setCategoria("geral");
                        return skillRepository.save(s);
                    });
            VagaSkillEntity vs = new VagaSkillEntity();
            vs.setVaga(vaga);
            vs.setSkill(skill);
            vs.setPeso(BigDecimal.valueOf(1.00));
            vagaSkillRepository.save(vs);
        }
    }

    private VagaResponseDTO mapToDTO(VagaEntity vaga) {
        List<String> skills = vagaSkillRepository.findByVaga(vaga)
                .stream()
                .map(vs -> vs.getSkill().getNome())
                .collect(Collectors.toList());
        return vagaMapper.toResponseDTO(vaga, skills);
    }
}