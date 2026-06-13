package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bridge_candidato_skill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateSkillEntity {

    @EmbeddedId
    private CandidatoSkillId id = new CandidatoSkillId();

    @ManyToOne
    @MapsId("candidatoId")
    @JoinColumn(name = "candidato_id")
    private CandidatoEntity candidato;

    @ManyToOne
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private SkillEntity skill;

    @Column(name = "nivel_skill")
    private String nivel;
}
