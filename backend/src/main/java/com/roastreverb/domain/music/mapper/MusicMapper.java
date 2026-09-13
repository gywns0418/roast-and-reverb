package com.roastreverb.domain.music.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface MusicMapper {
    List<Map<String, Object>> findAll(@Param("memberId") Long memberId,
                                      @Param("keyword") String keyword,
                                      @Param("from") LocalDate from,
                                      @Param("to") LocalDate to,
                                      @Param("limit") int limit,
                                      @Param("offset") int offset);

    Map<String, Object> findById(@Param("musicLogId") Long musicLogId,
                                 @Param("memberId") Long memberId);

    int insert(Map<String, Object> musicLog);

    int update(Map<String, Object> musicLog);

    int delete(@Param("musicLogId") Long musicLogId,
               @Param("memberId") Long memberId);

    List<Map<String, Object>> findRecentTags(@Param("memberId") Long memberId,
                                             @Param("limit") int limit);
}
