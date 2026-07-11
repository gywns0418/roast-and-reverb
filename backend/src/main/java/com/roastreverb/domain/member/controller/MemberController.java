package com.roastreverb.domain.member.controller;

import com.roastreverb.domain.member.service.MemberService;
import com.roastreverb.global.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class MemberController {
    private static final Long DEFAULT_MEMBER_ID = 1L;

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/api/auth/join")
    public ApiResponse<?> join(@RequestBody Map<String, Object> member) {
        return ApiResponse.ok(memberService.join(member));
    }

    @PostMapping("/api/auth/login")
    public ApiResponse<?> login(@RequestBody Map<String, Object> request) {
        Object email = request.get("email");
        return ApiResponse.ok(email == null ? null : memberService.findByEmail(email.toString()));
    }

    @PostMapping("/api/auth/logout")
    public ApiResponse<?> logout() {
        return ApiResponse.ok(Map.of("loggedOut", true));
    }

    @GetMapping("/api/members/me")
    public ApiResponse<?> me(@RequestParam(defaultValue = "1") Long memberId) {
        return ApiResponse.ok(memberService.findById(memberId));
    }

    @PutMapping("/api/members/me")
    public ApiResponse<?> updateMe(@RequestParam(defaultValue = "1") Long memberId,
                                   @RequestBody Map<String, Object> member) {
        return ApiResponse.ok(Map.of("updated", memberService.updateProfile(memberId, member)));
    }

    @PutMapping("/api/members/me/password")
    public ApiResponse<?> updatePassword(@RequestParam(defaultValue = "1") Long memberId,
                                         @RequestBody Map<String, Object> request) {
        return ApiResponse.ok(Map.of("updated", memberService.updatePassword(memberId, String.valueOf(request.get("password")))));
    }
}
