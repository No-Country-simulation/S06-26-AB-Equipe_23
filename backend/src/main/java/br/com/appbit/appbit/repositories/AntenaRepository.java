package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.AntenaEntity;
import br.com.appbit.appbit.entities.CandidatoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AntenaRepository extends JpaRepository<AntenaEntity, String> {
}
