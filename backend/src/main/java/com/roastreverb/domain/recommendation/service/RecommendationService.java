package com.roastreverb.domain.recommendation.service;

import com.roastreverb.domain.recommendation.mapper.RecommendationMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {
    private final RecommendationMapper recommendationMapper;

    public RecommendationService(RecommendationMapper recommendationMapper) {
        this.recommendationMapper = recommendationMapper;
    }

    public List<Map<String, Object>> findAll(Long memberId, String direction, int limit) {
        return recommendationMapper.findAll(memberId, direction, limit);
    }

    public Map<String, Object> create(Map<String, Object> recommendation) {
        recommendationMapper.insert(recommendation);
        return recommendation;
    }

    public int delete(Long memberId, Long recommendationId) {
        return recommendationMapper.delete(recommendationId, memberId);
    }
}
