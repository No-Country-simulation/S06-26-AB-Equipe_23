package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.AntenaEntity;
import br.com.appbit.appbit.entities.RegiaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AntenaRepository extends JpaRepository<AntenaEntity, String> {

    // Buscar por cluster
    List<AntenaEntity> findByCluster(String cluster);

    // Buscar por município
    List<AntenaEntity> findByMunicipio(String municipio);

    // Buscar por região
    List<AntenaEntity> findByRegiao(RegiaoEntity regiao);

    // Buscar por cluster e município
    List<AntenaEntity> findByClusterAndMunicipio(String cluster, String municipio);

    // Query customizada - antenas por região com count
    @Query("SELECT a FROM AntenaEntity a WHERE a.regiao = :regiao")
    List<AntenaEntity> findAntenasByRegiao(@Param("regiao") RegiaoEntity regiao);

    // Query customizada - buscar por padrão de cluster
    @Query("SELECT a FROM AntenaEntity a WHERE LOWER(a.cluster) LIKE LOWER(CONCAT('%', :cluster, '%'))")
    List<AntenaEntity> findByClusterContaining(@Param("cluster") String cluster);

    // Contar antenas por região
    Long countByRegiao(RegiaoEntity regiao);

    // Contar antenas por cluster
    Long countByCluster(String cluster);
}