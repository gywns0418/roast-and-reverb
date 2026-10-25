package com.roastreverb.global.security;
import org.apache.ibatis.annotations.*;
@Mapper
public interface RevokedTokenMapper {
 @Select("SELECT COUNT(*) FROM revoked_token WHERE token_hash=#{hash} AND expires_at>#{now}")
 int revoked(@Param("hash") String hash,@Param("now") long now);
 @Insert("MERGE INTO revoked_token (token_hash,expires_at) KEY(token_hash) VALUES(#{hash},#{expires})")
 void revoke(@Param("hash") String hash,@Param("expires") long expires);
 @Delete("DELETE FROM revoked_token WHERE expires_at<=#{now}")
 void cleanup(long now);
}
