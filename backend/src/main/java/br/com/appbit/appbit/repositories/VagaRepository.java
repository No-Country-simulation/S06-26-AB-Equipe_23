package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.RegiaoEntity;
import br.com.appbit.appbit.entities.VagaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VagaRepository extends JpaRepository<VagaEntity, Integer> {

    List<VagaEntity> findByEmpresaId(String empresaId);

    List<VagaEntity> findByTitulo(String titulo);

    List<VagaEntity> findByNivel(String nivel);

    List<VagaEntity> findByRegiaoAlvo(RegiaoEntity regiao);

    List<VagaEntity> findByAntiVies(Boolean antiVies);

    @Query("SELECT v FROM VagaEntity v WHERE v.empresaId = :empresaId AND v.nivel = :nivel")
    List<VagaEntity> findByEmpresaAndNivel(@Param("empresaId") String empresaId, @Param("nivel") String nivel);

    @Query("SELECT v FROM VagaEntity v WHERE v.antiVies = true")
    List<VagaEntity> findVagasComAntiVies();

    @Query("SELECT v FROM VagaEntity v WHERE LOWER(v.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<VagaEntity> findByTituloContaining(@Param("titulo") String titulo);

    Long countByEmpresaId(String empresaId);

    Long countByNivel(String nivel);
}