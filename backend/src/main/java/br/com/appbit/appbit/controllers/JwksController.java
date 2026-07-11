package br.com.appbit.appbit.controllers;

import br.com.appbit.appbit.config.JwtUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
public class JwksController {

    private final JwtUtil jwtUtil;

    public JwksController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> getJwks() {
        RSAPublicKey pubKey = jwtUtil.getPublicKey();
        
        String n = Base64.getUrlEncoder().withoutPadding().encodeToString(pubKey.getModulus().toByteArray());
        String e = Base64.getUrlEncoder().withoutPadding().encodeToString(pubKey.getPublicExponent().toByteArray());

        Map<String, Object> jwk = Map.of(
                "kty", "RSA",
                "use", "sig",
                "alg", "RS256",
                "kid", jwtUtil.getKeyId(),
                "n", n,
                "e", e
        );

        return Map.of("keys", List.of(jwk));
    }
}
