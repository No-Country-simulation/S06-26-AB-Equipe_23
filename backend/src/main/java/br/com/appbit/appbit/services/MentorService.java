package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.responseDTOs.MentorResponseDTO;
import br.com.appbit.appbit.dtos.updateDTOs.MentorUpdateDTO;
import br.com.appbit.appbit.dtos.createDTOs.MentorCreateDTO;
import br.com.appbit.appbit.entities.MentorEntity;
import br.com.appbit.appbit.exceptions.ResourceNotFoundException;
import br.com.appbit.appbit.mappers.MentorMapper;
import br.com.appbit.appbit.repositories.MentorRepository;

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
public class MentorService {

    private final MentorRepository mentorRepository;
    private final MentorMapper mentorMapper;

    public MentorResponseDTO createMentor(MentorCreateDTO createDTO) {
        log.info("Criando novo mentor: {}", createDTO.nome());

        MentorEntity mentor = mentorMapper.toEntity(createDTO);
        MentorEntity mentorSave = mentorRepository.save(mentor);
        log.info("Mentor criado com sucesso. ID: {}", mentorSave.getId());

        return mentorMapper.toResponseDTO(mentorSave);
    }

    @Transactional(readOnly = true)
    public List<MentorResponseDTO> listAllMentores() {
        log.info("Listando todos os mentores");
        return mentorRepository.findAll()
                .stream()
                .map(mentorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MentorResponseDTO getMentorById(Integer mentorId) {
        log.info("Buscando mentor por ID: {}", mentorId);
        MentorEntity mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor não encontrado com ID: " + mentorId));

        return mentorMapper.toResponseDTO(mentor);
    }

    public MentorResponseDTO updateMentorById(MentorUpdateDTO updateDTO, Integer mentorId) {
        log.info("Atualizando mentor com ID: {}", mentorId);

        MentorEntity mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor não encontrado com ID: " + mentorId));

        mentorMapper.updateEntityFromUpdateDto(updateDTO, mentor);

        mentor = mentorRepository.save(mentor);
        log.info("Mentor atualizado com sucesso. ID: {}", mentorId);
        return mentorMapper.toResponseDTO(mentor);
    }

    public void deleteMentorById(Integer mentorId) {
        log.info("Deletando mentor com ID: {}", mentorId);

        MentorEntity mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor não encontrado com ID: " + mentorId));

        mentorRepository.delete(mentor);
        log.info("Mentor deletado com sucesso. ID: {}", mentorId);
    }

    @Transactional(readOnly = true)
    public List<MentorResponseDTO> listAllMentor() {
        log.info("Listando todos os mentores");
        return mentorRepository.findAll()
                .stream()
                .map(mentorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MentorResponseDTO> findByNome(String nome) {
        log.info("Buscando mentores por nome: {}", nome);
        return mentorRepository.findByNome(nome)
                .stream()
                .map(mentorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MentorResponseDTO> findByDisponibilidade(String disponibilidade) {
        log.info("Buscando mentores por disponibilidade: {}", disponibilidade);
        return mentorRepository.findByDisponibilidade(disponibilidade)
                .stream()
                .map(mentorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}