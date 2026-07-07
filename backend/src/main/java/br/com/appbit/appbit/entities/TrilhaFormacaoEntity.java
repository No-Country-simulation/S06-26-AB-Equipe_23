package br.com.appbit.appbit.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "trilhas_formacao")
@Getter
@Setter
public class TrilhaFormacaoEntity {

    @Id
    @Column(name = "trilha_id")
    private Integer trilhaId;

    @Column(name = "nome_trilha", nullable = false)
    private String nomeTrilha;

    @Column(name = "descricao_conteudo", nullable = false)
    private String descricaoConteudo;

    @Column(name = "carga_horaria", nullable = false)
    private String cargaHoraria;

    @Column(name = "link_midia")
    private String linkMidia;
}
