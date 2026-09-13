package com.roastreverb.domain.member.service;

import com.roastreverb.domain.member.mapper.MemberMapper;
import com.roastreverb.global.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MemberService {
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberMapper memberMapper, PasswordEncoder passwordEncoder) {
        this.memberMapper = memberMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> findById(Long memberId) {
        return memberMapper.findById(memberId);
    }

    public Map<String, Object> findByEmail(String email) {
        return memberMapper.findByEmail(email);
    }

    public Map<String, Object> join(Map<String, Object> member) {
        String email = String.valueOf(member.get("email"));
        if (memberMapper.existsByEmail(email) > 0) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 가입된 이메일입니다.");
        }
        member.putIfAbsent("role", "USER");
        member.putIfAbsent("status", "ACTIVE");
        member.put("password", passwordEncoder.encode(String.valueOf(member.get("password"))));
        memberMapper.insert(member);
        return memberMapper.findById(((Number) member.get("memberId")).longValue());
    }

    public Map<String, Object> authenticate(String email, String rawPassword) {
        Map<String, Object> member = memberMapper.findByEmail(email);
        if (member == null || !passwordEncoder.matches(rawPassword, String.valueOf(member.get("password")))) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        return member;
    }

    public int updateProfile(Long memberId, Map<String, Object> member) {
        member.put("memberId", memberId);
        return memberMapper.updateProfile(member);
    }

    public int updatePassword(Long memberId, String password) {
        return memberMapper.updatePassword(memberId, password);
    }
}
