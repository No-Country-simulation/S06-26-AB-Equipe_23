package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.EventoEstruturanteResponseDTO;
import br.com.appbit.appbit.dtos.MentorDiversidadeResponseDTO;
import br.com.appbit.appbit.dtos.TrilhaFormacaoResponseDTO;
import br.com.appbit.appbit.repositories.EventoEstruturanteRepository;
import br.com.appbit.appbit.repositories.MentorDiversidadeRepository;
import br.com.appbit.appbit.repositories.TrilhaFormacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ServicosMvpService {

    private final TrilhaFormacaoRepository trilhaFormacaoRepository;
    private final EventoEstruturanteRepository eventoEstruturanteRepository;
    private final MentorDiversidadeRepository mentorDiversidadeRepository;

    public List<TrilhaFormacaoResponseDTO> listarFormacoes() {
        return trilhaFormacaoRepository.findAll(Sort.by(Sort.Direction.ASC, "trilhaId")).stream()
                .map(trilha -> new TrilhaFormacaoResponseDTO(
                        trilha.getTrilhaId(),
                        trilha.getNomeTrilha(),
                        trilha.getDescricaoConteudo(),
                        trilha.getCargaHoraria(),
                        trilha.getLinkMidia()))
                .toList();
    }

    public List<EventoEstruturanteResponseDTO> listarExperiencias() {
        return eventoEstruturanteRepository.findAll(Sort.by(Sort.Direction.ASC, "eventoId")).stream()
                .map(evento -> new EventoEstruturanteResponseDTO(
                        evento.getEventoId(),
                        evento.getNomeEvento(),
                        evento.getData(),
                        evento.getHorario(),
                        evento.getLocal(),
                        evento.getDetalhes(),
                        evento.getTemaPalestra(),
                        evento.getPalestrantes()))
                .toList();
    }

    public List<MentorDiversidadeResponseDTO> listarMentorias() {
        return mentorDiversidadeRepository.findAll(Sort.by(Sort.Direction.ASC, "mentorId")).stream()
                .map(mentor -> new MentorDiversidadeResponseDTO(
                        mentor.getMentorId(),
                        mentor.getNomeMentor(),
                        mentor.getEmpresaOrigem(),
                        mentor.getCargo(),
                        mentor.getEspecialidadeEsg(),
                        mentor.getDisponibilidade()))
                .toList();
    }
}
