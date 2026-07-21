package br.com.appbit.appbit.config;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import static org.junit.jupiter.api.Assertions.*;

class HttpCookieOAuth2AuthorizationRequestRepositoryTest {

    private HttpCookieOAuth2AuthorizationRequestRepository repository;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        repository = new HttpCookieOAuth2AuthorizationRequestRepository();
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    @Test
    void shouldSaveAndLoadAuthorizationRequestFromCookie() {
        OAuth2AuthorizationRequest authRequest = OAuth2AuthorizationRequest.authorizationCode()
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .clientId("test-client-id")
                .redirectUri("http://localhost:8080/login/oauth2/code/google")
                .state("test-state")
                .build();

        repository.saveAuthorizationRequest(authRequest, request, response);

        Cookie cookie = response.getCookie(HttpCookieOAuth2AuthorizationRequestRepository.OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME);
        assertNotNull(cookie, "O cookie com a requisição de autorização deve ser criado");

        request.setCookies(cookie);

        OAuth2AuthorizationRequest loaded = repository.loadAuthorizationRequest(request);
        assertNotNull(loaded, "A requisição deve ser carregada a partir do cookie");
        assertEquals("test-client-id", loaded.getClientId());
        assertEquals("test-state", loaded.getState());
    }

    @Test
    void shouldRemoveAuthorizationRequestCookies() {
        request.setCookies(new Cookie(HttpCookieOAuth2AuthorizationRequestRepository.OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME, "dummy"));

        repository.removeAuthorizationRequestCookies(request, response);

        Cookie cookie = response.getCookie(HttpCookieOAuth2AuthorizationRequestRepository.OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME);
        assertNotNull(cookie, "O cookie de remoção deve estar presente na resposta");
        assertEquals(0, cookie.getMaxAge(), "O maxAge do cookie de remoção deve ser 0");
    }
}
