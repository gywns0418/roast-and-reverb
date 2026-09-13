package com.roastreverb.domain.admin.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminMapper {
    Map<String, Object> findDashboardStats();

    List<Map<String, Object>> findMembers(@Param("keyword") String keyword,
                                          @Param("status") String status,
                                          @Param("limit") int limit,
                                          @Param("offset") int offset);

    List<Map<String, Object>> findApiLogs(@Param("provider") String provider,
                                          @Param("status") String status,
                                          @Param("limit") int limit,
                                          @Param("offset") int offset);

    List<Map<String, Object>> findDailyStatistics(@Param("from") String from,
                                                  @Param("to") String to);
}
