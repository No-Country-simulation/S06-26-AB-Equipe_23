package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(name = "lat" )
    private BigDecimal latitude;

    @Column(name = "lon" )
    private BigDecimal longitude;

    @Column(name = "perfil_regiao")
    private String perfil;

    @Column(name = "fonte", nullable = false)
    private String fonte;
}
