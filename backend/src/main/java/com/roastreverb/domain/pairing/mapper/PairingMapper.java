package com.roastreverb.domain.pairing.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PairingMapper {
    List<Map<String, Object>> findAll(@Param("memberId") Long memberId,
                                      @Param("limit") int limit,
                                      @Param("offset") int offset);

    Map<String, Object> findById(@Param("pairingId") Long pairingId,
                                 @Param("memberId") Long memberId);

    Map<String, Object> findLatest(@Param("memberId") Long memberId);

    int insert(Map<String, Object> pairing);

    int delete(@Param("pairingId") Long pairingId,
               @Param("memberId") Long memberId);

    List<Map<String, Object>> findRecentCrate(@Param("memberId") Long memberId,
                                              @Param("limit") int limit);
}
