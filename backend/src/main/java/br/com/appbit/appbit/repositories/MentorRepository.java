package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.MentorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<MentorEntity, Integer> {

    Optional<MentorEntity> findById(String id);

    Optional<MentorEntity> findByNome(String nome);

    Optional<MentorEntity> findByEmpresaOrigem(String empresaOrigem);

    Optional<MentorEntity> findByCargo(String cargo);

    Optional<MentorEntity> findByEspecialidadeEsg(String especialidadeEsg);

    Optional<MentorEntity> findByDisponibilidade(String disponibilidade);

}
