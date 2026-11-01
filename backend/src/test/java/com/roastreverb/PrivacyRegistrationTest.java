package com.roastreverb;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest(properties="spring.datasource.url=jdbc:h2:mem:privacy_registration;MODE=MySQL;DATABASE_TO_LOWER=TRUE;NON_KEYWORDS=MEMBER,BODY;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class PrivacyRegistrationTest {
 @Autowired MockMvc mvc; @Autowired ObjectMapper json; @Autowired JdbcTemplate db;
 Map<String,Object> signup(){return new HashMap<>(Map.of("policyVersion","2026-11-01","ageConfirmed",true,"termsAccepted",true,"privacyAccepted",true,"email","privacy-fixture@example.com","nickname","Privacy fixture","password","test-privacy-password"));}
 @Test void directApiRejectsMissingFalseAndStaleConsentAndPersistsAcceptedVersion()throws Exception{
  for(String field:List.of("policyVersion","ageConfirmed","termsAccepted","privacyAccepted")){
   var body=signup();body.remove(field);
   mvc.perform(post("/api/auth/join").contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
  }
  var underage=signup();underage.put("ageConfirmed",false);
  mvc.perform(post("/api/auth/join").contentType("application/json").content(json.writeValueAsString(underage))).andExpect(status().isBadRequest());
  var stale=signup();stale.put("policyVersion","2026-10-17");
  mvc.perform(post("/api/auth/join").contentType("application/json").content(json.writeValueAsString(stale))).andExpect(status().isBadRequest());
  assertEquals(0,db.queryForObject("SELECT COUNT(*) FROM member WHERE email='privacy-fixture@example.com'",Integer.class));
  mvc.perform(post("/api/auth/join").contentType("application/json").content(json.writeValueAsString(signup()))).andExpect(status().isOk());
  assertEquals(1,db.queryForObject("SELECT COUNT(*) FROM member_policy_consent c JOIN member m ON c.member_id=m.member_id WHERE m.email='privacy-fixture@example.com' AND c.policy_version='2026-11-01' AND c.age_confirmed=TRUE AND c.accepted_at IS NOT NULL",Integer.class));
 }
}
