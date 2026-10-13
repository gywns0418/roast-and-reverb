package com.roastreverb.domain.external.service;

import com.roastreverb.domain.external.mapper.ExternalApiLogMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ExternalApiLogService {
    private final ExternalApiLogMapper externalApiLogMapper;

    public ExternalApiLogService(ExternalApiLogMapper externalApiLogMapper) {
        this.externalApiLogMapper = externalApiLogMapper;
    }

    public Map<String, Object> create(Map<String, Object> apiLog) {
        externalApiLogMapper.insert(apiLog);
        return apiLog;
    }

    public List<Map<String, Object>> findAll(Long memberId, String provider, Boolean success, int limit, int offset) {
        return externalApiLogMapper.findAll(memberId, provider, success, limit, offset);
    }
}
