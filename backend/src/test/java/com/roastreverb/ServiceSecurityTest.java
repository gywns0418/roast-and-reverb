package com.roastreverb;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@AutoConfigureMockMvc
class ServiceSecurityTest {
 @Autowired MockMvc mvc;
 @Autowired ObjectMapper json;
 @Test void anonymousCannotReadRecords() throws Exception {mvc.perform(get("/api/coffee")).andExpect(status().isUnauthorized());}
 @Test void publicCatalogIsReadableWithoutOpeningOtherDataPaths() throws Exception {
  mvc.perform(get("/data/monthly-picks.json")).andExpect(status().isOk()).andExpect(jsonPath("$.schemaVersion").value(1));
  mvc.perform(get("/data/private-test.json")).andExpect(status().isUnauthorized());
  mvc.perform(get("/api/coffee")).andExpect(status().isUnauthorized());
 }
 @Test void companionRequiresLogin() throws Exception {
  mvc.perform(get("/api/companion/status")).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/companion/chat").contentType("application/json").content("{}")).andExpect(status().isUnauthorized());
 }
 @Test void publicImagesAreNotBlockedByLoginAndMalformedJsonIsClientError() throws Exception {
  mvc.perform(get("/images/missing-test-image.png")).andExpect(status().isNotFound());
  mvc.perform(post("/api/auth/join").contentType("application/json").content("{broken")).andExpect(status().isBadRequest());
 }
 @Test void signupCannotGrantAdminAndUsersAreIsolated() throws Exception {
  var signup=mvc.perform(post("/api/auth/join").contentType("application/json").content("{\"email\":\"security@example.com\",\"password\":\"secure-password-123\",\"nickname\":\"Tester\",\"role\":\"ADMIN\"}"))
    .andExpect(status().isOk()).andReturn();
  var data=json.readTree(signup.getResponse().getContentAsString()).path("data");
  assertEquals("USER",data.path("role").asText());
  String auth="Bearer "+data.path("token").asText();
  mvc.perform(get("/api/admin/dashboard").header("Authorization",auth)).andExpect(status().isForbidden());
  mvc.perform(get("/api/coffee?memberId=1").header("Authorization",auth)).andExpect(status().isOk()).andExpect(jsonPath("$.data.length()").value(0));
  for(String resource : new String[]{"coffee", "music", "pairing", "collection"})
   mvc.perform(get("/api/"+resource+"/999999").header("Authorization",auth)).andExpect(status().isNotFound());
  mvc.perform(post("/api/pairing").header("Authorization",auth).contentType("application/json").content("{\"coffeeLogId\":1,\"musicLogId\":1}")).andExpect(status().isBadRequest());
  mvc.perform(get("/api/members/me").header("Authorization",auth)).andExpect(status().isOk()).andExpect(jsonPath("$.data.password").doesNotExist());
 }
}
