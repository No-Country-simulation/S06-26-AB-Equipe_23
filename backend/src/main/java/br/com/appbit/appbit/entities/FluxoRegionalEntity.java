package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "fact_fluxo_regional")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FluxoRegionalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fluxo_id")
    private Long id;

    @NotBlank(message = "O cluster origem é obrigatório")
    @Column(name = "cluster_origem", nullable = false)
    private String clusterOrigem;

    @NotBlank(message = "O municipio origem é obrigatório")
    @Column(name = "municipio_origem", nullable = false)
    private String municipioOrigem;


    @NotBlank(message = "O cluster destino é obrigatório")
    @Column(name = "cluster_destino", nullable = false)
    private String clusterDestino;

    @NotBlank(message = "O municipio destino é obrigatório")
    @Column(name = "municipio_destino", nullable = false)
    private String municipioDestino;

    @NotNull(message = "O numero de usuarios é obrigatório")
    @Column(name = "n_usuarios", nullable = false)
    private Integer numeroUsuarios;

    @Column(name = "n_viagens")
    private Integer numeroViagens;

    @Column(name = "dist_media_km")
    private BigDecimal distanciaMedia;

    @Column(name = "periodo_predominante")
    private String periodo;
}
