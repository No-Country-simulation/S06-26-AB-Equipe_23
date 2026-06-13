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
@Table(name = "dim_antena")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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


    @NotNull(message = "O latitude é obrigatória")
    @Column(name = "lat", nullable = false )
    private BigDecimal latitude;

    @NotNull(message = "O longitude é obrigatória")
    @Column(name = "lon", nullable = false )
    private BigDecimal longitude;

    @ManyToOne()
    @JoinColumn(name = "regiao_id", nullable = true)
    private RegiaoEntity regiao;
}
