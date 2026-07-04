package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.TrilhaEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrilhaRepository extends JpaRepository<TrilhaEntity, Integer> {

    List<TrilhaEntity> findByNome(String nome);

    List<TrilhaEntity> findByDescricao(String descricao);

    List<TrilhaEntity> findByLink(String link);

    List<TrilhaEntity> findByCargaHoraria(String cargaHoraria);

}