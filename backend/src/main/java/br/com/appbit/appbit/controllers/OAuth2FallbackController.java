package br.com.appbit.appbit.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class OAuth2FallbackController {

    @Value("${spring.security.oauth2.client.registration.google.client-id:disabled}")
    private String googleClientId;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @GetMapping("/oauth2/authorization/{provider}")
    public RedirectView handleDisabledOAuth2(@PathVariable String provider) {
        boolean oauth2Enabled = googleClientId != null
                && !googleClientId.isBlank()
                && !googleClientId.equals("disabled");

        if (!oauth2Enabled) {
            return new RedirectView(frontendUrl + "/login?error=oauth2_disabled");
        }
        return new RedirectView(frontendUrl + "/login?error=oauth2_error");
    }
}
