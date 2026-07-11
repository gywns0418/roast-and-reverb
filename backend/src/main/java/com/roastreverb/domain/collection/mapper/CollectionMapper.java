package com.roastreverb.domain.collection.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CollectionMapper {
    List<Map<String, Object>> findAll(@Param("memberId") Long memberId,
                                      @Param("format") String format,
                                      @Param("keyword") String keyword);

    Map<String, Object> findById(@Param("collectionId") Long collectionId,
                                 @Param("memberId") Long memberId);

    int insert(Map<String, Object> collection);

    int update(Map<String, Object> collection);

    int delete(@Param("collectionId") Long collectionId,
               @Param("memberId") Long memberId);
}
