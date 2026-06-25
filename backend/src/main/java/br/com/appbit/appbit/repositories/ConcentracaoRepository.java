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

    // Buscar por antena
    List<ConcentracaoEntity> findByAntena(AntenaEntity antena);

    // Buscar por cluster
    List<ConcentracaoEntity> findByCluster(String cluster);

    // Buscar por município
    List<ConcentracaoEntity> findByMunicipio(String municipio);

    // Buscar por período
    List<ConcentracaoEntity> findByPeriodo(String periodo);

    // Query customizada - concentração por data e antena
    @Query("SELECT c FROM ConcentracaoEntity c WHERE c.data = :data AND c.antena = :antena")
    List<ConcentracaoEntity> findByDataAndAntena(@Param("data") LocalDate data, @Param("antena") AntenaEntity antena);

    // Query customizada - concentração por período de datas
    @Query("SELECT c FROM ConcentracaoEntity c WHERE c.data BETWEEN :dataInicio AND :dataFim ORDER BY c.data DESC")
    List<ConcentracaoEntity> findByDataRange(@Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim);

    // Query customizada - ranking de clusters por número de usuários
    @Query("SELECT c FROM ConcentracaoEntity c WHERE c.data = :data ORDER BY c.numeroUsuario DESC")
    List<ConcentracaoEntity> findRankingByData(@Param("data") LocalDate data);

    // Query customizada - concentração média por antena
    @Query("SELECT AVG(c.numeroUsuario) FROM ConcentracaoEntity c WHERE c.antena = :antena")
    Double findMediaUsuariosByAntena(@Param("antena") AntenaEntity antena);

    // Contar registros por antena
    Long countByAntena(AntenaEntity antena);
}