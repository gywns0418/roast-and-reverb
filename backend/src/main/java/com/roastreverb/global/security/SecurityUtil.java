package com.roastreverb.global.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtil {
    private SecurityUtil() {
    }

    public static Long currentMemberId(Long fallback) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof MemberPrincipal principal) {
            return principal.getMemberId();
        }
        return fallback;
    }
}
