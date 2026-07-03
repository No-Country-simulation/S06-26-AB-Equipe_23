package br.com.appbit.appbit.validation;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = TamanhoPalavrasValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface PalavrasMaximas {
    int max() default 255; // Quantidade de palavras padrão
     String mensagem() default "O texto excede o limite máximo de {max} palavras.";
    
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
