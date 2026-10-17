package com.roastreverb;
import com.fasterxml.jackson.databind.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import java.util.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest(properties="spring.datasource.url=jdbc:h2:mem:security_audit;MODE=MySQL;DATABASE_TO_LOWER=TRUE;NON_KEYWORDS=MEMBER,BODY;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class SecurityAuditTest {
 @Autowired MockMvc mvc; @Autowired ObjectMapper json;
 String signup(String name)throws Exception{return "Bearer "+json.readTree(mvc.perform(post("/api/auth/join").contentType("application/json").content(json.writeValueAsString(Map.of("email",name+"@example.com","password","security-test-123","nickname",name)))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()).path("data").path("token").asText();}
 long create(String resource,String auth,Map<String,Object> body,String key)throws Exception{return json.readTree(mvc.perform(post("/api/"+resource).header("Authorization",auth).contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()).path("data").path(key).asLong();}
 @Test void otherMembersCannotReadOrChangeRealRecordsOrLinkForeignPairings()throws Exception{
  String a=signup("owner-a"),b=signup("owner-b");
  long coffee=create("coffee",a,Map.of("beanName","Private fixture","drinkDate","2026-10-17"),"coffeeLogId");
  long music=create("music",a,Map.of("trackName","Private song","artistName","Fixture","listenedDate","2026-10-17"),"musicLogId");
  long pairing=create("pairing",a,Map.of("coffeeLogId",coffee,"musicLogId",music,"pairingScore",88),"pairingId");
  long collection=create("collection",a,Map.of("title","Private shelf","artistName","Fixture","format","LP","linkedPairingId",pairing),"collectionId");
  for(var item:Map.of("coffee",coffee,"music",music,"pairing",pairing,"collection",collection).entrySet()){
   String path="/api/"+item.getKey()+"/"+item.getValue();
   mvc.perform(get(path).header("Authorization",b).param("memberId","1")).andExpect(status().isNotFound());
   mvc.perform(delete(path).header("Authorization",b)).andExpect(status().isOk()).andExpect(jsonPath("$.data.deleted").value(0));
   mvc.perform(get(path).header("Authorization",a)).andExpect(status().isOk());
  }
  mvc.perform(put("/api/coffee/"+coffee).header("Authorization",b).contentType("application/json").content("{\"beanName\":\"Attack\",\"drinkDate\":\"2026-10-17\"}")).andExpect(status().isNotFound());
  mvc.perform(post("/api/collection").header("Authorization",b).contentType("application/json").content(json.writeValueAsString(Map.of("title","Foreign link","artistName","Fixture","format","LP","linkedPairingId",pairing)))).andExpect(status().isBadRequest());
  mvc.perform(get("/api/coffee").header("Authorization",b).param("keyword","' OR 1=1 --")).andExpect(status().isOk()).andExpect(jsonPath("$.data.length()").value(0));
 }
 @Test void passwordChangeRequiresCurrentPasswordAndInvalidatesPreviousTokens()throws Exception{
  String auth=signup("password-proof");
  mvc.perform(put("/api/members/me/password").header("Authorization",auth).contentType("application/json").content("{\"password\":\"new-password-123\"}")).andExpect(status().isUnauthorized());
  mvc.perform(put("/api/members/me/password").header("Authorization",auth).contentType("application/json").content("{\"currentPassword\":\"wrong\",\"password\":\"new-password-123\"}")).andExpect(status().isUnauthorized());
  mvc.perform(put("/api/members/me/password").header("Authorization",auth).contentType("application/json").content("{\"currentPassword\":\"security-test-123\",\"password\":\"new-password-123\"}")).andExpect(status().isOk());
  mvc.perform(get("/api/members/me").header("Authorization",auth)).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/auth/login").contentType("application/json").content("{\"email\":\"password-proof@example.com\",\"password\":\"new-password-123\"}")).andExpect(status().isOk());
 }
 @Test void logoutRevokesTokenAndTamperingCannotAuthenticate()throws Exception{
  String auth=signup("logout-proof");
  mvc.perform(get("/api/coffee").header("Authorization",auth+"x")).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/auth/logout").header("Authorization",auth)).andExpect(status().isOk());
  mvc.perform(get("/api/members/me").header("Authorization",auth)).andExpect(status().isUnauthorized());
 }
 @Test void securityHeadersAndCorsAreEnforced()throws Exception{
  mvc.perform(get("/healthz").secure(true)).andExpect(status().isOk()).andExpect(header().exists("Content-Security-Policy")).andExpect(header().string("X-Content-Type-Options","nosniff")).andExpect(header().string("X-Frame-Options","DENY")).andExpect(header().exists("Strict-Transport-Security")).andExpect(header().exists("Permissions-Policy")).andExpect(header().exists("Referrer-Policy")).andExpect(header().string("Cross-Origin-Resource-Policy","same-origin"));
  mvc.perform(options("/api/coffee").header("Origin","https://security-audit.invalid").header("Access-Control-Request-Method","GET")).andExpect(status().isForbidden()).andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
 }
 @Test void invalidPasswordsAndSensitivePathsAreRejected()throws Exception{
  mvc.perform(post("/api/auth/join").contentType("application/json").content(json.writeValueAsString(Map.of("email","long-password@example.com","nickname","Fixture","password","가".repeat(30))))).andExpect(status().isBadRequest());
  for(String path:List.of("/.env","/.git/config","/h2-console","/actuator/env","/api/admin/dashboard"))mvc.perform(get(path)).andExpect(status().isUnauthorized());
 }
}
