package com.roastreverb.domain.monthlypick.controller;

import com.roastreverb.domain.monthlypick.service.MonthlyPickService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/monthly-picks")
public class MonthlyPickController {
    private final MonthlyPickService monthlyPickService;

    public MonthlyPickController(MonthlyPickService monthlyPickService) {
        this.monthlyPickService = monthlyPickService;
    }

    @GetMapping
    public ApiResponse<?> findAll(@RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(monthlyPickService.findAll(memberId));
    }

    @GetMapping("/{monthlyPickId}")
    public ApiResponse<?> findById(@PathVariable Long monthlyPickId,
                                   @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(monthlyPickService.findById(memberId, monthlyPickId));
    }

    @PostMapping
    public ApiResponse<?> create(@RequestParam(defaultValue = "1") Long memberId,
                                 @RequestBody Map<String, Object> request) {
        String month = String.valueOf(request.get("month"));
        String roastery = String.valueOf(request.get("roastery"));
        String sourceUrl = request.get("sourceUrl") == null ? null : String.valueOf(request.get("sourceUrl"));
        String rawOptionsText = String.valueOf(request.get("rawOptionsText"));
        return ApiResponse.ok(monthlyPickService.create(memberId, month, roastery, sourceUrl, rawOptionsText));
    }

    @PostMapping("/{monthlyPickId}/score")
    public ApiResponse<?> score(@PathVariable Long monthlyPickId,
                                @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(monthlyPickService.score(memberId, monthlyPickId));
    }
}
