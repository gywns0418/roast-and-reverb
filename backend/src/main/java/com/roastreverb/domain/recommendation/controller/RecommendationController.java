package com.roastreverb.domain.recommendation.controller;

import com.roastreverb.domain.recommendation.service.RecommendationService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/recommendations", "/api/recommend"})
public class RecommendationController {
    private static final Long DEFAULT_MEMBER_ID = 1L;

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ApiResponse<?> findAll(@RequestParam(defaultValue = "1") Long memberId,
                                  @RequestParam(required = false) String direction,
                                  @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.ok(recommendationService.findAll(memberId, direction, limit));
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody Map<String, Object> recommendation) {
        recommendation.putIfAbsent("memberId", DEFAULT_MEMBER_ID);
        return ApiResponse.ok(recommendationService.create(recommendation));
    }

    @DeleteMapping("/{recommendationId}")
    public ApiResponse<?> delete(@PathVariable Long recommendationId,
                                 @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(Map.of("deleted", recommendationService.delete(memberId, recommendationId)));
    }
}
