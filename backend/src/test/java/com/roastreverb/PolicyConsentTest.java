package com.roastreverb;
import com.roastreverb.domain.member.service.PolicyConsent;
import com.roastreverb.global.exception.CustomException;
import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class PolicyConsentTest {
 Map<String,Object> accepted(){return new HashMap<>(Map.of("policyVersion","2026-11-01","ageConfirmed",true,"termsAccepted",true,"privacyAccepted",true));}
 @Test void missingStaleFalseAndStringFlagsCannotBypassRegistrationConsent(){
  assertThrows(CustomException.class,()->PolicyConsent.require(Map.of()));
  for(String field:List.of("policyVersion","ageConfirmed","termsAccepted","privacyAccepted")){
   var body=accepted();body.remove(field);assertThrows(CustomException.class,()->PolicyConsent.require(body));
   var rejected=accepted();rejected.put(field,field.equals("policyVersion")?"2026-10-17":false);assertThrows(CustomException.class,()->PolicyConsent.require(rejected));
  }
  var stringFlag=accepted();stringFlag.put("ageConfirmed","true");assertThrows(CustomException.class,()->PolicyConsent.require(stringFlag));
  assertDoesNotThrow(()->PolicyConsent.require(accepted()));
 }
}
