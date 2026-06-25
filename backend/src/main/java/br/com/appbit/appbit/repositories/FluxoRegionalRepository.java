package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.FluxoRegionalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FluxoRegionalRepository extends JpaRepository<FluxoRegionalEntity, Long> {

    List<FluxoRegionalEntity> findByClusterOrigem(String clusterOrigem);

    List<FluxoRegionalEntity> findByClusterDestino(String clusterDestino);

    List<FluxoRegionalEntity> findByMunicipioOrigem(String municipioOrigem);

    List<FluxoRegionalEntity> findByMunicipioDestino(String municipioDestino);

    @Query("SELECT f FROM FluxoRegionalEntity f WHERE f.clusterOrigem = :origem AND f.clusterDestino = :destino")
    List<FluxoRegionalEntity> findFluxoBetweenClusters(@Param("origem") String origem,
            @Param("destino") String destino);

    @Query("SELECT f FROM FluxoRegionalEntity f WHERE f.clusterOrigem = :cluster ORDER BY f.numeroUsuarios DESC")
    List<FluxoRegionalEntity> findMainRoutesFromCluster(@Param("cluster") String cluster);

    @Query("SELECT f FROM FluxoRegionalEntity f WHERE f.periodo = :periodo ORDER BY f.numeroUsuarios DESC")
    List<FluxoRegionalEntity> findByPeriodo(@Param("periodo") String periodo);

    Long countByClusterOrigem(String cluster);
}