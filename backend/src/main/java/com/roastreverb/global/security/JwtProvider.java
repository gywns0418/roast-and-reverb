package com.roastreverb.global.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class JwtProvider {
    private static final String ALGORITHM = "HmacSHA256";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long expirationMs;

    public String generateToken(Long memberId, String email, String role) {
        long now = Instant.now().toEpochMilli();
        Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", String.valueOf(memberId));
        payload.put("email", email);
        payload.put("role", role);
        payload.put("iat", now);
        payload.put("exp", now + expirationMs);

        String headerPart = encode(header);
        String payloadPart = encode(payload);
        String signingInput = headerPart + "." + payloadPart;
        return signingInput + "." + sign(signingInput);
    }

    public Map<String, Object> parseToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("잘못된 토큰 형식입니다.");
        }
        String signingInput = parts[0] + "." + parts[1];
        if (!sign(signingInput).equals(parts[2])) {
            throw new IllegalArgumentException("토큰 서명이 유효하지 않습니다.");
        }
        Map<String, Object> payload = decode(parts[1]);
        long exp = ((Number) payload.get("exp")).longValue();
        if (Instant.now().toEpochMilli() > exp) {
            throw new IllegalArgumentException("토큰이 만료되었습니다.");
        }
        return payload;
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), ALGORITHM));
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
        } catch (Exception e) {
            throw new IllegalStateException("토큰 서명에 실패했습니다.", e);
        }
    }

    private String encode(Map<String, Object> map) {
        try {
            return Base64.getUrlEncoder().withoutPadding().encodeToString(objectMapper.writeValueAsBytes(map));
        } catch (Exception e) {
            throw new IllegalStateException("토큰 인코딩에 실패했습니다.", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> decode(String part) {
        try {
            return objectMapper.readValue(Base64.getUrlDecoder().decode(part), Map.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("토큰 디코딩에 실패했습니다.", e);
        }
    }
}
