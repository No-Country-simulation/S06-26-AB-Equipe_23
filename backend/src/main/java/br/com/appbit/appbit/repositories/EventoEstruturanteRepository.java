package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.EventoEstruturanteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoEstruturanteRepository extends JpaRepository<EventoEstruturanteEntity, Integer> {
}
