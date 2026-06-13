package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.SkillEntity;
import br.com.appbit.appbit.entities.VagaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VagaRepository extends JpaRepository<VagaEntity, Integer> {
}
