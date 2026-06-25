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

    // Buscar por empresa
    List<VagaEntity> findByEmpresaId(String empresaId);

    // Buscar por título
    List<VagaEntity> findByTitulo(String titulo);

    // Buscar por nível
    List<VagaEntity> findByNivel(String nivel);

    // Buscar por região alvo
    List<VagaEntity> findByRegiaoAlvo(RegiaoEntity regiao);

    // Buscar vagas com anti-viés
    List<VagaEntity> findByAntiVies(Boolean antiVies);

    // Query customizada - vagas por empresa e nível
    @Query("SELECT v FROM VagaEntity v WHERE v.empresaId = :empresaId AND v.nivel = :nivel")
    List<VagaEntity> findByEmpresaAndNivel(@Param("empresaId") String empresaId, @Param("nivel") String nivel);

    // Query customizada - vagas com anti-viés ativo
    @Query("SELECT v FROM VagaEntity v WHERE v.antiVies = true")
    List<VagaEntity> findVagasComAntiVies();

    // Query customizada - buscar por padrão de título
    @Query("SELECT v FROM VagaEntity v WHERE LOWER(v.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<VagaEntity> findByTituloContaining(@Param("titulo") String titulo);

    // Contar vagas por empresa
    Long countByEmpresaId(String empresaId);

    // Contar vagas por nível
    Long countByNivel(String nivel);
}