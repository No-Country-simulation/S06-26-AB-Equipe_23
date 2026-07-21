package br.com.appbit.appbit.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthConfigController {

    private final Environment environment;

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getAuthConfig() {
        String googleClientId = environment.getProperty("GOOGLE_CLIENT_ID");
        if (googleClientId == null || googleClientId.isBlank()) {
            googleClientId = environment.getProperty("spring.security.oauth2.client.registration.google.client-id", "disabled");
        }
        boolean googleEnabled = googleClientId != null
                && !googleClientId.isBlank()
                && !googleClientId.equals("disabled");
        return ResponseEntity.ok(Map.of("googleOAuth2Enabled", googleEnabled));
    }
}
