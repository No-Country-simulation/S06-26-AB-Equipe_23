package br.com.appbit.appbit.repositories;

import br.com.appbit.appbit.entities.CandidatoEntity;
import br.com.appbit.appbit.entities.RegiaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatoRepository extends JpaRepository<CandidatoEntity, Integer> {

    List<CandidatoEntity> findByNome(String nome);

    List<CandidatoEntity> findByRegiao(RegiaoEntity regiao);

    List<CandidatoEntity> findByNivel(String nivel);

    List<CandidatoEntity> findByAtivo(Boolean ativo);
    List<CandidatoEntity> findByGrupo(String grupo);

    List<CandidatoEntity> findByCluster(String cluster);


    @Query("SELECT c FROM CandidatoEntity c WHERE c.ativo = true AND c.regiao = :regiao")
    List<CandidatoEntity> findAtivesByRegiao(@Param("regiao") RegiaoEntity regiao);


    @Query("SELECT c FROM CandidatoEntity c WHERE c.diversidade IS NOT NULL AND c.ativo = true")
    List<CandidatoEntity> findWithDiversidadeBadge();

    @Query("SELECT c FROM CandidatoEntity c WHERE LOWER(c.cargo) LIKE LOWER(CONCAT('%', :cargo, '%')) AND c.ativo = true")
    List<CandidatoEntity> findByCargo(@Param("cargo") String cargo);

    Long countByNivel(String nivel);

    Long countByAtivo(Boolean ativo);
}