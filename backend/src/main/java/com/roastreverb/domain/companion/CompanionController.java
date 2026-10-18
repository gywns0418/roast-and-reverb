package com.roastreverb.domain.companion;

import com.roastreverb.global.response.ApiResponse;
import com.roastreverb.global.security.SecurityUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companion")
public class CompanionController {
    private final CompanionService service;
    public CompanionController(CompanionService service) {this.service=service;}
    @GetMapping("/status") public ApiResponse<?> status() {return ApiResponse.ok(service.status());}
    @PostMapping("/cup") public ApiResponse<?> organize(@RequestBody CompanionService.CupInput input) {
        return ApiResponse.ok(service.organize(SecurityUtil.currentMemberId(-1L),input));
    }
    @PostMapping("/chat") public ApiResponse<?> chat(@RequestBody CompanionService.Chat input) {
        return ApiResponse.ok(service.chat(SecurityUtil.currentMemberId(-1L),input));
    }
}
