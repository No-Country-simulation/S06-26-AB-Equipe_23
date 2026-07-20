package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dim_vaga", indexes = {
        @Index(name = "idx_empresa", columnList = "empresa_id")
})
public class VagaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaga_id")
    private Integer id;

    @NotBlank(message = "A empresa é obrigatória")
    @Column(name = "empresa_id", nullable = false)
    private String empresaId;

    @NotBlank(message = "O titulo é obrigatório")
    @Column(name = "titulo", nullable = false)
    private String titulo;

    @NotBlank(message = "O nivel é obrigatório")
    @Column(name = "nivel", nullable = false)
    private String nivel;

    @ManyToOne
    @JoinColumn(name = "regiao_alvo_id")
    private RegiaoEntity regiaoAlvo;

    @Column(name = "diversidade_minima")
    private BigDecimal diversidadeMinima;

    @NotNull(message = "O Antiviés é obrigatório")
    @Column(name = "anti_vies", nullable = false)
    private Boolean antiVies;

    @Column(name = "descricao", length = 1000)
    private String descricao;

    @Column(name = "modalidade", length = 50)
    private String modalidade;

    @Column(name = "area", length = 100)
    private String area;

    @Column(name = "prioridade_mulheres")
    private Boolean prioridadeMulheres;

    @Column(name = "prioridade_negros")
    private Boolean prioridadeNegros;

    @Column(name = "prioridade_pcd")
    private Boolean prioridadePcd;

    @Column(name = "prioridade_lgbt")
    private Boolean prioridadeLgbt;

    @Column(name = "esg_match")
    private Integer esgMatch;

    @CreationTimestamp
    @Column(name = "criada_em", nullable = false, insertable = false, updatable = false)
    private LocalDateTime criacao;

}
