package com.roastreverb.domain.music.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class LastfmService {
    private static final String API_URL = "https://ws.audioscrobbler.com/2.0/";

    @Value("${app.lastfm.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isEnabled() {
        return apiKey != null && !apiKey.isBlank();
    }

    public List<Map<String, Object>> searchTrack(String keyword) {
        if (!isEnabled() || keyword == null || keyword.isBlank()) {
            return List.of();
        }
        String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                .queryParam("method", "track.search")
                .queryParam("track", keyword)
                .queryParam("api_key", apiKey)
                .queryParam("format", "json")
                .queryParam("limit", 10)
                .toUriString();
        try {
            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            JsonNode tracks = root.path("results").path("trackmatches").path("track");
            List<Map<String, Object>> results = new ArrayList<>();
            for (JsonNode track : tracks) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("trackName", track.path("name").asText(""));
                item.put("artistName", track.path("artist").asText(""));
                item.put("lastfmTrackUrl", track.path("url").asText(""));
                results.add(item);
            }
            return results;
        } catch (Exception e) {
            return List.of();
        }
    }
}
