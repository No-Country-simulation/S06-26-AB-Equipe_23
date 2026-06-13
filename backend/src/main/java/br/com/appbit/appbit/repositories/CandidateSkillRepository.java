package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.CandidateSkillEntity;
import br.com.appbit.appbit.entities.CandidatoSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateSkillRepository extends JpaRepository<CandidateSkillEntity, CandidatoSkillId> {
}
