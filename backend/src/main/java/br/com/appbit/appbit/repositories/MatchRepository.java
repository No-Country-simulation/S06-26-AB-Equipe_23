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

    List<MatchEntity> findByVaga(VagaEntity vaga);

    List<MatchEntity> findByCandidato(CandidatoEntity candidato);

    @Query("SELECT m FROM MatchEntity m WHERE m.vaga.id = :vagaId AND m.candidato.id = :candidatoId")
    Optional<MatchEntity> findByVagaAndCandidato(@Param("vagaId") Integer vagaId,
            @Param("candidatoId") Integer candidatoId);

    @Query("SELECT m FROM MatchEntity m WHERE m.vaga.id = :vagaId ORDER BY m.scoreMatch DESC")
    List<MatchEntity> findTopMatchesByVaga(@Param("vagaId") Integer vagaId);

    @Query("SELECT m FROM MatchEntity m WHERE m.candidato.id = :candidatoId ORDER BY m.scoreMatch DESC")
    List<MatchEntity> findTopMatchesByCandidato(@Param("candidatoId") Integer candidatoId);

    @Query("SELECT m FROM MatchEntity m WHERE m.scoreMatch >= :scoreMinimo ORDER BY m.scoreMatch DESC")
    List<MatchEntity> findMatchesAboveScore(@Param("scoreMinimo") BigDecimal scoreMinimo);

    @Query("SELECT m FROM MatchEntity m WHERE m.badgeDiversidade IS NOT NULL AND m.scoreMatch >= :scoreMinimo ORDER BY m.scoreDiversidade DESC")
    List<MatchEntity> findDiversityMatches(@Param("scoreMinimo") BigDecimal scoreMinimo);

    @Query("SELECT AVG(m.scoreMatch) FROM MatchEntity m WHERE m.vaga.id = :vagaId")
    Double findAverageScoreByVaga(@Param("vagaId") Integer vagaId);

    Long countByVaga(VagaEntity vaga);

    Long countByCandidato(CandidatoEntity candidato);
}