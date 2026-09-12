package com.roastreverb.global.security;

import com.roastreverb.domain.member.mapper.MemberMapper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberMapper memberMapper;

    public CustomUserDetailsService(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }

    @Override
    public MemberPrincipal loadUserByUsername(String email) {
        Map<String, Object> member = memberMapper.findByEmail(email);
        if (member == null) {
            throw new UsernameNotFoundException("가입되지 않은 이메일입니다.");
        }
        return MemberPrincipal.from(member);
    }
}
