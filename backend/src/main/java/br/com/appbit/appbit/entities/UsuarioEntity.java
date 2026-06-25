package br.com.appbit.appbit.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "dim_usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_id")
    private Long id;

    @Email
    @NotBlank
    @Column(name = "email", nullable = false, unique = true, length = 180)
    private String email;

    @NotBlank
    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senhaHash;

    @NotBlank
    @Column(name = "nome", nullable = false, length = 120)
    private String nome;

    @Column(name = "empresa_id", length = 60)
    private String empresaId;

    @NotNull
    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;
}
