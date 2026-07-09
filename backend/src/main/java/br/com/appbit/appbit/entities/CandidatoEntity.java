package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "dim_candidato", indexes = {
        @Index(name = "idx_regiao", columnList = "regiao_id"),
        @Index(name = "idx_ativo", columnList = "ativo")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = { "regiao", "candidatoSkills" })
public class CandidatoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candidato_id")
    private Integer id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "cargo_alvo")
    private String cargo;

    @NotBlank(message = "O nivel é obrigatório")
    @Column(name = "nivel", nullable = false)
    private String nivel;

    @Column(name = "cluster_residencia")
    private String cluster;

    @Column(name = "cep")
    private String cep;

    @Column(name = "lon")
    private String lon;

    @Column(name = "lat")
    private BigDecimal lat;

    @Column(name = "municipio_residencia")
    private String municipio;

    @Column(name = "grupo_subrepresentado")
    private String grupo;

    @Column(name = "badge_diversidade")
    private String diversidade;

    @Column(name = "disponibilidade")
    private String modeloTrabalhoPreferido;

    @Column(name = "anos_experiencia")
    private Integer anosExperiencia;

    @NotNull(message = "O status é obrigatório")
    @Column(nullable = false)
    private Boolean ativo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "regiao_id", nullable = false)
    @NotNull(message = "A região é obrigatória")
    private RegiaoEntity regiao;

    @OneToMany(mappedBy = "candidato", fetch = FetchType.LAZY)
    private List<CandidatoSkillEntity> candidatoSkills = new ArrayList<>();
}
