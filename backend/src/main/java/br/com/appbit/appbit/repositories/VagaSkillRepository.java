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

    List<VagaSkillEntity> findByVaga(VagaEntity vaga);

    List<VagaSkillEntity> findBySkill(SkillEntity skill);

    @Query("SELECT vs FROM VagaSkillEntity vs WHERE vs.vaga.id = :vagaId ORDER BY vs.peso DESC")
    List<VagaSkillEntity> findSkillsByVagaOrderByPeso(@Param("vagaId") Integer vagaId);

    @Query("SELECT vs FROM VagaSkillEntity vs WHERE vs.skill.id = :skillId")
    List<VagaSkillEntity> findVagasBySkill(@Param("skillId") Integer skillId);

    boolean existsByVagaAndSkill(VagaEntity vaga, SkillEntity skill);

    Long countByVaga(VagaEntity vaga);
}