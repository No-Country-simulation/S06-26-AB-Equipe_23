package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "mentores_diversidade", indexes = {
        @Index(name = "mentor_id", columnList = "mentor_id"),
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class MentorEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentor_id")
    private Integer id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(name = "nome_mentor", nullable = false)
    private String nome;

    @NotBlank(message = "A empresa de origem é obrigatória")
    @Column(name = "empresa_origem", nullable = false)
    private String empresaOrigem;

    @NotBlank(message = "O cargo é obrigatório")
    @Column(name = "cargo", nullable = false)
    private String cargo;

    @NotBlank(message = "A especialidade ESG é obrigatória")
    @Column(name = "especialidade_esg", nullable = false    )
    private String especialidadeEsg;

    @NotBlank(message = "A disponibilidade é obrigatória")
    @Column(name = "disponibilidade", nullable = false)
    private String disponibilidade;

}