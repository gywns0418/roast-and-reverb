package com.roastreverb.domain.member.service;
import java.util.Map;
import com.roastreverb.global.exception.CustomException;
import org.springframework.http.HttpStatus;
public final class PolicyConsent {
 public static final String VERSION="2026-11-01";
 private PolicyConsent(){}
 public static void require(Map<String,Object> body){
  if(!VERSION.equals(body.get("policyVersion"))||!Boolean.TRUE.equals(body.get("ageConfirmed"))||!Boolean.TRUE.equals(body.get("termsAccepted"))||!Boolean.TRUE.equals(body.get("privacyAccepted")))
   throw new CustomException(HttpStatus.BAD_REQUEST,"만 14세 이상 확인과 현재 약관·개인정보 처리 동의가 필요합니다.");
 }
}
