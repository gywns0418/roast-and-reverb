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
class CoffeeBrewDetailsTest {
 @Autowired MockMvc mvc;
 @Autowired ObjectMapper json;
 @Test void detailsSurvivePartialUpdateAndInvalidMeasurementsAreRejected() throws Exception {
  var signup=mvc.perform(post("/api/auth/join").contentType("application/json").content("{\"email\":\"brew-test@example.com\",\"password\":\"coffee-test-123\",\"nickname\":\"Brewer\"}"))
   .andExpect(status().isOk()).andReturn();
  var user=json.readTree(signup.getResponse().getContentAsString()).path("data");
  String auth="Bearer "+user.path("token").asText();
  var created=mvc.perform(post("/api/coffee").header("Authorization",auth).contentType("application/json").content("{\"beanName\":\"Measured coffee\",\"drinkDate\":\"2026-10-07\",\"waterTemp\":92,\"grindSize\":\"51 clicks\",\"brewDetails\":{\"doseGrams\":16,\"waterGrams\":245,\"beverageGrams\":204,\"recordedHour\":20}}"))
   .andExpect(status().isOk()).andReturn();
  long id=json.readTree(created.getResponse().getContentAsString()).path("data").path("coffeeLogId").asLong();
  mvc.perform(put("/api/coffee/"+id).header("Authorization",auth).contentType("application/json").content("{\"memo\":\"Updated observation\"}"))
   .andExpect(status().isOk());
  var response=mvc.perform(get("/api/coffee/"+id).header("Authorization",auth)).andExpect(status().isOk()).andReturn();
  var coffee=json.readTree(response.getResponse().getContentAsString()).path("data");
  var details=json.readTree(coffee.path("brew_details").asText());
  assertEquals(245,details.path("waterGrams").asInt());
  assertEquals(204,details.path("beverageGrams").asInt());
  assertEquals(16,details.path("doseGrams").asInt());
  assertEquals(92,coffee.path("water_temp").asInt());
  assertEquals("Measured coffee",coffee.path("bean_name").asText());
  mvc.perform(put("/api/coffee/"+id).header("Authorization",auth).contentType("application/json").content("{\"brewDetails\":{\"doseGrams\":-16}}"))
   .andExpect(status().isBadRequest());
 }
}

