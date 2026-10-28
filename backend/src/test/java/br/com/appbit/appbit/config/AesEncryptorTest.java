package br.com.appbit.appbit.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class AesEncryptorTest {

    private final AesEncryptor encryptor = new AesEncryptor();

    @Test
    @DisplayName("Deve criptografar e descriptografar texto plano com sucesso (Roundtrip)")
    void deveCriptografarEDescriptografarComSucesso() {
        String textoOriginal = "Maria Silva Santos";
        String cifrado = encryptor.convertToDatabaseColumn(textoOriginal);

        assertNotNull(cifrado);
        assertNotEquals(textoOriginal, cifrado);
        assertDoesNotThrow(() -> Base64.getDecoder().decode(cifrado));

        String decifrado = encryptor.convertToEntityAttribute(cifrado);
        assertEquals(textoOriginal, decifrado);
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
    @DisplayName("Deve retornar o próprio texto plano como fallback para dados legados não criptografados")
    void deveManterFallbackParaDadosLegadosTextoClaro() {
        String dadoLegado = "Ana Souza";
        String resultado = encryptor.convertToEntityAttribute(dadoLegado);

        assertEquals(dadoLegado, resultado);
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

