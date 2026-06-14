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

@Entity
@Table(name = "dim_vaga")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VagaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaga_id")
    private Integer id;

    @NotBlank(message = "A empresa é obrigatória")
    @Column(name = "empresa_id", nullable = false)
    private String empresaId;

    @NotBlank(message = "O titulo é obrigatório")
    @Column(name = "titulo", nullable = false )
    private String titulo;

    @NotBlank(message = "O nivel é obrigatório")
    @Column(name = "nivel", nullable = false )
    private String nivel;

    @Column(name = "regiao_alvo")
    private String regiaoAlvo;

    @Column(name = "diversidade_minima")
    private BigDecimal diversidadeMinima;

    @NotNull(message = "O Antiviés é obrigatório")
    @Column(name = "anti_vies", nullable = false)
    private Boolean antiVies ;

    @Column(name = "criada_em",
            nullable = false,
            insertable = false,
            updatable = false
    )
    private LocalDateTime criacao;
}
