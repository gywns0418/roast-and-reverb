package com.roastreverb.domain.member.social;
import com.roastreverb.global.exception.CustomException;
import com.roastreverb.global.response.ApiResponse;
import com.roastreverb.global.security.SecurityUtil;
import jakarta.servlet.http.*;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;
@RestController
public class GoogleLoginController {
 private final com.roastreverb.domain.member.mapper.SocialIdentityMapper identities;
 private final GoogleIdentityVerifier verifier; private final GoogleAccountService accounts; private final String clientId; private final String publicOrigin;
 public GoogleLoginController(GoogleIdentityVerifier verifier,GoogleAccountService accounts,com.roastreverb.domain.member.mapper.SocialIdentityMapper identities,@Value("${GOOGLE_CLIENT_ID:}") String clientId,@Value("${APP_PUBLIC_ORIGIN:https://roast-and-reverb-production.up.railway.app}") String publicOrigin) {
  this.identities=identities;this.verifier=verifier;this.accounts=accounts;this.clientId=clientId.trim();this.publicOrigin=publicOrigin;
 }
 @GetMapping("/api/auth/google/config")
 public ApiResponse<?> config(HttpServletResponse response) {
  response.setHeader("Cache-Control","no-store");return ApiResponse.ok(Map.of("enabled",!clientId.isBlank(),"clientId",clientId));
 }
 @GetMapping("/api/members/me/google/status")
 public ApiResponse<?> linked(HttpServletResponse response) {
  response.setHeader("Cache-Control","no-store");
  Long member=SecurityUtil.currentMemberId(null);if(member==null)throw unauthorized();
  return ApiResponse.ok(Map.of("linked",identities.subjectFor(member)!=null));
 }
 @PostMapping({"/api/auth/google/challenge","/api/members/me/google/challenge"})
 public ApiResponse<?> challenge(HttpServletRequest request,HttpServletResponse response,@RequestHeader(value="X-RR-Social",defaultValue="") String header) {
  requireEnabled(header,request);response.setHeader("Cache-Control","no-store");
  Long link=request.getRequestURI().contains("/members/")?SecurityUtil.currentMemberId(null):null;
  if(request.getRequestURI().contains("/members/")&&link==null)throw unauthorized();
  byte[] bytes=new byte[32];new SecureRandom().nextBytes(bytes);
  String nonce=Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  HttpSession session=request.getSession(true);session.setMaxInactiveInterval(300);
  synchronized(session){session.setAttribute("googleChallenge",new Challenge(nonce,Instant.now().plusSeconds(300),link));}
  return ApiResponse.ok(Map.of("nonce",nonce));
 }
 @PostMapping("/api/auth/google/complete")
 public ApiResponse<?> complete(HttpServletRequest request,HttpServletResponse response,@RequestHeader(value="X-RR-Social",defaultValue="") String header,@RequestBody Map<String,String> body) {
  requireEnabled(header,request);response.setHeader("Cache-Control","no-store");
  HttpSession session=request.getSession(false);Challenge challenge=null;
  if(session!=null) synchronized(session){challenge=(Challenge)session.getAttribute("googleChallenge");session.removeAttribute("googleChallenge");}
  if(challenge==null||Instant.now().isAfter(challenge.expires()))throw unauthorized();
  if(challenge.linkMember()!=null&&!challenge.linkMember().equals(SecurityUtil.currentMemberId(null)))throw unauthorized();
  String credential=body.get("credential");if(credential==null||credential.length()>16384)throw unauthorized();
  Jwt identity;
  try { identity=verifier.verify(credential); }catch(JwtException|IllegalArgumentException e){throw unauthorized();}
  String issuer=identity.getIssuer()==null?"":identity.getIssuer().toString();String email=identity.getClaimAsString("email");
  if(!Set.of("https://accounts.google.com","accounts.google.com").contains(issuer)
   ||!identity.getAudience().contains(clientId)||!challenge.nonce().equals(identity.getClaimAsString("nonce"))
   ||!Boolean.TRUE.equals(identity.getClaimAsBoolean("email_verified"))||email==null||email.length()>120
   ||identity.getExpiresAt()==null||!identity.getExpiresAt().isAfter(Instant.now())
   ||identity.getSubject()==null||identity.getSubject().isBlank()||identity.getSubject().length()>255)throw unauthorized();
  try { return ApiResponse.ok(accounts.finish(identity,challenge.linkMember())); }
  catch(org.springframework.dao.DataIntegrityViolationException e){throw new CustomException(HttpStatus.CONFLICT,"계정 연결 상태가 변경됐습니다. 다시 로그인해 주세요.");}
 }
 private void requireEnabled(String header,HttpServletRequest request){
  if(clientId.isBlank())throw new CustomException(HttpStatus.SERVICE_UNAVAILABLE,"Google 로그인을 준비 중입니다. 이메일로 이용해 주세요.");
  if(!"1".equals(header)||!publicOrigin.equals(request.getHeader("Origin")))throw unauthorized();
 }
 private CustomException unauthorized(){return new CustomException(HttpStatus.UNAUTHORIZED,"Google 인증이 만료되었거나 확인되지 않았습니다. 다시 시도해 주세요.");}
 private record Challenge(String nonce,Instant expires,Long linkMember){}
}
