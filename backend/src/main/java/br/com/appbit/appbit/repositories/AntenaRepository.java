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

    List<AntenaEntity> findByCluster(String cluster);

    List<AntenaEntity> findByMunicipio(String municipio);

    List<AntenaEntity> findByRegiao(RegiaoEntity regiao);

    List<AntenaEntity> findByClusterAndMunicipio(String cluster, String municipio);

    @Query("SELECT a FROM AntenaEntity a WHERE a.regiao = :regiao")
    List<AntenaEntity> findAntenasByRegiao(@Param("regiao") RegiaoEntity regiao);

    @Query("SELECT a FROM AntenaEntity a WHERE LOWER(a.cluster) LIKE LOWER(CONCAT('%', :cluster, '%'))")
    List<AntenaEntity> findByClusterContaining(@Param("cluster") String cluster);

    Long countByRegiao(RegiaoEntity regiao);

    Long countByCluster(String cluster);
}