package com.roastreverb.domain.recommendation.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface RecommendationMapper {
    List<Map<String, Object>> findAll(@Param("memberId") Long memberId,
                                      @Param("direction") String direction,
                                      @Param("limit") int limit);

    int insert(Map<String, Object> recommendation);

    int delete(@Param("recommendationId") Long recommendationId,
               @Param("memberId") Long memberId);
}
