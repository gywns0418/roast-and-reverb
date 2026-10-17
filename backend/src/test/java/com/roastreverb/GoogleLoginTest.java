package com.roastreverb;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roastreverb.domain.member.social.GoogleIdentityVerifier;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest(properties={"GOOGLE_CLIENT_ID=test-client","APP_PUBLIC_ORIGIN=http://localhost"})
@AutoConfigureMockMvc
class GoogleLoginTest {
 @Autowired MockMvc mvc; @Autowired ObjectMapper json;
 @MockitoBean GoogleIdentityVerifier verifier;
 String origin="http://localhost";
 record Flow(MockHttpSession session,String nonce){}
 Flow begin(String auth) throws Exception {
  var request=post(auth==null?"/api/auth/google/challenge":"/api/members/me/google/challenge").header("Origin",origin).header("X-RR-Social","1");
  if(auth!=null)request.header("Authorization",auth);
  var response=mvc.perform(request).andExpect(status().isOk()).andReturn();
  return new Flow((MockHttpSession)response.getRequest().getSession(false),json.readTree(response.getResponse().getContentAsString()).path("data").path("nonce").asText());
 }
 Jwt identity(Flow flow,String sub,String email,String audience,String nonce,boolean verified,Instant expiry) {
  return Jwt.withTokenValue("test").header("alg","RS256").issuer("https://accounts.google.com").subject(sub).audience(List.of(audience)).issuedAt(Instant.now().minusSeconds(10)).expiresAt(expiry).claim("email",email).claim("email_verified",verified).claim("name","Google test").claim("nonce",nonce).build();
 }
 org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder finish(Flow flow,String value) {
  return post("/api/auth/google/complete").session(flow.session()).header("Origin",origin).header("X-RR-Social","1").contentType("application/json").content("{\"credential\":\""+value+"\"}");
 }
 @Test void browserProofAndLinkRequireProtection() throws Exception {
  mvc.perform(post("/api/auth/google/challenge").header("Origin","http://localhost:5199").header("X-RR-Social","1")).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/auth/google/challenge").header("Origin",origin)).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/members/me/google/challenge").header("Origin",origin).header("X-RR-Social","1")).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/auth/google/complete").header("Origin",origin).header("X-RR-Social","1").contentType("application/json").content("{\"credential\":\"bad\"}")).andExpect(status().isUnauthorized());
 }
 @Test void verifiedSubjectReturnsSameAccountAndNonceCannotReplay() throws Exception {
  Flow flow=begin(null);when(verifier.verify("valid")).thenReturn(identity(flow,"new-google-sub","google-new@example.com","test-client",flow.nonce(),true,Instant.now().plusSeconds(300)));
  var first=mvc.perform(finish(flow,"valid")).andExpect(status().isOk()).andExpect(jsonPath("$.data.role").value("USER")).andReturn();
  long id=json.readTree(first.getResponse().getContentAsString()).path("data").path("memberId").asLong();
  mvc.perform(finish(flow,"valid")).andExpect(status().isUnauthorized());
  Flow next=begin(null);when(verifier.verify("next")).thenReturn(identity(next,"new-google-sub","google-new@example.com","test-client",next.nonce(),true,Instant.now().plusSeconds(300)));
  mvc.perform(finish(next,"next")).andExpect(status().isOk()).andExpect(jsonPath("$.data.memberId").value(id));
 }
 @Test void badAudienceNonceEmailAndExpiryAreRejected() throws Exception {
  for(int n=0;n<4;n++) {
   Flow flow=begin(null);String key="bad"+n;
   when(verifier.verify(key)).thenReturn(identity(flow,"bad-sub","bad@example.com",n==0?"other-client":"test-client",n==1?"wrong":flow.nonce(),n!=2,n==3?Instant.now().minusSeconds(1):Instant.now().plusSeconds(300)));
   mvc.perform(finish(flow,key)).andExpect(status().isUnauthorized());
  }
 }
 @Test void existingEmailNeverAutoLinksAndExplicitLinkPreservesRecords() throws Exception {
  var joined=mvc.perform(post("/api/auth/join").contentType("application/json").content("{\"email\":\"google-existing@example.com\",\"password\":\"safe-test-password\",\"nickname\":\"Existing\"}")).andExpect(status().isOk()).andReturn();
  var member=json.readTree(joined.getResponse().getContentAsString()).path("data");long id=member.path("memberId").asLong();String auth="Bearer "+member.path("token").asText();
  mvc.perform(post("/api/coffee").header("Authorization",auth).contentType("application/json").content("{\"beanName\":\"Account preservation fixture\",\"drinkDate\":\"2026-10-01\"}")).andExpect(status().isOk());
  Flow anonymous=begin(null);when(verifier.verify("collision")).thenReturn(identity(anonymous,"existing-sub","google-existing@example.com","test-client",anonymous.nonce(),true,Instant.now().plusSeconds(300)));
  mvc.perform(finish(anonymous,"collision")).andExpect(status().isConflict());
  Flow link=begin(auth);when(verifier.verify("link")).thenReturn(identity(link,"existing-sub","google-existing@example.com","test-client",link.nonce(),true,Instant.now().plusSeconds(300)));
  // A link challenge cannot be completed without the original authenticated account.
  mvc.perform(finish(link,"link")).andExpect(status().isUnauthorized());
  link=begin(auth);when(verifier.verify("link")).thenReturn(identity(link,"existing-sub","google-existing@example.com","test-client",link.nonce(),true,Instant.now().plusSeconds(300)));
  mvc.perform(finish(link,"link").header("Authorization",auth)).andExpect(status().isOk()).andExpect(jsonPath("$.data.memberId").value(id));
  Flow login=begin(null);when(verifier.verify("linked-login")).thenReturn(identity(login,"existing-sub","google-existing@example.com","test-client",login.nonce(),true,Instant.now().plusSeconds(300)));
  var signed=mvc.perform(finish(login,"linked-login")).andExpect(status().isOk()).andReturn();
  String token=json.readTree(signed.getResponse().getContentAsString()).path("data").path("token").asText();
  mvc.perform(get("/api/coffee").header("Authorization","Bearer "+token)).andExpect(status().isOk()).andExpect(jsonPath("$.data.length()").value(1));
 }
}
