package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fact_concentracao_regional")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConcentracaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "concentracao_id")
    private Long id;

    @NotBlank(message = "O Cluster é obrigatório")
    @Column(name = "cluster", nullable = false )
    private String cluster;

    @NotBlank(message = "O municipio é obrigatório")
    @Column(name = "municipio", nullable = false)
    private String municipio;

    @NotNull(message = "A Data é obrigatória")
    @Column(name = "data_referencia", nullable = false )
    private LocalDate data;

    @NotBlank(message = "O periodo é obrigatório")
    @Column(name = "periodo", nullable = false )
    private String periodo;

    @NotNull(message = "O numero de usuarios é obrigatório")
    @Column(name = "n_usuarios", nullable = false)
    private Integer numeroUsuario;

    @Column(name = "n_sessoes")
    private Integer numeroSessao;

    @Column(name = "download_bytes")
    private Long downloadsBytes;

    @Column(name = "upload_bytes")
    private Long uploadsBytes;

    @Column(name = "dur_media_s")
    private Integer duracaoMedia;

    @Column(name = "congestionamento_medio")
    private BigDecimal congestionamentoMedio;

    @Column(name = "drop_pct_medio")
    private BigDecimal dropPacoteMedio;

    @NotNull(message = "A antema é obrigatoria")
    @ManyToOne()
    @JoinColumn(name = "ecgi", referencedColumnName = "ecgi", nullable = false)
    private AntenaEntity antena;
}
