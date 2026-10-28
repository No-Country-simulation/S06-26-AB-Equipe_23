package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.FeedbackCandidatoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackCandidatoRepository extends JpaRepository<FeedbackCandidatoEntity, Long> {

    List<FeedbackCandidatoEntity> findByEmpresaIdAndVagaId(String empresaId, Integer vagaId);

    List<FeedbackCandidatoEntity> findByEmpresaId(String empresaId);

    Optional<FeedbackCandidatoEntity> findFirstByEmpresaIdAndCandidatoIdOrderByCriadoEmDesc(String empresaId, String candidatoId);
}
