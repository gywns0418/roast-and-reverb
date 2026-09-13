package com.roastreverb.domain.external.controller;

import com.roastreverb.domain.external.service.ExternalApiLogService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/external-api-logs")
public class ExternalApiController {
    private final ExternalApiLogService externalApiLogService;

    public ExternalApiController(ExternalApiLogService externalApiLogService) {
        this.externalApiLogService = externalApiLogService;
    }

    @GetMapping
    public ApiResponse<?> findAll(@RequestParam(required = false) Long memberId,
                                  @RequestParam(required = false) String provider,
                                  @RequestParam(required = false) Boolean success,
                                  @RequestParam(defaultValue = "50") int limit,
                                  @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(externalApiLogService.findAll(memberId, provider, success, limit, offset));
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody Map<String, Object> apiLog) {
        return ApiResponse.ok(externalApiLogService.create(apiLog));
    }
}
