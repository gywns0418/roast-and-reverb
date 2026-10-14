package com.roastreverb.domain.music.service;

import com.roastreverb.domain.music.mapper.MusicMapper;
import org.springframework.stereotype.Service;
import com.roastreverb.global.exception.CustomException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class MusicService {
    private final MusicMapper musicMapper;

    public MusicService(MusicMapper musicMapper) {
        this.musicMapper = musicMapper;
    }

    public List<Map<String, Object>> findAll(Long memberId, String keyword, LocalDate from, LocalDate to, int limit, int offset) {
        return musicMapper.findAll(memberId, keyword, from, to, limit, offset);
    }

    public Map<String, Object> findById(Long memberId, Long musicLogId) {
        var record = musicMapper.findById(musicLogId, memberId);
        if (record == null) throw new CustomException(HttpStatus.NOT_FOUND, "기록을 찾을 수 없습니다.");
        return record;
    }

    public Map<String, Object> create(Map<String, Object> musicLog) {
        musicMapper.insert(musicLog);
        return musicLog;
    }

    public int update(Long memberId, Long musicLogId, Map<String, Object> musicLog) {
        musicLog.put("memberId", memberId);
        musicLog.put("musicLogId", musicLogId);
        return musicMapper.update(musicLog);
    }

    public int delete(Long memberId, Long musicLogId) {
        return musicMapper.delete(musicLogId, memberId);
    }

    public List<Map<String, Object>> findRecentTags(Long memberId, int limit) {
        return musicMapper.findRecentTags(memberId, limit);
    }
}
