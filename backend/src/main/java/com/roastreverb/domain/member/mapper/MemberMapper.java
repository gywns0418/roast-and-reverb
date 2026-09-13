package com.roastreverb.domain.member.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface MemberMapper {
    Map<String, Object> findById(@Param("memberId") Long memberId);

    Map<String, Object> findByEmail(@Param("email") String email);

    int existsByEmail(@Param("email") String email);

    int insert(Map<String, Object> member);

    int updateProfile(Map<String, Object> member);

    int updatePassword(@Param("memberId") Long memberId,
                       @Param("password") String password);
}
