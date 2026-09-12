package com.roastreverb.domain.pairing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClaudeService {
    private static final String API_URL = "https://api.anthropic.com/v1/messages";
    private static final String ANTHROPIC_VERSION = "2023-06-01";

    @Value("${app.claude.api-key:}")
    private String apiKey;

    @Value("${app.claude.model:claude-3-5-haiku-20241022}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isEnabled() {
        return apiKey != null && !apiKey.isBlank();
    }

    public Map<String, Object> analyzePairing(Map<String, Object> coffee, Map<String, Object> music) {
        String prompt = """
                당신은 커피와 음악의 감각적 페어링을 분석하는 전문가입니다.
                아래 커피 기록과 음악 기록을 분석해서 JSON 오브젝트로만 답하세요. 그 외 설명은 절대 포함하지 마세요.
                커피 기록: %s
                음악 기록: %s
                JSON 형식: {"moodSummary": "짧은 무드 요약", "moodTags": "쉼표로 구분된 무드 태그", "pairingScore": 0에서 100 사이 정수, "pairingText": "페어링 설명 한 두 문장", "aiReason": "분석 근거 한 두 문장"}
                """.formatted(coffee, music);
        return callClaude(prompt);
    }

    public Map<String, Object> parseNaturalLog(String text) {
        String prompt = """
                아래 문장에서 커피 정보와 음악 정보를 추출해서 JSON 오브젝트로만 답하세요. 그 외 설명은 절대 포함하지 마세요.
                문장: %s
                JSON 형식: {"coffee": {"beanName": string, "brewMethod": string, "roastLevel": string, "tasteNote": string, "memo": string}, "music": {"trackName": string, "artistName": string, "genre": string, "tags": string, "memo": string}}
                """.formatted(text);
        return callClaude(prompt);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callClaude(String prompt) {
        if (!isEnabled()) {
            throw new IllegalStateException("CLAUDE_API_KEY가 설정되지 않았습니다.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", ANTHROPIC_VERSION);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("max_tokens", 1024);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        try {
            var response = restTemplate.exchange(API_URL, HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("content").path(0).path("text").asText("");
            return objectMapper.readValue(extractJson(text), Map.class);
        } catch (Exception e) {
            throw new IllegalStateException("Claude 분석 요청에 실패했습니다.", e);
        }
    }

    private String extractJson(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start == -1 || end == -1 || end < start) {
            throw new IllegalStateException("Claude 응답에서 JSON을 찾지 못했습니다.");
        }
        return text.substring(start, end + 1);
    }
}
