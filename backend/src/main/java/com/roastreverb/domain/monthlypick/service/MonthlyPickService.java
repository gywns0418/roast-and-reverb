package com.roastreverb.domain.monthlypick.service;

import com.roastreverb.domain.monthlypick.mapper.MonthlyPickMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 월간 커피 픽(예: unspecialty 월픽)의 원두 옵션을 붙여넣으면
 * 사용자 취향 규칙(taste_rule)에 따라 1차 필터링/점수를 매기는 서비스.
 * 상품명(raw_text) + origin/producer/variety/process 문자열을 합친 테스트에서
 * 키워드만 매칭하는 규칙 기반 1차 필터링이다 — 실제 컵노트(맛)는 반영되지 않는다.
 */
@Service
public class MonthlyPickService {
    private static final String DARK_ROAST_REASON = "다크 로스팅은 구매 시 배제";
    private static final String DECAF_REASON = "디카페인은 비선호 — 기본으로 추천에서 제외";

    private static final List<String> DARK_ROAST_KEYWORDS = List.of("다크 로스트", "다크 로스팅", "다크로스트");
    private static final List<String> DECAF_KEYWORDS = List.of("디카페인", "decaf");
    private static final List<String> SOLD_OUT_KEYWORDS = List.of("품절", "sold out");

    private final MonthlyPickMapper monthlyPickMapper;

    public MonthlyPickService(MonthlyPickMapper monthlyPickMapper) {
        this.monthlyPickMapper = monthlyPickMapper;
    }

    public List<Map<String, Object>> findAll(Long memberId) {
        return monthlyPickMapper.findAllPicks(memberId);
    }

    public Map<String, Object> findById(Long memberId, Long monthlyPickId) {
        Map<String, Object> pick = monthlyPickMapper.findPickById(monthlyPickId, memberId);
        if (pick == null) {
            return null;
        }
        pick.put("options", monthlyPickMapper.findOptionsByPick(monthlyPickId));
        return pick;
    }

    /**
     * 새 월픽을 만들고(rawOptionsText를 줄별로 분리해 옵션으로 저장), 바로 점수까지 계산해 반환한다.
     */
    public Map<String, Object> create(Long memberId, String month, String roastery, String sourceUrl, String rawOptionsText) {
        Map<String, Object> pick = new LinkedHashMap<>();
        pick.put("memberId", memberId);
        pick.put("pickMonth", month);
        pick.put("roastery", roastery);
        pick.put("sourceUrl", sourceUrl);
        monthlyPickMapper.insertPick(pick);
        Long monthlyPickId = ((Number) pick.get("monthlyPickId")).longValue();

        for (String line : splitLines(rawOptionsText)) {
            Map<String, Object> option = new LinkedHashMap<>();
            option.put("monthlyPickId", monthlyPickId);
            option.put("rawText", line);
            option.put("origin", null);
            option.put("producer", null);
            option.put("variety", null);
            option.put("process", null);
            option.put("darkRoast", containsAny(line, DARK_ROAST_KEYWORDS));
            option.put("decaf", containsAny(line, DECAF_KEYWORDS));
            option.put("soldOut", containsAny(line, SOLD_OUT_KEYWORDS));
            option.put("alreadyPurchased", false);
            monthlyPickMapper.insertOption(option);
        }

        score(memberId, monthlyPickId);
        return findById(memberId, monthlyPickId);
    }

    /**
     * 저장된 taste_rule을 기준으로 각 옵션의 점수/근거를 다시 계산해 저장한다.
     */
    public List<Map<String, Object>> score(Long memberId, Long monthlyPickId) {
        List<Map<String, Object>> tasteRules = monthlyPickMapper.findTasteRules(memberId);
        List<Map<String, Object>> options = monthlyPickMapper.findOptionsByPick(monthlyPickId);

        for (Map<String, Object> option : options) {
            boolean darkRoast = Boolean.TRUE.equals(option.get("dark_roast"));
            boolean decaf = Boolean.TRUE.equals(option.get("decaf"));

            Integer score;
            String reason;
            if (darkRoast || decaf) {
                score = null;
                reason = darkRoast ? DARK_ROAST_REASON : DECAF_REASON;
            } else {
                String text = combinedText(option);
                int total = 0;
                List<String> hits = new ArrayList<>();
                for (Map<String, Object> rule : tasteRules) {
                    for (String keyword : String.valueOf(rule.get("match_keywords")).split(",")) {
                        if (!keyword.isBlank() && text.contains(keyword.trim().toLowerCase())) {
                            int weight = ((Number) rule.get("weight")).intValue();
                            total += weight;
                            hits.add(rule.get("tag") + "(" + keyword.trim() + "):" + (weight >= 0 ? "+" : "") + weight);
                            break;
                        }
                    }
                }
                score = normalize(total);
                reason = hits.isEmpty() ? null : String.join("; ", hits);
            }

            Long optionId = ((Number) option.get("option_id")).longValue();
            monthlyPickMapper.updateOptionScore(optionId, score, reason);
        }

        return monthlyPickMapper.findOptionsByPick(monthlyPickId);
    }

    /**
     * 규칙 가중치 합계(raw)를 0~10 점수로 표준화한다.
     * 중립(매칭 없음) = 5점 기준으로 양/음 신호가 그만큼 가감/감점되고, 0~10 범위를 벗어나면 자른다.
     */
    private static int normalize(int rawTotal) {
        return Math.max(0, Math.min(10, rawTotal + 5));
    }

    private static String combinedText(Map<String, Object> option) {
        StringBuilder sb = new StringBuilder();
        for (String key : List.of("raw_text", "origin", "producer", "variety", "process")) {
            Object value = option.get(key);
            if (value != null) {
                sb.append(value).append(' ');
            }
        }
        return sb.toString().toLowerCase();
    }

    private static boolean containsAny(String text, List<String> keywords) {
        String lower = text.toLowerCase();
        return keywords.stream().anyMatch(k -> lower.contains(k.toLowerCase()));
    }

    private static List<String> splitLines(String rawOptionsText) {
        List<String> lines = new ArrayList<>();
        if (rawOptionsText == null) {
            return lines;
        }
        for (String line : rawOptionsText.split("\\r?\\n")) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty()) {
                lines.add(trimmed);
            }
        }
        return lines;
    }
}
