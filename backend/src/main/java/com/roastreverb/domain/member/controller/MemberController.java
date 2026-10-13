package com.roastreverb.domain.member.controller;

import com.roastreverb.domain.member.service.MemberService;
import com.roastreverb.global.response.ApiResponse;
import com.roastreverb.global.security.JwtProvider;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class MemberController {
    private static final Long DEFAULT_MEMBER_ID = 1L;

    private final MemberService memberService;
    private final JwtProvider jwtProvider;

    public MemberController(MemberService memberService, JwtProvider jwtProvider) {
        this.memberService = memberService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/api/auth/join")
    public ApiResponse<?> join(@RequestBody Map<String, Object> member) {
        Map<String, Object> joined = memberService.join(member);
        return ApiResponse.ok(withToken(joined));
    }

    @PostMapping("/api/auth/login")
    public ApiResponse<?> login(@RequestBody Map<String, Object> request) {
        String email = String.valueOf(request.get("email"));
        String password = String.valueOf(request.get("password"));
        Map<String, Object> member = memberService.authenticate(email, password);
        return ApiResponse.ok(withToken(member));
    }

    private Map<String, Object> withToken(Map<String, Object> member) {
        // resultType="map" queries hand back raw snake_case column names (member_id), not memberId.
        Long memberId = ((Number) member.get("member_id")).longValue();
        String email = String.valueOf(member.get("email"));
        String role = String.valueOf(member.get("role"));
        String token = jwtProvider.generateToken(memberId, email, role);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("memberId", memberId);
        result.put("email", email);
        result.put("nickname", member.get("nickname"));
        result.put("role", role);
        result.put("token", token);
        return result;
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
