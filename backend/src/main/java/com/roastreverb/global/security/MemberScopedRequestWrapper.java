package com.roastreverb.global.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.util.HashMap;
import java.util.Map;

/**
 * Forces the "memberId" request parameter to the authenticated member's id so
 * a caller can never read or write another member's data by passing a different value.
 */
public class MemberScopedRequestWrapper extends HttpServletRequestWrapper {
    private final String memberId;

    public MemberScopedRequestWrapper(HttpServletRequest request, Long memberId) {
        super(request);
        this.memberId = String.valueOf(memberId);
    }

    @Override
    public String getParameter(String name) {
        return "memberId".equals(name) ? memberId : super.getParameter(name);
    }

    @Override
    public String[] getParameterValues(String name) {
        return "memberId".equals(name) ? new String[]{memberId} : super.getParameterValues(name);
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        Map<String, String[]> map = new HashMap<>(super.getParameterMap());
        map.put("memberId", new String[]{memberId});
        return map;
    }
}
