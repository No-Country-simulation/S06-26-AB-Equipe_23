package br.com.appbit.appbit.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utilitário JWT usando jjwt 0.12.x.
 *
 * Configuração necessária em application.yaml:
 *   jwt:
 *     secret: "sua-chave-super-secreta-com-pelo-menos-32-chars"
 *     expiration-ms: 86400000   # 24 h em milissegundos
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.secretKey   = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    // ---------------------------------------------------------------
    // Geração
    // ---------------------------------------------------------------

    public String gerarToken(String email, String nome, String empresaId) {
        long agora = System.currentTimeMillis();
        return Jwts.builder()
                .subject(email)
                .claim("nome", nome)
                .claim("empresa_id", empresaId)
                .issuedAt(new Date(agora))
                .expiration(new Date(agora + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    // ---------------------------------------------------------------
    // Validação / extração
    // ---------------------------------------------------------------

    public boolean isTokenValido(String token) {
        try {
            claims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extrairEmail(String token) {
        return claims(token).getSubject();
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    // ---------------------------------------------------------------
    // Interno
    // ---------------------------------------------------------------

    private Claims claims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
