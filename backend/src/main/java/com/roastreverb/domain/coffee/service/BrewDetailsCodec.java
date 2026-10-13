package com.roastreverb.domain.coffee.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roastreverb.global.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class BrewDetailsCodec {
    private final ObjectMapper json;
    public BrewDetailsCodec(ObjectMapper json) { this.json = json; }

    public String encode(Object value) {
        if (value == null) return null;
        try {
            Map<String, Object> details;
            if (value instanceof String text) {
                if (text.isBlank()) return null;
                if (text.length() > 30000) throw new IllegalArgumentException();
                details = json.readValue(text, new TypeReference<LinkedHashMap<String, Object>>() {});
            } else if (value instanceof Map<?, ?> map) {
                details = new LinkedHashMap<>();
                map.forEach((key, item) -> details.put(String.valueOf(key), item));
            } else throw new IllegalArgumentException();
            number(details, "doseGrams", 0.01, 1000, false);
            number(details, "waterGrams", 0.01, 5000, false);
            number(details, "beverageGrams", 0, 5000, false);
            number(details, "recordedHour", 0, 23, true);
            if (details.get("pourMode") != null && !"individual".equals(details.get("pourMode")) && !"cumulative".equals(details.get("pourMode"))) throw new IllegalArgumentException();
            String result = json.writeValueAsString(details);
            if (result.length() > 30000) throw new IllegalArgumentException();
            return result;
        } catch (Exception error) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "추출 조건을 확인해 주세요. 수량은 양수, 기록 시간은 0~23시로 입력합니다.");
        }
    }

    private void number(Map<String, Object> data, String key, double min, double max, boolean integer) {
        Object value = data.get(key);
        if (value == null || "".equals(value)) { data.remove(key); return; }
        double number = Double.parseDouble(String.valueOf(value));
        if (!Double.isFinite(number) || number < min || number > max || (integer && number != Math.floor(number))) throw new IllegalArgumentException();
        data.put(key, integer ? (Object) (int) number : number);
    }
}
