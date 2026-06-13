package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.VagaSkillEntity;
import br.com.appbit.appbit.entities.VagaSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VagaSkillRepository extends JpaRepository<VagaSkillEntity, VagaSkillId> {
}
