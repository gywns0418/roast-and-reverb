package com.roastreverb.domain.external.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ExternalApiLogMapper {
    int insert(Map<String, Object> apiLog);

    List<Map<String, Object>> findAll(@Param("memberId") Long memberId,
                                      @Param("provider") String provider,
                                      @Param("success") Boolean success,
                                      @Param("limit") int limit,
                                      @Param("offset") int offset);
}
