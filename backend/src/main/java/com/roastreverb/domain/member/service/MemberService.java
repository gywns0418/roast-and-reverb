package com.roastreverb.domain.member.service;

import com.roastreverb.domain.member.mapper.MemberMapper;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MemberService {
    private final MemberMapper memberMapper;

    public MemberService(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }

    public Map<String, Object> findById(Long memberId) {
        return memberMapper.findById(memberId);
    }

    public Map<String, Object> findByEmail(String email) {
        return memberMapper.findByEmail(email);
    }

    public Map<String, Object> join(Map<String, Object> member) {
        member.putIfAbsent("role", "USER");
        member.putIfAbsent("status", "ACTIVE");
        memberMapper.insert(member);
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
