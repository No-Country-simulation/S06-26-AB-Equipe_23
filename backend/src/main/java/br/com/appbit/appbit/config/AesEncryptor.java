package br.com.appbit.appbit.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Converter
public class AesEncryptor implements AttributeConverter<String, String> {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final String LEGACY_ALGORITHM = "AES";
    private static final String VERSION_PREFIX = "v1:";
    // Used only to read records encrypted by the original converter without a configured key.
    private static final String LEGACY_DEFAULT_KEY = "AppbitSecretKeyLGPDEncryption32c";
    private static final int KEY_LENGTH_BYTES = 32;
    private static final int NONCE_LENGTH_BYTES = 12;
    private static final int TAG_LENGTH_BITS = 128;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final SecretKeySpec keySpec;
    private final SecretKeySpec legacyKeySpec;

    public AesEncryptor() {
        this(resolveMasterKey());
    }

    public AesEncryptor(String key) {
        if (key == null || key.isBlank() || key.length() < KEY_LENGTH_BYTES) {
            throw new IllegalArgumentException("ENCRYPTION_KEY deve ter pelo menos 32 caracteres.");
        }

        this.keySpec = new SecretKeySpec(sha256(key), "AES");
        this.legacyKeySpec = new SecretKeySpec(normalizeLegacyKey(key), "AES");
    }

    private static String resolveMasterKey() {
        String keyEnv = System.getenv("ENCRYPTION_KEY");
        if (keyEnv == null || keyEnv.isBlank()) {
            keyEnv = System.getenv("APPBIT_CRYPTO_KEY");
        }
        if (keyEnv == null || keyEnv.isBlank()) {
            keyEnv = System.getProperty("appbit.encryption.key");
        }
        if (keyEnv == null || keyEnv.isBlank()) {
            throw new IllegalStateException(
                    "ENCRYPTION_KEY não configurada. Defina uma chave aleatória de pelo menos 32 caracteres."
            );
        }
        return keyEnv;
    }

    private static byte[] sha256(String key) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(key.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao derivar a chave AES-256.", e);
        }
    }

    private static byte[] normalizeLegacyKey(String key) {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        byte[] normalized = new byte[KEY_LENGTH_BYTES];
        System.arraycopy(keyBytes, 0, normalized, 0, Math.min(keyBytes.length, KEY_LENGTH_BYTES));
        return normalized;
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isBlank()) {
            return attribute;
        }
        try {
            byte[] nonce = new byte[NONCE_LENGTH_BYTES];
            SECURE_RANDOM.nextBytes(nonce);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, new GCMParameterSpec(TAG_LENGTH_BITS, nonce));
            byte[] encrypted = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));
            byte[] payload = new byte[nonce.length + encrypted.length];
            System.arraycopy(nonce, 0, payload, 0, nonce.length);
            System.arraycopy(encrypted, 0, payload, nonce.length, encrypted.length);
            return VERSION_PREFIX + Base64.getEncoder().encodeToString(payload);
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao criptografar dados para o banco.", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return dbData;
        }
        if (!dbData.startsWith(VERSION_PREFIX)) {
            return decryptLegacyOrReturnPlaintext(dbData);
        }

        try {
            byte[] payload = Base64.getDecoder().decode(dbData.substring(VERSION_PREFIX.length()));
            if (payload.length <= NONCE_LENGTH_BYTES) {
                throw new IllegalArgumentException("Payload AES-GCM inválido.");
            }
            byte[] nonce = new byte[NONCE_LENGTH_BYTES];
            byte[] encrypted = new byte[payload.length - NONCE_LENGTH_BYTES];
            System.arraycopy(payload, 0, nonce, 0, nonce.length);
            System.arraycopy(payload, nonce.length, encrypted, 0, encrypted.length);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, new GCMParameterSpec(TAG_LENGTH_BITS, nonce));
            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Falha ao descriptografar dado protegido; verifique a chave ENCRYPTION_KEY.",
                    e
            );
        }
    }

    private String decryptLegacyOrReturnPlaintext(String dbData) {
        byte[] payload;
        try {
            payload = Base64.getDecoder().decode(dbData);
        } catch (IllegalArgumentException e) {
            return dbData;
        }

        if (payload.length == 0 || payload.length % 16 != 0) {
            return dbData;
        }

        SecretKeySpec[] candidateKeys = {
                legacyKeySpec,
                new SecretKeySpec(normalizeLegacyKey(LEGACY_DEFAULT_KEY), "AES")
        };
        Exception decryptionFailure = null;
        for (SecretKeySpec candidateKey : candidateKeys) {
            try {
                Cipher cipher = Cipher.getInstance(LEGACY_ALGORITHM);
                cipher.init(Cipher.DECRYPT_MODE, candidateKey);
                return new String(cipher.doFinal(payload), StandardCharsets.UTF_8);
            } catch (Exception e) {
                if (decryptionFailure != null) {
                    e.addSuppressed(decryptionFailure);
                }
                decryptionFailure = e;
            }
        }

        throw new IllegalStateException(
                "Dado criptografado legado não pôde ser lido; verifique se a chave anterior está disponível.",
                decryptionFailure
        );
    }
}
