package com.roastreverb.domain.admin.controller;

import com.roastreverb.domain.admin.service.AdminService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<?> dashboard() {
        return ApiResponse.ok(adminService.dashboard());
    }

    @GetMapping("/members")
    public ApiResponse<?> members(@RequestParam(required = false) String keyword,
                                  @RequestParam(required = false) String status,
                                  @RequestParam(defaultValue = "30") int limit,
                                  @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(adminService.members(keyword, status, limit, offset));
    }

    @GetMapping("/api-logs")
    public ApiResponse<?> apiLogs(@RequestParam(required = false) String provider,
                                  @RequestParam(required = false) String status,
                                  @RequestParam(defaultValue = "50") int limit,
                                  @RequestParam(defaultValue = "0") int offset) {
        return ApiResponse.ok(adminService.apiLogs(provider, status, limit, offset));
    }

    @GetMapping("/statistics/daily")
    public ApiResponse<?> dailyStatistics(@RequestParam String from,
                                          @RequestParam String to) {
        return ApiResponse.ok(adminService.dailyStatistics(from, to));
    }
}
