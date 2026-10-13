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
        String password = String.valueOf(member.get("password"));
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$") || password.length() < 8 || password.equals("null")) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이메일과 8자 이상의 비밀번호를 입력해 주세요.");
        }
        if (memberMapper.existsByEmail(email) > 0) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 가입된 이메일입니다.");
        }
        member.put("role", "USER");
        member.put("status", "ACTIVE");
        member.put("password", passwordEncoder.encode(String.valueOf(member.get("password"))));
        memberMapper.insert(member);
        return memberMapper.findById(((Number) member.get("memberId")).longValue());
    }

    public Map<String, Object> authenticate(String email, String rawPassword) {
        Map<String, Object> member = memberMapper.findByEmail(email);
        if (member == null || !"ACTIVE".equals(String.valueOf(member.get("status"))) || !passwordEncoder.matches(rawPassword, String.valueOf(member.get("password")))) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        return member;
    }

    public int updateProfile(Long memberId, Map<String, Object> member) {
        member.put("memberId", memberId);
        return memberMapper.updateProfile(member);
    }

    public int updatePassword(Long memberId, String password) {
        if (password == null || password.length() < 8) throw new CustomException(HttpStatus.BAD_REQUEST, "비밀번호는 8자 이상이어야 합니다.");
        return memberMapper.updatePassword(memberId, passwordEncoder.encode(password));
    }
}
