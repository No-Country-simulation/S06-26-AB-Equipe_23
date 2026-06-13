package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.CandidatoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidatoRepository extends JpaRepository<CandidatoEntity, Integer> {
}
