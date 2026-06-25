package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.RegiaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegiaoRepository extends JpaRepository<RegiaoEntity, Integer> {

    Optional<RegiaoEntity> findById(String id);

    Optional<RegiaoEntity> findByCluster(String cluster);

    Optional<RegiaoEntity> findByMunicipio(String municipio);

    Optional<RegiaoEntity> findByClusterAndMunicipio(String cluster, String municipio);

    List<RegiaoEntity> findByPerfil(String perfil);

    @Query("SELECT r FROM RegiaoEntity r WHERE r.fonte = :fonte")
    List<RegiaoEntity> findByFonte(@Param("fonte") String fonte);

    Long countByPerfil(String perfil);
}