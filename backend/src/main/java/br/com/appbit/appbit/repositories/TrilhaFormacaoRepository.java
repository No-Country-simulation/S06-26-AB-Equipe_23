package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.TrilhaFormacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrilhaFormacaoRepository extends JpaRepository<TrilhaFormacaoEntity, Integer> {
}
