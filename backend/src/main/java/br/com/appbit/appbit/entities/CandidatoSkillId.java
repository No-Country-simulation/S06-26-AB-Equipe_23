package br.com.appbit.appbit.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CandidatoSkillId implements Serializable {

    @Column(name = "candidato_id")
    private Integer candidatoId;

    @Column(name = "skill_id")
    private Integer skillId;
}
