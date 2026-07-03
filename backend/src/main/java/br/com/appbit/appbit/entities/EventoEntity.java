package br.com.appbit.appbit.entities;

import br.com.appbit.appbit.validation.PalavrasMaximas;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

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
public class EventoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evento_id")
    private Integer id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(name = "nome_evento", nullable = false)
    private String nome;

    @PalavrasMaximas(mensagem = "O horario do evento excede o limite máximo de 10 palavras.", max = 10)
    @NotBlank(message = "O horario é obrigatório")
    @Column(name = "horario", nullable = false)
    private String horario;

    @NotBlank(message = "Os detalhes são obrigatórios")
    @Column(name = "detalhes", nullable = false)
    private String detalhes;

    @NotBlank(message = "A data é obrigatória")
    @Column(name = "data", nullable = false)
    private LocalDateTime data;

    @NotBlank(message = "O tema é obrigatório")
    @Column(name = "tema_palestra", nullable = false)
    private String tema;

    @NotBlank(message = "Os palestrantes são obrigatórios")
    @Column(name = "palestrantes", nullable = false)
    private String palestrantes;

}
