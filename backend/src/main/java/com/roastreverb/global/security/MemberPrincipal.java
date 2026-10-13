package com.roastreverb.global.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class MemberPrincipal implements UserDetails {
    private final Long memberId;
    private final String email;
    private final String password;
    private final String nickname;
    private final String role;
    private final boolean active;

    private MemberPrincipal(Long memberId, String email, String password, String nickname, String role, boolean active) {
        this.memberId = memberId;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
        this.active = active;
    }

    // map-underscore-to-camel-case only applies to POJO mapping; resultType="map" queries
    // hand back raw snake_case column names, so member_id (not memberId) is correct here.
    public static MemberPrincipal from(Map<String, Object> member) {
        return new MemberPrincipal(
                ((Number) member.get("member_id")).longValue(),
                String.valueOf(member.get("email")),
                String.valueOf(member.get("password")),
                String.valueOf(member.get("nickname")),
                String.valueOf(member.getOrDefault("role", "USER")),
                !"BLOCKED".equals(member.get("status"))
        );
    }

    public Long getMemberId() {
        return memberId;
    }

    public String getRole() {
        return role;
    }

    public String getNickname() {
        return nickname;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
