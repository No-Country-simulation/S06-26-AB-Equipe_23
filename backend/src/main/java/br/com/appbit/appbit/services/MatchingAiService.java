package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.AiMatchResultDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MatchingAiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final Map<String, Set<String>> TABELA_EQUIVALENCIAS = new HashMap<>();

    static {
        // Tabela estática de sinônimos/equivalências de tecnologia (NLP Fallback)
        registrarEquivalencias("java", "spring boot", "spring framework", "spring", "jee");
        registrarEquivalencias("react", "reactjs", "react.js", "frontend");
        registrarEquivalencias("postgres", "postgresql", "sql", "mysql", "oracle", "database");
        registrarEquivalencias("docker", "kubernetes", "containers", "devops", "aws");
        registrarEquivalencias("node", "nodejs", "node.js");
        registrarEquivalencias("javascript", "js", "typescript", "ts");
        registrarEquivalencias("python", "anaconda", "pandas", "numpy", "jupyter");
        registrarEquivalencias("power bi", "powerbi", "dax", "tableau", "bi");
        registrarEquivalencias("machine learning", "ml", "ai", "inteligencia artificial", "python");
    }

    private static void registrarEquivalencias(String... termos) {
        Set<String> grupo = Arrays.stream(termos)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
        for (String termo : termos) {
            TABELA_EQUIVALENCIAS.put(termo.toLowerCase(), grupo);
        }
    }

    public AiMatchResultDTO calcularSimilaridadeSemantica(List<String> candidateSkills, List<String> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return new AiMatchResultDTO(100.0, "Nenhuma skill foi exigida para a vaga (Match automático).");
        }

        // Tenta chamada real à OpenAI/Gemini caso exista uma chave de API
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return chamarOpenAiAPI(candidateSkills, requiredSkills, apiKey);
            } catch (Exception e) {
                log.warn("Erro ao chamar API de IA da OpenAI, ativando Fallback local de NLP: {}", e.getMessage());
            }
        }

        String geminiKey = System.getenv("GEMINI_API_KEY");
        if (geminiKey != null && !geminiKey.isBlank()) {
            try {
                return chamarGeminiAPI(candidateSkills, requiredSkills, geminiKey);
            } catch (Exception e) {
                log.warn("Erro ao chamar API de IA do Gemini, ativando Fallback local de NLP: {}", e.getMessage());
            }
        }

        // Fallback local: Algoritmo Jaro-Winkler + equivalências
        return calcularSimilaridadeLocal(candidateSkills, requiredSkills);
    }

    private AiMatchResultDTO chamarOpenAiAPI(List<String> candidateSkills, List<String> requiredSkills, String apiKey) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String prompt = String.format(
            "Compare as skills do candidato: %s com as exigências da vaga: %s. " +
            "Retorne a nota de similaridade semântica de 0.0 a 1.0 e uma frase curta de justificativa. " +
            "Sua resposta deve ser estritamente um objeto JSON no formato: {\"score\": 0.85, \"justificativa\": \"Breve explicação\"}",
            candidateSkills.toString(), requiredSkills.toString()
        );

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", prompt));
        body.put("messages", messages);
        
        Map<String, String> responseFormat = Map.of("type", "json_object");
        body.put("response_format", responseFormat);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<Map> choices = (List<Map>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map message = (Map) choices.get(0).get("message");
                String content = (String) message.get("content");
                // Parser simples da resposta JSON
                double score = extrairDoubleJson(content, "score", 0.0) * 100;
                String justificativa = extrairStringJson(content, "justificativa", "Similaridade semântica avaliada via IA (OpenAI).");
                return new AiMatchResultDTO(score, justificativa);
            }
        }
        throw new IllegalStateException("Resposta inválida da API do OpenAI");
    }

    private AiMatchResultDTO chamarGeminiAPI(List<String> candidateSkills, List<String> requiredSkills, String apiKey) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = String.format(
            "Compare as skills do candidato: %s com as exigências da vaga: %s. " +
            "Retorne a nota de similaridade semântica de 0.0 a 1.0 e uma frase curta de justificativa. " +
            "Sua resposta deve ser estritamente um JSON no formato: {\"score\": 0.85, \"justificativa\": \"Breve explicação\"}",
            candidateSkills.toString(), requiredSkills.toString()
        );

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> parts = Map.of("parts", List.of(textPart));
        Map<String, Object> contents = Map.of("contents", List.of(parts));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(contents, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List candidatesList = (List) response.getBody().get("candidates");
            if (candidatesList != null && !candidatesList.isEmpty()) {
                Map candidateObj = (Map) candidatesList.get(0);
                Map contentObj = (Map) candidateObj.get("content");
                List partsList = (List) contentObj.get("parts");
                if (partsList != null && !partsList.isEmpty()) {
                    Map partObj = (Map) partsList.get(0);
                    String text = (String) partObj.get("text");
                    double score = extrairDoubleJson(text, "score", 0.0) * 100;
                    String justificativa = extrairStringJson(text, "justificativa", "Similaridade semântica avaliada via IA (Gemini).");
                    return new AiMatchResultDTO(score, justificativa);
                }
            }
        }
        throw new IllegalStateException("Resposta inválida da API do Gemini");
    }

    private AiMatchResultDTO calcularSimilaridadeLocal(List<String> candidateSkills, List<String> requiredSkills) {
        double totalScore = 0.0;
        int countMatches = 0;

        List<String> normCandidate = candidateSkills.stream()
                .map(String::toLowerCase)
                .map(String::strip)
                .toList();

        List<String> normRequired = requiredSkills.stream()
                .map(String::toLowerCase)
                .map(String::strip)
                .toList();

        for (String req : normRequired) {
            double bestMatch = 0.0;
            for (String cand : normCandidate) {
                double similarity = calcularJaroWinkler(req, cand);

                // Verifica na tabela de equivalências tecnológicas
                if (saoEquivalentes(req, cand)) {
                    similarity = 1.0;
                }

                if (similarity > bestMatch) {
                    bestMatch = similarity;
                }
            }
            totalScore += bestMatch;
            if (bestMatch >= 0.7) {
                countMatches++;
            }
        }

        double scorePercentual = (totalScore / normRequired.size()) * 100;
        String justificativa = String.format("Similaridade semântica (NLP Fallback): Candidato atende a %d das %d skills exigidas com similaridade média de %.0f%%.", 
                                            countMatches, normRequired.size(), scorePercentual);

        return new AiMatchResultDTO(scorePercentual, justificativa);
    }

    private boolean saoEquivalentes(String s1, String s2) {
        Set<String> grupo1 = TABELA_EQUIVALENCIAS.get(s1);
        return grupo1 != null && grupo1.contains(s2);
    }

    // Algoritmo nativo de Jaro-Winkler String Similarity
    public double calcularJaroWinkler(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        if (s1.equals(s2)) return 1.0;

        int len1 = s1.length();
        int len2 = s2.length();
        if (len1 == 0 || len2 == 0) return 0.0;

        int matchDistance = Math.max(len1, len2) / 2 - 1;
        boolean[] matched1 = new boolean[len1];
        boolean[] matched2 = new boolean[len2];

        int matches = 0;
        for (int i = 0; i < len1; i++) {
            int start = Math.max(0, i - matchDistance);
            int end = Math.min(len2 - 1, i + matchDistance);
            for (int j = start; j <= end; j++) {
                if (!matched2[j] && s1.charAt(i) == s2.charAt(j)) {
                    matched1[i] = true;
                    matched2[j] = true;
                    matches++;
                    break;
                }
            }
        }

        if (matches == 0) return 0.0;

        // Calcula as transposições
        int transpositions = 0;
        int k = 0;
        for (int i = 0; i < len1; i++) {
            if (matched1[i]) {
                while (!matched2[k]) k++;
                if (s1.charAt(i) != s2.charAt(k)) {
                    transpositions++;
                }
                k++;
            }
        }
        transpositions /= 2;

        double jaro = ((double) matches / len1 + (double) matches / len2 + (double) (matches - transpositions) / matches) / 3.0;

        // Ajuste de Winkler para prefixos comuns (máximo de 4 caracteres)
        int prefix = 0;
        for (int i = 0; i < Math.min(4, Math.min(len1, len2)); i++) {
            if (s1.charAt(i) == s2.charAt(i)) {
                prefix++;
            } else {
                break;
            }
        }

        return jaro + prefix * 0.1 * (1.0 - jaro);
    }

    private double extrairDoubleJson(String json, String chave, double padrao) {
        try {
            String busca = "\"" + chave + "\"";
            int index = json.indexOf(busca);
            if (index != -1) {
                int start = json.indexOf(":", index) + 1;
                int end = json.indexOf(",", start);
                if (end == -1) end = json.indexOf("}", start);
                String valor = json.substring(start, end).trim();
                return Double.parseDouble(valor.replaceAll("[^0-9.]", ""));
            }
        } catch (Exception ignored) {}
        return padrao;
    }

    private String extrairStringJson(String json, String chave, String padrao) {
        try {
            String busca = "\"" + chave + "\"";
            int index = json.indexOf(busca);
            if (index != -1) {
                int start = json.indexOf("\"", json.indexOf(":", index)) + 1;
                int end = json.indexOf("\"", start);
                return json.substring(start, end);
            }
        } catch (Exception ignored) {}
        return padrao;
    }
}
