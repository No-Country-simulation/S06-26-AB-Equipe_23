package br.com.appbit.appbit.entities;

import br.com.appbit.appbit.validation.PalavrasMaximas;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "trilhas_formacao", indexes = {
        @Index(name = "trilha_id", columnList = "trilha_id"),
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class TrilhaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trilha_id")
    private Integer id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(name = "nome_trilha", nullable = false)
    private String nome;

    @NotBlank(message = "A descrição é obrigatória")
    @Column(name = "descricao_conteudo", nullable = false)
    private String descricao;

    @PalavrasMaximas(mensagem = "A carga horária excede o limite máximo de 20 palavras.", max = 20)
    @NotBlank(message = "A carga horária é obrigatória")
    @Column(name = "carga_horaria", nullable = false)
    private String cargaHoraria;

    @Column(name = "link_midia")
    private String link;

}
