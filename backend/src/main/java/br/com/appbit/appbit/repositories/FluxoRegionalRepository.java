package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.FluxoRegionalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FluxoRegionalRepository extends JpaRepository<FluxoRegionalEntity, Long> {

    // Buscar por cluster origem
    List<FluxoRegionalEntity> findByClusterOrigem(String clusterOrigem);

    // Buscar por cluster destino
    List<FluxoRegionalEntity> findByClusterDestino(String clusterDestino);

    // Buscar por município origem
    List<FluxoRegionalEntity> findByMunicipioOrigem(String municipioOrigem);

    // Buscar por município destino
    List<FluxoRegionalEntity> findByMunicipioDestino(String municipioDestino);

    // Query customizada - fluxo entre dois clusters
    @Query("SELECT f FROM FluxoRegionalEntity f WHERE f.clusterOrigem = :origem AND f.clusterDestino = :destino")
    List<FluxoRegionalEntity> findFluxoBetweenClusters(@Param("origem") String origem,
            @Param("destino") String destino);

    // Query customizada - principais rotas de um cluster
    @Query("SELECT f FROM FluxoRegionalEntity f WHERE f.clusterOrigem = :cluster ORDER BY f.numeroUsuarios DESC")
    List<FluxoRegionalEntity> findMainRoutesFromCluster(@Param("cluster") String cluster);

    // Query customizada - fluxo por período
    @Query("SELECT f FROM FluxoRegionalEntity f WHERE f.periodo = :periodo ORDER BY f.numeroUsuarios DESC")
    List<FluxoRegionalEntity> findByPeriodo(@Param("periodo") String periodo);

    // Contar fluxos de um cluster
    Long countByClusterOrigem(String cluster);
}