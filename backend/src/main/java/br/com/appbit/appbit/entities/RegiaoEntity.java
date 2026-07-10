package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;

import java.math.BigDecimal;

@Entity
@Table(name = "dim_regiao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class RegiaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "regiao_id")
    private Integer id;

    @NotBlank(message = "O cluster é obrigatório")
    @Column(name = "cluster", nullable = false)
    private String cluster;

    @NotBlank(message = "O municipio é obrigatório")
    @Column(name = "municipio", nullable = false)
    private String municipio;

    @DecimalMin(value = "-90.0", message = "Latitude deve estar entre -90 e 90")
    @DecimalMax(value = "90.0", message = "Latitude deve estar entre -90 e 90")
    @Column(name = "lat", nullable = true, precision = 12, scale = 6)
    private BigDecimal lat;

    @DecimalMin(value = "-180.0", message = "Longitude deve estar entre -180 e 180")
    @DecimalMax(value = "180.0", message = "Longitude deve estar entre -180 e 180")
    @Column(name = "lon", nullable = true, precision = 12, scale = 6)
    private BigDecimal lon;

    @Column(name = "perfil_regiao")
    private String perfil;

    @Column(name = "fonte", nullable = false)
    private String fonte;
}
