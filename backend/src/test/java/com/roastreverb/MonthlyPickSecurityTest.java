package com.roastreverb;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MonthlyPickSecurityTest {
 @Autowired MockMvc mvc;
 @Autowired ObjectMapper json;
 private String account(String email) throws Exception {
  var result=mvc.perform(post("/api/auth/join").contentType("application/json").content("{\"email\":\""+email+"\",\"password\":\"coffee-test-123\",\"nickname\":\"Picker\"}")).andExpect(status().isOk()).andReturn();
  return "Bearer "+json.readTree(result.getResponse().getContentAsString()).path("data").path("token").asText();
 }
 @Test void sourceRequiresAuthenticationAndScoringCannotModifyAnotherMembersPick() throws Exception {
  String first=account("monthly-first@example.com"),second=account("monthly-second@example.com");
  mvc.perform(post("/api/monthly-picks/source").contentType("application/json").content("{\"url\":\"https://127.0.0.1/secret\"}")).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/monthly-picks/source").header("Authorization",first).contentType("application/json").content("{\"url\":\"https://127.0.0.1/secret\"}")).andExpect(status().isBadRequest());
  var created=mvc.perform(post("/api/monthly-picks").header("Authorization",first).contentType("application/json").content("{\"month\":\"2026-10\",\"roastery\":\"Test\",\"rawOptionsText\":\"#1 Test bean\"}")).andExpect(status().isOk()).andReturn();
  long id=json.readTree(created.getResponse().getContentAsString()).path("data").path("monthly_pick_id").asLong();
  mvc.perform(post("/api/monthly-picks/"+id+"/score").header("Authorization",second)).andExpect(status().isNotFound());
  mvc.perform(post("/api/monthly-picks/"+id+"/score").header("Authorization",first)).andExpect(status().isOk());
 }
}
