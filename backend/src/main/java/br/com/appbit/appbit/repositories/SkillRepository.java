package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, Integer> {

    Optional<SkillEntity> findByNome(String nome);

    List<SkillEntity> findByCategoria(String categoria);

    @Query("SELECT s FROM SkillEntity s WHERE LOWER(s.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<SkillEntity> findByNomeContaining(@Param("nome") String nome);

    @Query("SELECT DISTINCT s.categoria FROM SkillEntity s WHERE s.categoria IS NOT NULL")
    List<String> findAllCategorias();

    boolean existsByNome(String nome);
}