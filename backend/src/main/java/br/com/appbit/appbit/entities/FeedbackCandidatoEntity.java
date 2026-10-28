package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "fact_feedback_candidato", indexes = {
        @Index(name = "idx_feedback_empresa_vaga", columnList = "empresa_id, vaga_id"),
        @Index(name = "idx_feedback_candidato", columnList = "candidato_id")
})
public class FeedbackCandidatoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long id;

    @NotBlank(message = "A empresa é obrigatória")
    @Column(name = "empresa_id", nullable = false, length = 40)
    private String empresaId;

    @Column(name = "vaga_id")
    private Integer vagaId;

    @NotBlank(message = "O candidato_id é obrigatório")
    @Column(name = "candidato_id", nullable = false, length = 40)
    private String candidatoId;

    @NotBlank(message = "A decisão é obrigatória")
    @Column(name = "decisao", nullable = false, length = 20)
    private String decisao; // "APROVADO" ou "REPROVADO"

    @Column(name = "motivo_rejeicao", length = 80)
    private String motivoRejeicao;

    @Column(name = "anotacoes_internas", length = 1000)
    private String anotacoesInternas;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;
}
