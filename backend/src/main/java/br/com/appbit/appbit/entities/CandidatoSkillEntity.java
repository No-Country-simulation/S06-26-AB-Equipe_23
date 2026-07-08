package br.com.appbit.appbit.entities;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bridge_candidato_skill")
@Getter
@Setter
@NoArgsConstructor
public class CandidatoSkillEntity {

    @EmbeddedId
    private CandidatoSkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("candidatoId")
    @JoinColumn(name = "candidato_id")
    private CandidatoEntity candidato;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private SkillEntity skill;

    @Column(name = "nivel_skill")
    private String nivelSkill;
}
