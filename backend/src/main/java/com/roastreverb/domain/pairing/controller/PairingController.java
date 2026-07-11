package com.roastreverb.domain.pairing.controller;

import com.roastreverb.domain.pairing.service.PairingService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/pairings", "/api/pairing"})
public class PairingController {
    private static final Long DEFAULT_MEMBER_ID = 1L;

    private final PairingService pairingService;

    public PairingController(PairingService pairingService) {
        this.pairingService = pairingService;
    }

    @GetMapping
    public ApiResponse<?> findAll(@RequestParam(defaultValue = "1") Long memberId,
                                  @RequestParam(defaultValue = "30") int limit,
                                  @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(pairingService.findAll(memberId, limit, offset));
    }

    @GetMapping("/{pairingId}")
    public ApiResponse<?> findById(@PathVariable Long pairingId,
                                   @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(pairingService.findById(memberId, pairingId));
    }

    @GetMapping("/latest")
    public ApiResponse<?> latest(@RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(pairingService.findLatest(memberId));
    }

    @GetMapping("/recent-crate")
    public ApiResponse<?> recentCrate(@RequestParam(defaultValue = "1") Long memberId,
                                      @RequestParam(defaultValue = "8") int limit) {
        return ApiResponse.ok(pairingService.findRecentCrate(memberId, limit));
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody Map<String, Object> pairing) {
        pairing.putIfAbsent("memberId", DEFAULT_MEMBER_ID);
        return ApiResponse.ok(pairingService.create(pairing));
    }

    @DeleteMapping("/{pairingId}")
    public ApiResponse<?> delete(@PathVariable Long pairingId,
                                 @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(Map.of("deleted", pairingService.delete(memberId, pairingId)));
    }

    @PostMapping("/analyze")
    public ApiResponse<?> analyze(@RequestBody Map<String, Object> request) {
        return ApiResponse.ok(pairingService.analyze(request));
    }

    @PostMapping("/parse-natural-log")
    public ApiResponse<?> parseNaturalLog(@RequestBody Map<String, Object> request) {
        return ApiResponse.ok(pairingService.parseNaturalLog(request));
    }
}
