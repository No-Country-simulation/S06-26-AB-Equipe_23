package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.EventoEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<EventoEntity, Integer> {

    List<EventoEntity> findByNome(String nome);

    List<EventoEntity> findByPalestrantes(String palestrantes);

    List<EventoEntity> findByTemaPalestra(String tema_palestra);

    List<EventoEntity> findByCargaHoraria(String cargaHoraria);

    List<EventoEntity> findByLocal(String local);

    List<EventoEntity> findByData(LocalDateTime data);

    List<EventoEntity> findByHorario(String horario);
}