package com.roastreverb.domain.coffee.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface CoffeeLogMapper {
    List<Map<String, Object>> findAll(@Param("memberId") Long memberId,
                                      @Param("keyword") String keyword,
                                      @Param("from") LocalDate from,
                                      @Param("to") LocalDate to,
                                      @Param("limit") int limit,
                                      @Param("offset") int offset);

    Map<String, Object> findById(@Param("coffeeLogId") Long coffeeLogId,
                                 @Param("memberId") Long memberId);

    int insert(Map<String, Object> coffeeLog);

    int update(Map<String, Object> coffeeLog);

    int delete(@Param("coffeeLogId") Long coffeeLogId,
               @Param("memberId") Long memberId);

    List<Map<String, Object>> findCalendar(@Param("memberId") Long memberId,
                                           @Param("from") LocalDate from,
                                           @Param("to") LocalDate to);

    Map<String, Object> findStatistics(@Param("memberId") Long memberId,
                                       @Param("from") LocalDate from,
                                       @Param("to") LocalDate to);
}
