package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.MatchEntity;
import br.com.appbit.appbit.entities.VagaEntity;
import br.com.appbit.appbit.entities.CandidatoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, Long> {

    // Buscar matches de uma vaga
    List<MatchEntity> findByVaga(VagaEntity vaga);

    // Buscar matches de um candidato
    List<MatchEntity> findByCandidato(CandidatoEntity candidato);

    // Query customizada - match específico entre vaga e candidato
    @Query("SELECT m FROM MatchEntity m WHERE m.vaga.id = :vagaId AND m.candidato.id = :candidatoId")
    Optional<MatchEntity> findByVagaAndCandidato(@Param("vagaId") Integer vagaId,
            @Param("candidatoId") Integer candidatoId);

    // Query customizada - top matches para uma vaga
    @Query("SELECT m FROM MatchEntity m WHERE m.vaga.id = :vagaId ORDER BY m.scoreMatch DESC")
    List<MatchEntity> findTopMatchesByVaga(@Param("vagaId") Integer vagaId);

    // Query customizada - melhores oportunidades para um candidato
    @Query("SELECT m FROM MatchEntity m WHERE m.candidato.id = :candidatoId ORDER BY m.scoreMatch DESC")
    List<MatchEntity> findTopMatchesByCandidato(@Param("candidatoId") Integer candidatoId);

    // Query customizada - matches acima de um score mínimo
    @Query("SELECT m FROM MatchEntity m WHERE m.scoreMatch >= :scoreMinimo ORDER BY m.scoreMatch DESC")
    List<MatchEntity> findMatchesAboveScore(@Param("scoreMinimo") BigDecimal scoreMinimo);

    // Query customizada - matches com badge de diversidade
    @Query("SELECT m FROM MatchEntity m WHERE m.badgeDiversidade IS NOT NULL AND m.scoreMatch >= :scoreMinimo ORDER BY m.scoreDiversidade DESC")
    List<MatchEntity> findDiversityMatches(@Param("scoreMinimo") BigDecimal scoreMinimo);

    // Query customizada - score médio de matches por vaga
    @Query("SELECT AVG(m.scoreMatch) FROM MatchEntity m WHERE m.vaga.id = :vagaId")
    Double findAverageScoreByVaga(@Param("vagaId") Integer vagaId);

    // Contar matches de uma vaga
    Long countByVaga(VagaEntity vaga);

    // Contar matches de um candidato
    Long countByCandidato(CandidatoEntity candidato);
}