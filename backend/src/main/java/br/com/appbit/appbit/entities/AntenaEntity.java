package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;

@Entity
@Table(name = "dim_antena")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "ecgi")
@ToString(exclude = "regiao")
public class AntenaEntity {
    @Id
    @Column(name = "ecgi")
    private String ecgi;
    @NotBlank(message = "O cluster é obrigatório")
    @Column(name = "cluster", nullable = false)
    private String cluster;

    @NotBlank(message = "O municipio é obrigatório")
    @Column(name = "municipio", nullable = false)
    private String municipio;

    @DecimalMin(value = "-90.0", message = "Latitude deve estar entre -90 e 90")
    @DecimalMax(value = "90.0", message = "Latitude deve estar entre -90 e 90")
    @Column(name = "lat", nullable = false)
    private BigDecimal latitude;

    @DecimalMin(value = "-180.0", message = "Longitude deve estar entre -180 e 180")
    @DecimalMax(value = "180.0", message = "Longitude deve estar entre -180 e 180")
    @Column(name = "lon", nullable = false)
    private BigDecimal longitude;

    @ManyToOne()
    @JoinColumn(name = "regiao_id", nullable = true)
    private RegiaoEntity regiao;
}
