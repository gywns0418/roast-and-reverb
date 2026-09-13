package com.roastreverb.domain.coffee.service;

import com.roastreverb.domain.coffee.mapper.CoffeeLogMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class CoffeeLogService {
    private final CoffeeLogMapper coffeeLogMapper;

    public CoffeeLogService(CoffeeLogMapper coffeeLogMapper) {
        this.coffeeLogMapper = coffeeLogMapper;
    }

    public List<Map<String, Object>> findAll(Long memberId, String keyword, LocalDate from, LocalDate to, int limit, int offset) {
        return coffeeLogMapper.findAll(memberId, keyword, from, to, limit, offset);
    }

    public Map<String, Object> findById(Long memberId, Long coffeeLogId) {
        return coffeeLogMapper.findById(coffeeLogId, memberId);
    }

    public Map<String, Object> create(Map<String, Object> coffeeLog) {
        coffeeLogMapper.insert(coffeeLog);
        return coffeeLog;
    }

    public int update(Long memberId, Long coffeeLogId, Map<String, Object> coffeeLog) {
        coffeeLog.put("memberId", memberId);
        coffeeLog.put("coffeeLogId", coffeeLogId);
        return coffeeLogMapper.update(coffeeLog);
    }

    public int delete(Long memberId, Long coffeeLogId) {
        return coffeeLogMapper.delete(coffeeLogId, memberId);
    }

    public List<Map<String, Object>> findCalendar(Long memberId, LocalDate from, LocalDate to) {
        return coffeeLogMapper.findCalendar(memberId, from, to);
    }

    public Map<String, Object> findStatistics(Long memberId, LocalDate from, LocalDate to) {
        return coffeeLogMapper.findStatistics(memberId, from, to);
    }
}
