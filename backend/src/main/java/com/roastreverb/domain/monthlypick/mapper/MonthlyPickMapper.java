package com.roastreverb.domain.monthlypick.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface MonthlyPickMapper {
    List<Map<String, Object>> findAllPicks(@Param("memberId") Long memberId);

    Map<String, Object> findPickById(@Param("monthlyPickId") Long monthlyPickId,
                                      @Param("memberId") Long memberId);

    int insertPick(Map<String, Object> pick);

    List<Map<String, Object>> findOptionsByPick(@Param("monthlyPickId") Long monthlyPickId);

    int insertOption(Map<String, Object> option);

    int updateOptionScore(@Param("optionId") Long optionId,
                          @Param("score") Integer score,
                          @Param("scoreReason") String scoreReason);

    List<Map<String, Object>> findTasteRules(@Param("memberId") Long memberId);
}
