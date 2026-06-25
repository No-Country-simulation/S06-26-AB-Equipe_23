package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.CandidatoSkillEntity;
import br.com.appbit.appbit.entities.CandidatoSkillId;
import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatoSkillRepository extends JpaRepository<CandidatoSkillEntity, CandidatoSkillId> {

    // Buscar todas as skills de um candidato
    List<CandidatoSkillEntity> findByCandidato(CandidatoEntity candidato);

    // Buscar todos os candidatos de uma skill
    List<CandidatoSkillEntity> findBySkill(SkillEntity skill);

    // Query customizada - skills de um candidato ordenadas por nível
    @Query("SELECT cs FROM CandidatoSkillEntity cs WHERE cs.candidato.id = :candidatoId ORDER BY cs.nivel DESC")
    List<CandidatoSkillEntity> findSkillsByCandidate(@Param("candidatoId") Integer candidatoId);

    // Query customizada - candidatos com skill específica
    @Query("SELECT cs FROM CandidatoSkillEntity cs WHERE cs.skill.id = :skillId AND cs.candidato.ativo = true")
    List<CandidatoSkillEntity> findActiveCandidatesBySkill(@Param("skillId") Integer skillId);

    // Verificar se candidato possui skill
    boolean existsByCandidatoAndSkill(CandidatoEntity candidato, SkillEntity skill);

    // Contar skills de um candidato
    Long countByCandidato(CandidatoEntity candidato);
}