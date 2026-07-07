package br.com.appbit.appbit.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "mentores_diversidade")
@Getter
@Setter
public class MentorDiversidadeEntity {

    @Id
    @Column(name = "mentor_id")
    private Integer mentorId;

    @Column(name = "nome_mentor", nullable = false)
    private String nomeMentor;

    @Column(name = "empresa_origem", nullable = false)
    private String empresaOrigem;

    @Column(name = "cargo", nullable = false)
    private String cargo;

    @Column(name = "especialidade_esg", nullable = false)
    private String especialidadeEsg;

    @Column(name = "disponibilidade", nullable = false)
    private String disponibilidade;
}
