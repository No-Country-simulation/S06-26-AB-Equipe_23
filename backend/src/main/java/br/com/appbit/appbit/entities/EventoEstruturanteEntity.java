package br.com.appbit.appbit.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "eventos_estruturantes")
@Getter
@Setter
public class EventoEstruturanteEntity {

    @Id
    @Column(name = "evento_id")
    private Integer eventoId;

    @Column(name = "nome_evento", nullable = false)
    private String nomeEvento;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Column(name = "horario", nullable = false)
    private String horario;

    @Column(name = "local", nullable = false)
    private String local;

    @Column(name = "detalhes", nullable = false)
    private String detalhes;

    @Column(name = "tema_palestra", nullable = false)
    private String temaPalestra;

    @Column(name = "palestrantes", nullable = false)
    private String palestrantes;
}
