package com.roastreverb.domain.report.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReportMapper {
    Map<String, Object> findMonthlySummary(@Param("memberId") Long memberId,
                                           @Param("yearMonth") String yearMonth);

    List<Map<String, Object>> findFavoriteCoffees(@Param("memberId") Long memberId,
                                                  @Param("yearMonth") String yearMonth,
                                                  @Param("limit") int limit);

    List<Map<String, Object>> findFavoriteArtists(@Param("memberId") Long memberId,
                                                  @Param("yearMonth") String yearMonth,
                                                  @Param("limit") int limit);

    List<Map<String, Object>> findMoodStats(@Param("memberId") Long memberId,
                                            @Param("yearMonth") String yearMonth);

    List<Map<String, Object>> findRoastStats(@Param("memberId") Long memberId,
                                             @Param("yearMonth") String yearMonth);
}
