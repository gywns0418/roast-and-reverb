package com.roastreverb.domain.member.social;
import com.roastreverb.domain.member.mapper.*;
import com.roastreverb.global.exception.CustomException;
import com.roastreverb.global.security.JwtProvider;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
@Service
public class GoogleAccountService {
 private final MemberMapper members; private final SocialIdentityMapper identities;
 private final PasswordEncoder passwords; private final JwtProvider tokens;
 public GoogleAccountService(MemberMapper members,SocialIdentityMapper identities,PasswordEncoder passwords,JwtProvider tokens) {
  this.members=members;this.identities=identities;this.passwords=passwords;this.tokens=tokens;
 }
 @Transactional
 public Map<String,Object> finish(Jwt identity, Long linkMember) {
  String subject=identity.getSubject(); Long memberId=identities.memberFor(subject);
  if(linkMember!=null) {
   if(memberId!=null&&!memberId.equals(linkMember)) throw conflict("다른 기록장에 연결된 Google 계정입니다.");
   String linked=identities.subjectFor(linkMember);
   if(linked!=null&&!linked.equals(subject)) throw conflict("이미 다른 Google 계정이 연결되어 있습니다.");
   if(memberId==null) identities.insert(subject,linkMember);
   memberId=linkMember;
  } else if(memberId==null) {
   String email=identity.getClaimAsString("email");
   if(identities.emailOwner(email)!=null) throw conflict("이미 사용하는 이메일입니다. 이메일로 로그인한 뒤 마이페이지에서 Google을 연결해 주세요.");
   Map<String,Object> member=new HashMap<>();
   member.put("email",email.toLowerCase(Locale.ROOT));
   member.put("password",passwords.encode(UUID.randomUUID().toString()+UUID.randomUUID()));
   String name=identity.getClaimAsString("name");
   member.put("nickname",name==null||name.isBlank()?"나의 기록장":name.substring(0,Math.min(60,name.length())));
   member.put("role","USER");member.put("status","ACTIVE");
   members.insert(member);memberId=((Number)member.get("memberId")).longValue();
   identities.insert(subject,memberId);
  }
  Map<String,Object> member=members.findById(memberId);
  if(member==null||!"ACTIVE".equals(member.get("status"))) throw new CustomException(HttpStatus.FORBIDDEN,"사용할 수 없는 계정입니다.");
  return Map.of("memberId",memberId,"email",member.get("email"),"nickname",member.get("nickname"),"role",member.get("role"),"token",tokens.generateToken(memberId,String.valueOf(member.get("email")),String.valueOf(member.get("role"))));
 }
 private CustomException conflict(String message){return new CustomException(HttpStatus.CONFLICT,message);}
}
