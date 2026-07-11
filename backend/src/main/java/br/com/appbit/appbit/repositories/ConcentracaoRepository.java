package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.ConcentracaoEntity;
import br.com.appbit.appbit.entities.AntenaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ConcentracaoRepository extends JpaRepository<ConcentracaoEntity, Long> {

    List<ConcentracaoEntity> findByAntena(AntenaEntity antena);

    List<ConcentracaoEntity> findByCluster(String cluster);

    List<ConcentracaoEntity> findByMunicipio(String municipio);

    List<ConcentracaoEntity> findByPeriodo(String periodo);

    @Query("SELECT c FROM ConcentracaoEntity c WHERE c.data = :data AND c.antena = :antena")
    List<ConcentracaoEntity> findByDataAndAntena(@Param("data") LocalDate data, @Param("antena") AntenaEntity antena);

    @Query("SELECT c FROM ConcentracaoEntity c WHERE c.data BETWEEN :dataInicio AND :dataFim ORDER BY c.data DESC")
    List<ConcentracaoEntity> findByDataRange(@Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim);

    @Query("SELECT c FROM ConcentracaoEntity c WHERE c.data = :data ORDER BY c.numeroUsuario DESC")
    List<ConcentracaoEntity> findRankingByData(@Param("data") LocalDate data);

    @Query("SELECT AVG(c.numeroUsuario) FROM ConcentracaoEntity c WHERE c.antena = :antena")
    Double findMediaUsuariosByAntena(@Param("antena") AntenaEntity antena);

    Long countByAntena(AntenaEntity antena);

    @Query("SELECT c.cluster, AVG(c.congestionamentoMedio), AVG(c.dropPacoteMedio) " +
           "FROM ConcentracaoEntity c GROUP BY c.cluster")
    List<Object[]> findStatsByCluster();
}