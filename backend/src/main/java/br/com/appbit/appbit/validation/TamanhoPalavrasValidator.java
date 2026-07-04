package br.com.appbit.appbit.validation;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TamanhoPalavrasValidator implements ConstraintValidator<PalavrasMaximas, String> {
    private int maxWords;

    @Override
    public void initialize(PalavrasMaximas constraintAnnotation) {
        this.maxWords = constraintAnnotation.max();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true; // Deixe que a anotação @NotBlank lide com campos vazios
        }

        // Divide a string em palavras usando um ou mais espaços em branco como delimitador
        String[] words = value.trim().split("\\s+");
        
        return words.length <= maxWords;
    }
}
