package br.com.appbit.appbit.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(properties = "logging.structured.format.console=logstash")
@ActiveProfiles("test")
class LoggingValidationTest {

    @Autowired
    private Environment environment;

    @Test
    void applicationShouldStartWithStructuredLoggingJsonEnabled() {
        assertNotNull(environment);
        String format = environment.getProperty("logging.structured.format.console");
        assertEquals("logstash", format);
    }
}
