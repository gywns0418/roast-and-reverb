package com.roastreverb.domain.report.service;

import com.roastreverb.domain.report.mapper.ReportMapper;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ReportService {
    private final ReportMapper reportMapper;

    public ReportService(ReportMapper reportMapper) {
        this.reportMapper = reportMapper;
    }

    public Map<String, Object> findMonthly(Long memberId, String yearMonth) {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("summary", reportMapper.findMonthlySummary(memberId, yearMonth));
        report.put("favoriteCoffees", reportMapper.findFavoriteCoffees(memberId, yearMonth, 5));
        report.put("favoriteArtists", reportMapper.findFavoriteArtists(memberId, yearMonth, 5));
        report.put("moodStats", reportMapper.findMoodStats(memberId, yearMonth));
        report.put("roastStats", reportMapper.findRoastStats(memberId, yearMonth));
        return report;
    }
}
