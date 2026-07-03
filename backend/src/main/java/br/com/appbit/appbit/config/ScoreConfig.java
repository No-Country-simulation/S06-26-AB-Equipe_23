package br.com.appbit.appbit.config;

/**
 * Pesos e limites usados na fórmula de score_match.
 * Equivalente ao ScoreConfig do Python (Dados/BI).
 *
 * score_final = skill_score   * skillWeight
 *             + exp_score     * experienceWeight
 *             + model_score   * workModelWeight
 *             + diversity     * diversityBonusWeight
 *
 * O resultado é multiplicado por 100 e arredondado (0–100).
 */
public record ScoreConfig(
        double skillWeight,
        double experienceWeight,
        double workModelWeight,
        double diversityBonusWeight,
        int    maxExperienceYears
) {
    /** Configuração padrão validada por Dados/BI. */
    public static ScoreConfig defaults() {
        return new ScoreConfig(0.50, 0.25, 0.15, 0.10, 5);
    }
}
