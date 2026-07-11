package com.roastreverb.domain.coffee.controller;

import com.roastreverb.domain.coffee.service.CoffeeLogService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping({"/api/coffee-logs", "/api/coffee"})
public class CoffeeLogController {
    private static final Long DEFAULT_MEMBER_ID = 1L;

    private final CoffeeLogService coffeeLogService;

    public CoffeeLogController(CoffeeLogService coffeeLogService) {
        this.coffeeLogService = coffeeLogService;
    }

    @GetMapping
    public ApiResponse<?> findAll(@RequestParam(defaultValue = "1") Long memberId,
                                  @RequestParam(required = false) String keyword,
                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
                                  @RequestParam(defaultValue = "30") int limit,
                                  @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(coffeeLogService.findAll(memberId, keyword, from, to, limit, offset));
    }

    @GetMapping("/{coffeeLogId}")
    public ApiResponse<?> findById(@PathVariable Long coffeeLogId,
                                   @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(coffeeLogService.findById(memberId, coffeeLogId));
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody Map<String, Object> coffeeLog) {
        coffeeLog.putIfAbsent("memberId", DEFAULT_MEMBER_ID);
        return ApiResponse.ok(coffeeLogService.create(coffeeLog));
    }

    @PutMapping("/{coffeeLogId}")
    public ApiResponse<?> update(@PathVariable Long coffeeLogId,
                                 @RequestParam(defaultValue = "1") Long memberId,
                                 @RequestBody Map<String, Object> coffeeLog) {
        return ApiResponse.ok(Map.of("updated", coffeeLogService.update(memberId, coffeeLogId, coffeeLog)));
    }

    @DeleteMapping("/{coffeeLogId}")
    public ApiResponse<?> delete(@PathVariable Long coffeeLogId,
                                 @RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(Map.of("deleted", coffeeLogService.delete(memberId, coffeeLogId)));
    }

    @GetMapping("/calendar")
    public ApiResponse<?> calendar(@RequestParam(defaultValue = "1") Long memberId,
                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.ok(coffeeLogService.findCalendar(memberId, from, to));
    }

    @GetMapping("/statistics")
    public ApiResponse<?> statistics(@RequestParam(defaultValue = "1") Long memberId,
                                     @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                     @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.ok(coffeeLogService.findStatistics(memberId, from, to));
    }
}
