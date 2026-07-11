package br.com.appbit.appbit.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Converter
public class AesEncryptor implements AttributeConverter<String, String> {

    private static final String DEFAULT_KEY = "AppbitSecretKeyLGPDEncryption32c"; 
    private static final String ALGORITHM = "AES";
    
    private final SecretKeySpec keySpec;

    public AesEncryptor() {
        String keyEnv = System.getenv("APPBIT_CRYPTO_KEY");
        String key = (keyEnv != null && keyEnv.length() >= 16) ? keyEnv : DEFAULT_KEY;
        
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        byte[] finalKeyBytes = new byte[32]; // AES-256
        System.arraycopy(keyBytes, 0, finalKeyBytes, 0, Math.min(keyBytes.length, 32));
        
        this.keySpec = new SecretKeySpec(finalKeyBytes, ALGORITHM);
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isBlank()) {
            return attribute;
        }
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao criptografar dados para o banco: " + e.getMessage(), e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return dbData;
        }
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(dbData));
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            // Fallback resiliente para dados históricos gravados em texto claro
            return dbData;
        }
    }
}
