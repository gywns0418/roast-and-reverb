package com.roastreverb.domain.member.mapper;
import org.apache.ibatis.annotations.*;
@Mapper
public interface SocialIdentityMapper {
 @Select("SELECT member_id FROM social_identity WHERE provider='google' AND subject=#{subject}")
 Long memberFor(String subject);
 @Select("SELECT subject FROM social_identity WHERE provider='google' AND member_id=#{memberId}")
 String subjectFor(Long memberId);
 @Select("SELECT member_id FROM member WHERE LOWER(email)=LOWER(#{email})")
 Long emailOwner(String email);
 @Insert("INSERT INTO social_identity(provider,subject,member_id) VALUES('google',#{subject},#{memberId})")
 void insert(@Param("subject") String subject,@Param("memberId") Long memberId);
}
