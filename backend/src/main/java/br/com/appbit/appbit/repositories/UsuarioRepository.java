package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {

    Optional<UsuarioEntity> findByEmailAndAtivoTrue(String email);
    Optional<UsuarioEntity> findByEmail(String email);
}
