package com.roastreverb.domain.report.controller;

import com.roastreverb.domain.report.service.ReportService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping({"/api/reports", "/api/report"})
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ApiResponse<?> monthlyAlias(@RequestParam(defaultValue = "1") Long memberId,
                                       @RequestParam(required = false) String yearMonth) {
        return monthly(memberId, yearMonth);
    }

    @GetMapping("/monthly")
    public ApiResponse<?> monthly(@RequestParam(defaultValue = "1") Long memberId,
                                  @RequestParam(required = false) String yearMonth) {
        String targetMonth = yearMonth == null || yearMonth.isBlank()
                ? YearMonth.now().toString()
                : yearMonth;
        return ApiResponse.ok(reportService.findMonthly(memberId, targetMonth));
    }
}
