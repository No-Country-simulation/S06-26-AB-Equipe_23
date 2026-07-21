package br.com.appbit.appbit.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthConfigController {

    @Value("${spring.security.oauth2.client.registration.google.client-id:disabled}")
    private String googleClientId;

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getAuthConfig() {
        boolean googleEnabled = googleClientId != null
                && !googleClientId.isBlank()
                && !googleClientId.equals("disabled");
        return ResponseEntity.ok(Map.of("googleOAuth2Enabled", googleEnabled));
    }
}
