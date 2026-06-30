package br.com.appbit.appbit;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
	"spring.sql.init.mode=never",
	"spring.sql.init.enabled=false"
})
class AppbitApplicationTests {

	@Test
	void contextLoads() {
	}

}
