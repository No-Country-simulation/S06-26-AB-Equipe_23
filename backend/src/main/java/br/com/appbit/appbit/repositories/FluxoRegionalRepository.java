package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.ConcentracaoEntity;
import br.com.appbit.appbit.entities.FluxoRegionalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FluxoRegionalRepository extends JpaRepository<FluxoRegionalEntity, Long> {
}
