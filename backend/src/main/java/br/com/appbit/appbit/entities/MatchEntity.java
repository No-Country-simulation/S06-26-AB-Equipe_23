package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fact_match")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Long id;

    @NotNull(message = "O Score match é obrigatório")
    @Column(name = "score_match", nullable = false)
    private BigDecimal scoreMatch;

    @NotNull(message = "O Score skill é obrigatório")
    @Column(name = "score_skills", nullable = false)
    private BigDecimal scoreSkills;

    @NotNull(message = "O Score nivel é obrigatório")
    @Column(name = "score_nivel", nullable = false)
    private BigDecimal scoreNivel;

    @NotNull(message = "O Score regiao é obrigatório")
    @Column(name = "score_regiao", nullable = false)
    private BigDecimal scoreRegiao;

    @NotNull(message = "O Score diversidade é obrigatório")
    @Column(name = "score_diversidade", nullable = false)
    private BigDecimal scoreDiversidade;

    @Column(name = "badge_diversidade")
    private String badgeDiversidade;

    @Column(name = "justificativa")
    private String justificativa;

    @Column(name = "criado_em", nullable = false, insertable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vaga_id", nullable = false)
    @NotNull(message = "A vaga é obrigatória")
    private VagaEntity vaga;

    @ManyToOne(optional = false)
    @JoinColumn(name = "candidato_id", nullable = false)
    @NotNull(message = "O candidato é obrigatório")
    private CandidatoEntity candidato;
}
