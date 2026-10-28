package br.com.appbit.appbit.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class AesEncryptorTest {

    private static final String TEST_KEY = "appbit-unit-test-encryption-key-2026";
    private final AesEncryptor encryptor = new AesEncryptor(TEST_KEY);

    @Test
    @DisplayName("Deve criptografar e descriptografar texto plano com sucesso (Roundtrip)")
    void deveCriptografarEDescriptografarComSucesso() {
        String textoOriginal = "Maria Silva Santos";
        String cifrado = encryptor.convertToDatabaseColumn(textoOriginal);

        assertNotNull(cifrado);
        assertNotEquals(textoOriginal, cifrado);
        assertTrue(cifrado.startsWith("v1:"));
        assertDoesNotThrow(() -> Base64.getDecoder().decode(cifrado.substring(3)));

        String decifrado = encryptor.convertToEntityAttribute(cifrado);
        assertEquals(textoOriginal, decifrado);
    }

    @Test
    @DisplayName("Deve usar nonce diferente para cada criptografia")
    void deveGerarCiphertextDiferenteParaMesmoTexto() {
        String first = encryptor.convertToDatabaseColumn("mesmo dado");
        String second = encryptor.convertToDatabaseColumn("mesmo dado");

        assertNotEquals(first, second);
        assertEquals("mesmo dado", encryptor.convertToEntityAttribute(first));
        assertEquals("mesmo dado", encryptor.convertToEntityAttribute(second));
    }

    @Test
    @DisplayName("Deve proteger dados pessoais sensíveis (CPF, Email, Telefone) em repouso")
    void deveCriptografarDadosPessoaisSensiveisLgpd() {
        String cpf = "123.456.789-00";
        String email = "candidato.teste@appbit.com.br";
        String telefone = "+55 (48) 99888-7766";

        String cpfCifrado = encryptor.convertToDatabaseColumn(cpf);
        String emailCifrado = encryptor.convertToDatabaseColumn(email);
        String telefoneCifrado = encryptor.convertToDatabaseColumn(telefone);

        assertFalse(cpfCifrado.contains("123.456.789-00"));
        assertFalse(emailCifrado.contains("candidato.teste"));
        assertFalse(telefoneCifrado.contains("99888-7766"));

        assertEquals(cpf, encryptor.convertToEntityAttribute(cpfCifrado));
        assertEquals(email, encryptor.convertToEntityAttribute(emailCifrado));
        assertEquals(telefone, encryptor.convertToEntityAttribute(telefoneCifrado));
    }

    @Test
    @DisplayName("Deve retornar nulo ou em branco quando atributo for nulo ou vazio")
    void deveTratarNuloEVazio() {
        assertNull(encryptor.convertToDatabaseColumn(null));
        assertNull(encryptor.convertToEntityAttribute(null));
        assertEquals("", encryptor.convertToDatabaseColumn(""));
        assertEquals("   ", encryptor.convertToEntityAttribute("   "));
    }

    @Test
    @DisplayName("Deve manter compatibilidade de leitura com texto plano legado")
    void deveManterFallbackParaDadosLegadosTextoClaro() {
        String dadoLegado = "Ana Souza";
        String resultado = encryptor.convertToEntityAttribute(dadoLegado);

        assertEquals(dadoLegado, resultado);
    }

    @Test
    @DisplayName("Deve descriptografar valores legados com o formato AES anterior")
    void deveLerCifraLegada() throws Exception {
        byte[] keyBytes = TEST_KEY.getBytes(StandardCharsets.UTF_8);
        byte[] legacyKey = new byte[32];
        System.arraycopy(keyBytes, 0, legacyKey, 0, Math.min(keyBytes.length, legacyKey.length));
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(legacyKey, "AES"));
        String legacyCiphertext = Base64.getEncoder().encodeToString(
                cipher.doFinal("Dado legado".getBytes(StandardCharsets.UTF_8))
        );

        assertEquals("Dado legado", encryptor.convertToEntityAttribute(legacyCiphertext));
    }

    @Test
    @DisplayName("Deve rejeitar ciphertext adulterado e chaves fracas")
    void deveRejeitarCiphertextAdulteradoEChaveFraca() {
        String ciphertext = encryptor.convertToDatabaseColumn("dado protegido");
        String firstPayloadCharacter = ciphertext.substring(3, 4);
        String replacement = firstPayloadCharacter.equals("A") ? "B" : "A";
        String tampered = "v1:" + replacement + ciphertext.substring(4);

        assertThrows(IllegalStateException.class, () -> encryptor.convertToEntityAttribute(tampered));
        assertThrows(IllegalArgumentException.class, () -> new AesEncryptor("chave-fraca"));
    }

    @Test
    @DisplayName("Deve permitir inicialização com chave mestra customizada")
    void deveSuportarChaveCustomizada() {
        AesEncryptor customEncryptor = new AesEncryptor("MinhaChaveMestraSeguraCorporativa2026!");
        String texto = "Segredo Corporativo 123";

        String cifrado = customEncryptor.convertToDatabaseColumn(texto);
        String decifrado = customEncryptor.convertToEntityAttribute(cifrado);

        assertEquals(texto, decifrado);
    }
}
