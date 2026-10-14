package com.roastreverb.domain.pairing.service;

import com.roastreverb.domain.external.service.ExternalApiLogService;
import com.roastreverb.domain.pairing.mapper.PairingMapper;
import com.roastreverb.global.security.SecurityUtil;
import org.springframework.stereotype.Service;
import com.roastreverb.global.exception.CustomException;
import org.springframework.http.HttpStatus;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PairingService {
    private final PairingMapper pairingMapper;
    private final ClaudeService claudeService;
    private final ExternalApiLogService externalApiLogService;

    public PairingService(PairingMapper pairingMapper, ClaudeService claudeService, ExternalApiLogService externalApiLogService) {
        this.pairingMapper = pairingMapper;
        this.claudeService = claudeService;
        this.externalApiLogService = externalApiLogService;
    }

    public List<Map<String, Object>> findAll(Long memberId, int limit, int offset) {
        return pairingMapper.findAll(memberId, limit, offset);
    }

    public Map<String, Object> findById(Long memberId, Long pairingId) {
        var record = pairingMapper.findById(pairingId, memberId);
        if (record == null) throw new CustomException(HttpStatus.NOT_FOUND, "기록을 찾을 수 없습니다.");
        return record;
    }

    public Map<String, Object> findLatest(Long memberId) {
        return pairingMapper.findLatest(memberId);
    }

    public Map<String, Object> create(Map<String, Object> pairing) {
        if (pairingMapper.insert(pairing) != 1) throw new CustomException(HttpStatus.BAD_REQUEST, "본인의 커피와 음악 기록을 선택해 주세요.");
        return pairing;
    }

    public int delete(Long memberId, Long pairingId) {
        return pairingMapper.delete(pairingId, memberId);
    }

    public List<Map<String, Object>> findRecentCrate(Long memberId, int limit) {
        return pairingMapper.findRecentCrate(memberId, limit);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> analyze(Map<String, Object> request) {
        if (claudeService.isEnabled()) {
            try {
                Map<String, Object> coffee = (Map<String, Object>) request.getOrDefault("coffee", Map.of());
                Map<String, Object> music = (Map<String, Object>) request.getOrDefault("music", Map.of());
                Map<String, Object> result = claudeService.analyzePairing(coffee, music);
                logClaudeCall("PAIRING_ANALYSIS", true, null);
                return result;
            } catch (Exception e) {
                logClaudeCall("PAIRING_ANALYSIS", false, e.getMessage());
            }
        }
        throw new CustomException(HttpStatus.SERVICE_UNAVAILABLE, "AI 분석을 사용할 수 없습니다. 서버 API 키와 연결 상태를 확인해 주세요.");
    }

    public Map<String, Object> parseNaturalLog(Map<String, Object> request) {
        if (claudeService.isEnabled()) {
            try {
                String text = String.valueOf(request.getOrDefault("text", ""));
                Map<String, Object> result = claudeService.parseNaturalLog(text);
                logClaudeCall("NATURAL_LOG_PARSE", true, null);
                return result;
            } catch (Exception e) {
                logClaudeCall("NATURAL_LOG_PARSE", false, e.getMessage());
            }
        }
        throw new CustomException(HttpStatus.SERVICE_UNAVAILABLE, "자연어 분석을 사용할 수 없습니다. 직접 기록하거나 나중에 다시 시도해 주세요.");
    }

    private Map<String, Object> heuristicAnalyze(Map<String, Object> request) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("moodSummary", valueOrDefault(request, "moodSummary", "조용한 기록에서 이어지는 페어링"));
        result.put("moodTags", valueOrDefault(request, "moodTags", "차분함,집중"));
        result.put("pairingScore", valueOrDefault(request, "pairingScore", 88));
        result.put("pairingText", valueOrDefault(request, "pairingText", "커피의 향과 음악의 질감이 차분하게 겹칩니다."));
        result.put("aiReason", valueOrDefault(request, "aiReason", "맛 노트와 음악 태그의 공통 무드를 기준으로 계산했습니다. (CLAUDE_API_KEY 미설정 — 예시 분석입니다)"));
        return result;
    }

    private Map<String, Object> heuristicParseNaturalLog(Map<String, Object> request) {
        Map<String, Object> coffee = new LinkedHashMap<>();
        coffee.put("beanName", valueOrDefault(request, "beanName", "에티오피아 예가체프"));
        coffee.put("brewMethod", valueOrDefault(request, "brewMethod", "핸드드립"));
        coffee.put("tasteNote", valueOrDefault(request, "tasteNote", "재스민 향, 레몬 같은 산미"));

        Map<String, Object> music = new LinkedHashMap<>();
        music.put("trackName", valueOrDefault(request, "trackName", "Svefn-g-englar"));
        music.put("artistName", valueOrDefault(request, "artistName", "Sigur Ros"));
        music.put("genre", valueOrDefault(request, "genre", "Post-rock"));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("coffee", coffee);
        result.put("music", music);
        return result;
    }

    private void logClaudeCall(String endpoint, boolean success, String errorMessage) {
        Map<String, Object> log = new LinkedHashMap<>();
        log.put("memberId", SecurityUtil.currentMemberId(1L));
        log.put("provider", "Claude");
        log.put("endpoint", endpoint);
        log.put("requestSummary", endpoint);
        log.put("responseStatus", success ? 200 : 500);
        log.put("success", success);
        log.put("errorMessage", errorMessage);
        try {
            externalApiLogService.create(log);
        } catch (Exception ignored) {
            // logging must never break the actual pairing feature
        }
    }

    private Object valueOrDefault(Map<String, Object> source, String key, Object defaultValue) {
        Object value = source.get(key);
        return value == null ? defaultValue : value;
    }
}
