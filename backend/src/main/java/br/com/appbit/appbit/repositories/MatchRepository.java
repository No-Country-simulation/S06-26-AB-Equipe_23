package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.MatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<MatchEntity, Long> {
}
