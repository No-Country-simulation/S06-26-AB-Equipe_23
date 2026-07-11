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

    private final java.security.interfaces.RSAPrivateKey privateKey;
    private final java.security.interfaces.RSAPublicKey publicKey;
    private final String keyId = java.util.UUID.randomUUID().toString();
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret:}") String secret,
            @Value("${jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.expirationMs = expirationMs;
        try {
            java.security.KeyPairGenerator keyPairGenerator = java.security.KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            java.security.KeyPair keyPair = keyPairGenerator.generateKeyPair();
            this.privateKey = (java.security.interfaces.RSAPrivateKey) keyPair.getPrivate();
            this.publicKey = (java.security.interfaces.RSAPublicKey) keyPair.getPublic();
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao gerar par de chaves RSA para JWT", e);
        }
    }

    public String getKeyId() {
        return keyId;
    }

    public java.security.interfaces.RSAPublicKey getPublicKey() {
        return publicKey;
    }

    // ---------------------------------------------------------------
    // Geração
    // ---------------------------------------------------------------

    public String gerarToken(String email, String nome, String empresaId) {
        long agora = System.currentTimeMillis();
        return Jwts.builder()
                .header()
                .keyId(keyId)
                .and()
                .subject(email)
                .claim("nome", nome)
                .claim("empresa_id", empresaId)
                .issuedAt(new Date(agora))
                .expiration(new Date(agora + expirationMs))
                .signWith(privateKey, Jwts.SIG.RS256)
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
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
