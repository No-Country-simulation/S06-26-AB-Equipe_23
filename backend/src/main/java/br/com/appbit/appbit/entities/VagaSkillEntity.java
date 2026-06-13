package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "bridge_vaga_skill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VagaSkillEntity {

    @EmbeddedId
    private VagaSkillId id = new VagaSkillId();

    @ManyToOne
    @MapsId("vagaId")
    @JoinColumn(name = "vaga_id")
    private VagaEntity vaga;

    @ManyToOne
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private SkillEntity skill;

    @Column(name = "peso")
    private BigDecimal peso = BigDecimal.valueOf(1.00);
}
