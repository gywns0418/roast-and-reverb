package com.roastreverb.domain.member.mapper;
import org.apache.ibatis.annotations.*;
@Mapper
public interface PolicyConsentMapper {
 @Insert("INSERT INTO member_policy_consent(member_id,policy_version,age_confirmed,accepted_at) VALUES(#{memberId},#{version},TRUE,CURRENT_TIMESTAMP)")
 int record(@Param("memberId") Long memberId,@Param("version") String version);
}
