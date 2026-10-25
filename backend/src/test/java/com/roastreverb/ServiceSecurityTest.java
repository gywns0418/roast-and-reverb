package com.roastreverb;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
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
 @Test void cupAndSoundtrackAreSavedTogetherAndSurvivePartialEdit() throws Exception {
  var signup=mvc.perform(post("/api/auth/join").contentType("application/json").content("{\"email\":\"cup-soundtrack@example.com\",\"password\":\"test-cup-password\",\"nickname\":\"Test\"}"))
   .andExpect(status().isOk()).andReturn();
  String auth="Bearer "+json.readTree(signup.getResponse().getContentAsString()).path("data").path("token").asText();
  var details=java.util.Map.of("doseGrams",16,"momentNote","User's own cup and music impression","soundtrack",java.util.Map.of("version",1,"kind","matched","track","Fixture track","listened",false));
  var created=mvc.perform(post("/api/coffee").header("Authorization",auth).contentType("application/json").content(json.writeValueAsString(java.util.Map.of("beanName","Soundtrack fixture","drinkDate","2026-10-17","brewDetails",details))))
   .andExpect(status().isOk()).andReturn();
  long id=json.readTree(created.getResponse().getContentAsString()).path("data").path("coffeeLogId").asLong();
  mvc.perform(put("/api/coffee/"+id).header("Authorization",auth).contentType("application/json").content("{\"tasteNote\":\"Changed coffee observation\"}" )).andExpect(status().isOk());
  var fetched=mvc.perform(get("/api/coffee/"+id).header("Authorization",auth)).andExpect(status().isOk()).andReturn();
  var saved=json.readTree(json.readTree(fetched.getResponse().getContentAsString()).path("data").path("brew_details").asText());
  assertEquals(16,saved.path("doseGrams").asInt());
  assertEquals("User's own cup and music impression",saved.path("momentNote").asText());
  assertEquals("Fixture track",saved.path("soundtrack").path("track").asText());
  assertFalse(saved.path("soundtrack").path("listened").asBoolean());
  mvc.perform(get("/api/music").header("Authorization",auth)).andExpect(status().isOk()).andExpect(jsonPath("$.data.length()").value(0));
 }
 @Test void publicCatalogIsReadableWithoutOpeningOtherDataPaths() throws Exception {
  mvc.perform(get("/data/monthly-picks.json")).andExpect(status().isOk()).andExpect(jsonPath("$.schemaVersion").value(1));
  mvc.perform(get("/data/private-test.json")).andExpect(status().isUnauthorized());
  mvc.perform(get("/api/coffee")).andExpect(status().isUnauthorized());
 }
 @Test void companionRequiresLogin() throws Exception {
  mvc.perform(get("/api/companion/status")).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/companion/chat").contentType("application/json").content("{}")).andExpect(status().isUnauthorized());
 }
 @Test void importedGrinderExplanationIsPreservedWithoutTruncation() throws Exception {
  var signup=mvc.perform(post("/api/auth/join").contentType("application/json").content("{\"email\":\"grind-import@example.com\",\"password\":\"test-grind-password\",\"nickname\":\"Test\"}"))
    .andExpect(status().isOk()).andReturn();
  String auth="Bearer "+json.readTree(signup.getResponse().getContentAsString()).path("data").path("token").asText();
  String explanation="Grinder calibration explanation, preserving all original detail. ".repeat(5);
  String body=json.writeValueAsString(java.util.Map.of("beanName","Import regression fixture","drinkDate","2026-07-01","grindSize",explanation));
  var created=mvc.perform(post("/api/coffee").header("Authorization",auth).contentType("application/json").content(body))
    .andExpect(status().isOk()).andReturn();
  long id=json.readTree(created.getResponse().getContentAsString()).path("data").path("coffeeLogId").asLong();
  mvc.perform(get("/api/coffee/"+id).header("Authorization",auth)).andExpect(status().isOk())
    .andExpect(jsonPath("$.data.grind_size").value(explanation));
 }
 @Test void publicImagesAreNotBlockedByLoginAndMalformedJsonIsClientError() throws Exception {
  mvc.perform(get("/privacy.html")).andExpect(status().isNotFound());
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
