package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.MentorDiversidadeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MentorDiversidadeRepository extends JpaRepository<MentorDiversidadeEntity, Integer> {
}
