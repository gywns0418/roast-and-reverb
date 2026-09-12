package com.roastreverb.domain.music.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DiscogsService {
    private static final String API_URL = "https://api.discogs.com/database/search";

    @Value("${app.discogs.token:}")
    private String token;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isEnabled() {
        return token != null && !token.isBlank();
    }

    public List<Map<String, Object>> searchRelease(String keyword) {
        if (!isEnabled() || keyword == null || keyword.isBlank()) {
            return List.of();
        }
        String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                .queryParam("q", keyword)
                .queryParam("type", "release")
                .queryParam("token", token)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "RoastAndReverb/0.1");

        try {
            var response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), String.class);
            JsonNode results = objectMapper.readTree(response.getBody()).path("results");
            List<Map<String, Object>> items = new ArrayList<>();
            for (JsonNode result : results) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("title", result.path("title").asText(""));
                item.put("format", result.path("format").isArray() && result.path("format").size() > 0
                        ? result.path("format").get(0).asText("") : "");
                item.put("year", result.path("year").asText(""));
                item.put("discogsReleaseId", result.path("id").asText(""));
                item.put("coverImageUrl", result.path("cover_image").asText(""));
                items.add(item);
            }
            return items;
        } catch (Exception e) {
            return List.of();
        }
    }
}
