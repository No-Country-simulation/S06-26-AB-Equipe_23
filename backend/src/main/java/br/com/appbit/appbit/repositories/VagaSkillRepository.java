package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.VagaSkillEntity;
import br.com.appbit.appbit.entities.VagaSkillId;
import br.com.appbit.appbit.entities.VagaEntity;
import br.com.appbit.appbit.entities.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VagaSkillRepository extends JpaRepository<VagaSkillEntity, VagaSkillId> {

    // Buscar todas as skills de uma vaga
    List<VagaSkillEntity> findByVaga(VagaEntity vaga);

    // Buscar todas as vagas de uma skill
    List<VagaSkillEntity> findBySkill(SkillEntity skill);

    // Query customizada - skills de uma vaga ordenadas por peso
    @Query("SELECT vs FROM VagaSkillEntity vs WHERE vs.vaga.id = :vagaId ORDER BY vs.peso DESC")
    List<VagaSkillEntity> findSkillsByVagaOrderByPeso(@Param("vagaId") Integer vagaId);

    // Query customizada - vagas que requerem skill específica
    @Query("SELECT vs FROM VagaSkillEntity vs WHERE vs.skill.id = :skillId")
    List<VagaSkillEntity> findVagasBySkill(@Param("skillId") Integer skillId);

    // Verificar se vaga requer skill
    boolean existsByVagaAndSkill(VagaEntity vaga, SkillEntity skill);

    // Contar skills de uma vaga
    Long countByVaga(VagaEntity vaga);
}