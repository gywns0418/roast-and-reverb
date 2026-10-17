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
        if (email.length()>120 || !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$") || !validPassword(password)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이메일과 8자 이상의 비밀번호를 입력해 주세요.");
        }
        String nickname=String.valueOf(member.getOrDefault("nickname",""));
        if(nickname.isBlank()||nickname.length()>60)throw new CustomException(HttpStatus.BAD_REQUEST,"이름은 1~60자로 입력해 주세요.");
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
        if(email==null||email.length()>120||rawPassword==null||rawPassword.getBytes(java.nio.charset.StandardCharsets.UTF_8).length>72)throw new CustomException(HttpStatus.UNAUTHORIZED,"이메일 또는 비밀번호가 올바르지 않습니다.");
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

    private boolean validPassword(String value){return value!=null&&!"null".equals(value)&&value.length()>=8&&value.getBytes(java.nio.charset.StandardCharsets.UTF_8).length<=72;}
    public int updatePassword(Long memberId, String currentPassword, String password) {
        if (!validPassword(password)) throw new CustomException(HttpStatus.BAD_REQUEST, "비밀번호는 8자 이상, UTF-8 72바이트 이하여야 합니다.");
        var member=memberMapper.findById(memberId);
        if(member==null||currentPassword==null||currentPassword.getBytes(java.nio.charset.StandardCharsets.UTF_8).length>72||!passwordEncoder.matches(currentPassword,String.valueOf(memberMapper.findByEmail(String.valueOf(member.get("email"))).get("password"))))throw new CustomException(HttpStatus.UNAUTHORIZED,"현재 비밀번호를 확인해 주세요.");
        return memberMapper.updatePassword(memberId, passwordEncoder.encode(password));
    }
}
