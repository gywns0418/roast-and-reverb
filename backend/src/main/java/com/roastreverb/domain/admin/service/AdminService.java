package com.roastreverb.domain.admin.service;

import com.roastreverb.domain.admin.mapper.AdminMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    private final AdminMapper adminMapper;

    public AdminService(AdminMapper adminMapper) {
        this.adminMapper = adminMapper;
    }

    public Map<String, Object> dashboard() {
        return adminMapper.findDashboardStats();
    }

    public List<Map<String, Object>> members(String keyword, String status, int limit, int offset) {
        return adminMapper.findMembers(keyword, status, limit, offset);
    }

    public List<Map<String, Object>> apiLogs(String provider, String status, int limit, int offset) {
        return adminMapper.findApiLogs(provider, status, limit, offset);
    }

    public List<Map<String, Object>> dailyStatistics(String from, String to) {
        return adminMapper.findDailyStatistics(from, to);
    }
}
