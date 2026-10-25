package com.roastreverb.domain.coffee.service;

import com.roastreverb.domain.coffee.mapper.CoffeeLogMapper;
import org.springframework.stereotype.Service;
import com.roastreverb.global.exception.CustomException;
import org.springframework.http.HttpStatus;
import java.util.LinkedHashMap;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class CoffeeLogService {
    private final CoffeeLogMapper coffeeLogMapper;

    private final BrewDetailsCodec detailsCodec;

    public CoffeeLogService(CoffeeLogMapper coffeeLogMapper, BrewDetailsCodec detailsCodec) {
        this.detailsCodec = detailsCodec;
        this.coffeeLogMapper = coffeeLogMapper;
    }

    public List<Map<String, Object>> findAll(Long memberId, String keyword, LocalDate from, LocalDate to, int limit, int offset) {
        return coffeeLogMapper.findAll(memberId, keyword, from, to, limit, offset);
    }

    public Map<String, Object> findById(Long memberId, Long coffeeLogId) {
        var record = coffeeLogMapper.findById(coffeeLogId, memberId);
        if (record == null) throw new CustomException(HttpStatus.NOT_FOUND, "기록을 찾을 수 없습니다.");
        return record;
    }

    public Map<String, Object> create(Map<String, Object> coffeeLog) {
        validate(coffeeLog);
        coffeeLog.put("brewDetails", detailsCodec.encode(coffeeLog.get("brewDetails")));
        coffeeLogMapper.insert(coffeeLog);
        return coffeeLog;
    }

    public int update(Long memberId, Long coffeeLogId, Map<String, Object> coffeeLog) {
        Map<String, Object> existing = coffeeLogMapper.findById(coffeeLogId, memberId);
        if (existing == null) throw new CustomException(HttpStatus.NOT_FOUND, "기록을 찾을 수 없습니다.");
        Map<String, Object> merged = new LinkedHashMap<>();
        existing.forEach((key, value) -> {
            StringBuilder camel = new StringBuilder(); boolean upper = false;
            for (char letter : key.toCharArray()) { if (letter == '_') { upper = true; } else { camel.append(upper ? Character.toUpperCase(letter) : letter); upper = false; } }
            merged.put(camel.toString(), value);
        });
        merged.putAll(coffeeLog); coffeeLog = merged;
        validate(coffeeLog);
        coffeeLog.put("brewDetails", detailsCodec.encode(coffeeLog.get("brewDetails")));
        coffeeLog.put("memberId", memberId);
        coffeeLog.put("coffeeLogId", coffeeLogId);
        return coffeeLogMapper.update(coffeeLog);
    }

    private void validate(Map<String, Object> data) {
        Object name = data.get("beanName");
        try {
            if (name == null || name.toString().isBlank() || name.toString().length() > 120) throw new IllegalArgumentException();
            LocalDate.parse(String.valueOf(data.get("drinkDate")));
            for (String key : List.of("waterTemp", "brewTime")) {
                Object value = data.get(key);
                if (value == null || "".equals(value)) { data.put(key, null); continue; }
                double number = Double.parseDouble(String.valueOf(value));
                if (!Double.isFinite(number) || number < 0 || number != Math.floor(number) || (key.equals("waterTemp") && number > 100)) throw new IllegalArgumentException();
                data.put(key, (int) number);
            }
        } catch (Exception error) { throw new CustomException(HttpStatus.BAD_REQUEST, "원두명, 기록 날짜, 온도와 추출 시간을 확인해 주세요."); }
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
